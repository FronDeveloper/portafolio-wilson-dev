/**
 * ============================================================
 *  FASE 2 — Motor de propuestas con aprobación previa
 *  Wilson Valencia Dev        (SERVER-ONLY: usa node:crypto)
 * ============================================================
 *  Flujo:
 *   1. El cliente pide la propuesta desde el chat de Alma
 *   2. Groq redacta un borrador con los precios/servicios reales
 *   3. El borrador viaja FIRMADO (HMAC-SHA256) en un enlace
 *      que llega SOLO al email de Wilson
 *   4. Wilson revisa, edita y aprueba en /propuesta/revisar
 *   5. Se abre WhatsApp con la propuesta lista para el cliente
 *
 *  Sin base de datos: todo viaja dentro del token firmado.
 *  Sin env vars nuevas: firma con APPROVAL_SECRET o
 *  DIAGNOSTICS_KEY (Wilson ya la tiene configurada en Vercel).
 *
 *  Las constantes compartidas (catálogo, etiquetas) viven en
 *  lib/catalogo.ts, que sí es seguro para componentes cliente.
 * ============================================================
 */

import crypto from "crypto";
import {
  CATALOGO,
  MANTENIMIENTO,
  PLAN_POR_ID,
  PRESUPUESTO_LABELS,
  PROYECTO_LABELS,
  SOPORTE_NOTA,
  etiquetaPresupuesto,
  formatearCOP,
  formatearUSD,
  planParaTipo,
  type SolicitudPropuesta,
  type PropuestaPayload,
} from "./catalogo";
import { completarChat } from "./ai";

// Re-export para que las rutas de servidor importen todo de un solo lugar
export {
  CATALOGO,
  PROYECTO_LABELS,
  PRESUPUESTO_LABELS,
  fechaBogota,
  SITE_BASE,
} from "./catalogo";
export type { SolicitudPropuesta, PropuestaPayload } from "./catalogo";

/* ------------------------------------------------------------
 * Constantes del motor
 * ---------------------------------------------------------- */

const PROPUESTA_MAX_CHARS = 1600;

/* ------------------------------------------------------------
 * Utilidades de sanitización y formato
 * ---------------------------------------------------------- */

export function limpiarTexto(v: unknown, maxLen: number): string {
  if (typeof v !== "string") return "";
  return v.replace(/\s+/g, " ").trim().slice(0, maxLen);
}

/** Escapa HTML para interpolación segura en los emails */
export function escapeHtml(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Normaliza un número de WhatsApp a formato internacional 57XXXXXXXXXX */
export function normalizarWhatsApp(input: string): string {
  if (!input) return "";
  let digits = input.replace(/[^0-9]/g, "");
  if (!digits) return "";
  // 10 dígitos locales (ej: 3012821174) → anteponer 57
  if (digits.length === 10 && digits.startsWith("3")) digits = "57" + digits;
  if (digits.startsWith("57") && digits.length === 12) return digits;
  return digits.slice(0, 16);
}

/* ------------------------------------------------------------
 * Firma HMAC (stateless, sin base de datos)
 * ---------------------------------------------------------- */

function getSecret(): string {
  // Cero config: reutiliza la DIAGNOSTICS_KEY que Wilson ya puso en Vercel.
  // Si algún día quiere rotar la firma, agrega APPROVAL_SECRET y gana.
  return process.env.APPROVAL_SECRET || process.env.DIAGNOSTICS_KEY || "";
}

export function firmarToken(payload: PropuestaPayload): string {
  const secret = getSecret();
  if (!secret) {
    throw new Error(
      "[Alma] Falta APPROVAL_SECRET o DIAGNOSTICS_KEY para firmar propuestas"
    );
  }
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("base64url");
  return `${body}.${sig}`;
}

export type VerifyResult =
  | { ok: true; payload: PropuestaPayload }
  | { ok: false; razon: "sin-secreto" | "formato" | "firma" | "expirado" };

export function verificarToken(token: string): VerifyResult {
  const secret = getSecret();
  if (!secret) return { ok: false, razon: "sin-secreto" };

  const parts = String(token || "").split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { ok: false, razon: "formato" };
  }
  const [body, sig] = parts;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("base64url");

  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, razon: "firma" };
  }

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8")
    ) as PropuestaPayload;
    if (!payload || typeof payload.p !== "string" || !payload.ts) {
      return { ok: false, razon: "formato" };
    }
    if (Date.now() > (payload.exp || 0)) {
      return { ok: false, razon: "expirado" };
    }
    return { ok: true, payload };
  } catch {
    return { ok: false, razon: "formato" };
  }
}

/* ------------------------------------------------------------
 * Rate limit ligero en memoria (por instancia serverless)
 * ---------------------------------------------------------- */

const hitsPorIp = new Map<string, number[]>();

export function rateLimitOk(
  ip: string,
  max = 5,
  ventanaMs = 60 * 60 * 1000
): boolean {
  const now = Date.now();
  const hits = (hitsPorIp.get(ip) || []).filter((t) => now - t < ventanaMs);
  if (hits.length >= max) {
    hitsPorIp.set(ip, hits);
    return false;
  }
  hits.push(now);
  hitsPorIp.set(ip, hits);
  if (hitsPorIp.size > 5000) hitsPorIp.clear(); // higiene de memoria
  return true;
}

/* ------------------------------------------------------------
 * Prompt + generación de propuesta con Groq
 * ---------------------------------------------------------- */

function construirSystemPrompt(): string {
  const c = CATALOGO;
  return `Eres el asesor comercial de Wilson Valencia, desarrollador full-stack freelance colombiano (portafolio: https://wvalencia-dev.vercel.app, WhatsApp +57 301 2821174). Redactas propuestas de proyecto hablando EN NOMBRE de Wilson, en español de Colombia, tono cálido, humano y profesional (de tuteo), en primera persona.

CATÁLOGO REAL DE WILSON (COP):
1. ${c.landing.nombre} — ${c.landing.precio} — ${c.landing.incluye.join(", ")}. Plazo: ${c.landing.plazo}. Soporte: ${c.landing.soporte}.
2. ${c.ecommerce.nombre} — ${c.ecommerce.precio} — ${c.ecommerce.incluye.join(", ")}. Plazo: ${c.ecommerce.plazo}. Soporte: ${c.ecommerce.soporte}.
3. ${c.saas.nombre} — ${c.saas.precio} — ${c.saas.incluye.join(", ")}. Plazo: ${c.saas.plazo}. Soporte: ${c.saas.soporte}.
4. ${MANTENIMIENTO.nombre} — desde ${formatearCOP(MANTENIMIENTO.desde.cop)} COP/mes (${formatearUSD(MANTENIMIENTO.desde.usd)} USD/mes) — ${MANTENIMIENTO.incluye.join(", ")}.

SOPORTE: ${SOPORTE_NOTA}

REGLAS:
- Los precios son "desde" y referenciales. Si el presupuesto del cliente es menor al plan recomendado, propone una versión reducida por fases (ej: empezar con una landing y escalar después) en lugar de inventar descuentos.
- NUNCA inventes precios, plazos ni servicios que no estén en el catálogo.
- Elige el plan del catálogo que mejor encaje con la necesidad del cliente (si dijo "no estoy seguro", deduce por la descripción y dilo con naturalidad).
- Si el cliente pide mantenimiento, usa el plan mensual y aclara que el alcance se acuerda por escrito.
- Pagos: puedes mencionar que Wilson integra pasarelas colombianas (Wompi, PSE, Efecty) e internacionales (Stripe, PayPal, Mercado Pago) según el país y la cuenta del cliente. No prometas un proveedor específico sin validarlo.
- WordPress: Wilson ha trabajado con WordPress, pero no lo presentes como su especialidad principal.

FORMATO (el texto se enviará por WhatsApp):
- Máximo ${PROPUESTA_MAX_CHARS} caracteres.
- Texto plano estilo WhatsApp: *negritas* con asteriscos. Prohibido markdown de encabezados (#), tablas o listas numeradas complejas.
- Estructura exacta:
  1) Saludo breve con el nombre del cliente.
  2) 1-2 frases mostrando que entendiste SU necesidad concreta.
  3) *Lo que te propongo* + 3 o 4 bullets con ✅ (servicios del plan elegido, ajustados a lo que pidió).
  4) *Inversión y plazo* — precio del catálogo + plazo. Menciona el soporte incluido.
  5) *Siguiente paso* — propon una llamada o conversación corta por WhatsApp, sin compromiso.
  6) Firma: Wilson Valencia — wvalencia-dev.vercel.app
- Cero frases genéricas de marketing, máximo 3-4 emojis en todo el texto.
Devuelve ÚNICAMENTE el texto de la propuesta, sin introducciones tipo "aquí tienes".`;
}

function construirUserPrompt(s: SolicitudPropuesta): string {
  const tipo = PROYECTO_LABELS[s.tipo] || s.tipo || "sin especificar";
  const presupuesto = etiquetaPresupuesto(s.presupuesto);

  let conversacion = "";
  if (Array.isArray(s.historial) && s.historial.length > 0) {
    const recientes = s.historial
      .filter((m) => m && typeof m.content === "string" && m.content.trim())
      .slice(-8)
      .map(
        (m) =>
          `${m.role === "assistant" ? "Alma" : "Cliente"}: ${limpiarTexto(
            m.content,
            400
          )}`
      )
      .join("\n");
    conversacion = `\n\nCONVERSACIÓN PREVIA EN EL CHAT (para que entiendas el contexto):\n${recientes}`;
  }

  return `DATOS DEL CLIENTE:
- Nombre: ${s.nombre}
- Tipo de proyecto que eligió: ${tipo}
- Presupuesto que declaró: ${presupuesto}
- Lo que necesita (lo escribió el cliente): ${
    s.detalles || "(no detalló, deduce del chat)"
  }${conversacion}`;
}

/** Propuesta de respaldo determinista, por si la IA falla (el flujo nunca se cae) */
export function propuestaDeRespaldo(s: SolicitudPropuesta): string {
  if (s.tipo === "mantenimiento") {
    const bullets = MANTENIMIENTO.incluye
      .slice(0, 4)
      .map((f) => `✅ ${f}`)
      .join("\n");

    return `Hola ${s.nombre || ""}! 👋 Gracias por escribir y contarme sobre tu proyecto.

Entiendo que necesitas mantener y cuidar un sistema que ya está en funcionamiento.

*Lo que te propongo*
${bullets}

*Inversión y plazo*
${MANTENIMIENTO.nombre} desde ${formatearCOP(
      MANTENIMIENTO.desde.cop
    )} COP/mes (${formatearUSD(
      MANTENIMIENTO.desde.usd
    )} USD/mes). El alcance y las horas incluidas los acordamos por escrito según el tamaño del sistema.

*Siguiente paso*
¿Te parece si hablamos 15 minutos por WhatsApp? Reviso contigo qué necesita el sistema y te confirmo el plan, sin ningún compromiso.

Wilson Valencia — wvalencia-dev.vercel.app`;
  }

  const plan = planParaTipo(s.tipo, s.presupuesto);
  const info = PLAN_POR_ID[plan.id];

  const bullets = info.incluye
    .slice(0, 4)
    .map((f) => `✅ ${f}`)
    .join("\n");

  const soporte =
    info.soporteMeses === 1
      ? "1 mes de soporte incluido"
      : `${info.soporteMeses} meses de soporte incluido`;

  return `Hola ${s.nombre || ""}! 👋 Gracias por escribir y contarme sobre tu proyecto.

Basándome en lo que me cuentas, te propongo un ${info.nombre} pensado a la medida de tu negocio.

*Lo que te propongo*
${bullets}

*Inversión y plazo*
Desde ${formatearCOP(info.desde.cop)} COP (${formatearUSD(
    info.desde.usd
  )} USD) · entrega estimada en ${info.plazo}, con ${soporte}.

*Siguiente paso*
¿Te parece si hablamos 15 minutos por WhatsApp? Con una llamada corta ajusto el alcance a tu idea y te confirmo el precio final, sin ningún compromiso.

Wilson Valencia — wvalencia-dev.vercel.app`;
}

/** Limpia la salida del modelo para WhatsApp */
function limpiarSalidaModelo(texto: string): string {
  let out = (texto || "").trim();
  out = out.replace(/^["“”']+|["“”']+$/g, ""); // comillas envolventes
  out = out.replace(/^#{1,6}\s*/gm, ""); // encabezados markdown
  out = out.replace(/\*\*([^*]+)\*\*/g, "*$1*"); // **negrita** → *negrita*
  out = out.replace(/\n{3,}/g, "\n\n");
  if (out.length > PROPUESTA_MAX_CHARS + 200) {
    out = out.slice(0, PROPUESTA_MAX_CHARS + 200);
  }
  return out.trim();
}

/**
 * Genera la propuesta. Devuelve el texto y si vino de la IA o de la plantilla.
 * Si todos los proveedores fallan, usa la plantilla local (nunca rompe).
 */
export async function generarPropuesta(
  s: SolicitudPropuesta
): Promise<{ texto: string; modelo: "ia" | "plantilla" }> {
  try {
    const completion = await completarChat({
      messages: [
        { role: "system", content: construirSystemPrompt() },
        { role: "user", content: construirUserPrompt(s) },
      ],
      temperature: 0.6,
      maxTokens: 1000,
      timeoutMs: 30_000,
    });

    if (!completion) {
      console.error("[Alma] Propuesta: sin respuesta de la IA, uso plantilla");
      return { texto: propuestaDeRespaldo(s), modelo: "plantilla" };
    }

    const texto = limpiarSalidaModelo(completion.text);
    if (!texto || texto.length < 120) {
      console.error("[Alma] Propuesta: respuesta de IA vacía o muy corta");
      return { texto: propuestaDeRespaldo(s), modelo: "plantilla" };
    }
    return { texto, modelo: "ia" };
  } catch (err) {
    console.error("[Alma] Propuesta: error llamando a la IA:", err);
    return { texto: propuestaDeRespaldo(s), modelo: "plantilla" };
  }
}
