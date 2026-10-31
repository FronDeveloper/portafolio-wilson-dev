/**
 * Fase 2 — Panel privado de propuestas (/panel)
 *
 * ⚠️ SOLO SERVIDOR (usa node:crypto). No importar desde componentes cliente.
 *
 * Flujo: Wilson entra a /panel → contraseña (PANEL_PASSWORD) → cookie de
 * sesión 7 días → pega los datos del lead → Groq redacta un borrador →
 * Wilson lo edita, lo aprueba y lo entrega ÉL MISMO (copia / descarga HTML).
 * Ninguna propuesta sale automáticamente: requisito explícito de Wilson.
 */

import crypto from "node:crypto";
import { CAL_URL, SITE_HOST, SITE_URL } from "./pricing";

// ── Sesión del panel ─────────────────────────────────────────────────────────

export const PANEL_COOKIE = "alma_panel";
export const PANEL_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

function panelToken(password: string): string {
  return crypto
    .createHash("sha256")
    .update(`alma-panel-v1::${password}`)
    .digest("hex");
}

/** Token válido para la contraseña actual (si cambia la contraseña, las
 *  sesiones anteriores se invalidan solas). Comparación en tiempo constante. */
export function isValidPanelToken(value: string | undefined | null): boolean {
  const password = process.env.PANEL_PASSWORD;
  if (!password || !value) return false;
  const expected = panelToken(password);
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function expectedPanelToken(): string | null {
  const password = process.env.PANEL_PASSWORD;
  if (!password) return null;
  return panelToken(password);
}

/** Verifica la contraseña del panel en tiempo constante. */
export function checkPanelPassword(password: string): boolean {
  const expected = expectedPanelToken();
  if (!expected) return false;
  const candidate = crypto
    .createHash("sha256")
    .update(`alma-panel-v1::${password}`)
    .digest("hex");
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ── Rate limit simple (misma técnica que /api/chat) ─────────────────────────

export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, { count: number; reset: number }>();
  return (ip: string): boolean => {
    const now = Date.now();
    const entry = hits.get(ip);
    if (!entry || now > entry.reset) {
      hits.set(ip, { count: 1, reset: now + windowMs });
      if (hits.size > 500) {
        for (const [key, value] of hits) if (now > value.reset) hits.delete(key);
      }
      return false;
    }
    entry.count += 1;
    return entry.count > limit;
  };
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  );
}

// ── Generador de propuestas ──────────────────────────────────────────────────

export type ProposalInput = {
  clientName: string;
  contact: string;
  projectType: string;
  need: string;
  budget: string;
  extra: string;
};

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  landing: "Landing page / Sitio institucional",
  ecommerce: "E-commerce / Tienda online",
  saas: "SaaS / Sistema a medida",
  app: "App móvil",
  dashboard: "Dashboard / Panel administrativo",
  otro: "Otro / Por definir",
};

const TIEMPOS: Record<string, string> = {
  landing: "1 a 2 semanas",
  ecommerce: "2 a 4 semanas",
  saas: "3 a 8 semanas",
  app: "4 a 10 semanas",
  dashboard: "2 a 5 semanas",
  otro: "por definir tras revisar el alcance",
};

const INVERSION: Record<string, string> = {
  landing: "desde $1.200.000 COP",
  ecommerce: "desde $3.200.000 COP",
  saas: "desde $6.000.000 COP",
  app: "desde $6.000.000 COP",
  dashboard: "desde $3.200.000 COP",
  otro: "se estima tras definir el alcance (referencias: landing desde $1.200.000 COP, e-commerce desde $3.200.000 COP, sistema a medida desde $6.000.000 COP)",
};

export function buildProposalUserPrompt(data: ProposalInput): string {
  const tipo =
    PROJECT_TYPE_LABELS[data.projectType] || PROJECT_TYPE_LABELS.otro;
  return `
Redacta la propuesta comercial con estos datos:

- Nombre del cliente: ${data.clientName}
- Contacto: ${data.contact || "No indicó"}
- Tipo de proyecto: ${tipo}
- Necesidad relatada por el cliente: ${data.need}
- Presupuesto indicado por el cliente: ${data.budget || "No indicó"}
- Detalles adicionales: ${data.extra || "Ninguno"}

Tiempo de referencia para este tipo de proyecto: ${TIEMPOS[data.projectType] || TIEMPOS.otro}.
Inversión de referencia para este tipo de proyecto: ${INVERSION[data.projectType] || INVERSION.otro}.
`.trim();
}

export const PROPOSAL_SYSTEM_PROMPT = `
Eres el redactor de propuestas comerciales de Wilson Valencia, desarrollador full-stack freelance de Colombia. Escribes propuestas que Wilson va a REVISAR PERSONALMENTE antes de enviarlas: tu borrador debe llegar listo con mínima edición.

# TAREA
Con los datos del cliente, escribe una propuesta comercial profesional, cálida y honesta, en español, en formato Markdown.

# ESTRUCTURA OBLIGATORIA (usa exactamente estos encabezados con ##)
1. ## Saludo (2-3 frases dirigidas al cliente por su nombre: empatiza con su problema de negocio, sin repetir textualmente lo que escribió)
2. ## Qué te propongo (la solución concreta: tipo de producto y de 3 a 6 funcionalidades clave derivadas de la necesidad. No inventes funcionalidades que el cliente no pidió)
3. ## Qué incluye (lista de 4 a 6 entregables verificables: diseño responsive, desarrollo, despliegue, pruebas, capacitación breve, documentación mínima, etc. Solo lo que aplique al tipo de proyecto)
4. ## Qué NO incluye (lista honesta de exclusiones: hosting y dominio, costos de pasarelas de pago y licencias de terceros, redacción o producción de contenido/fotos, integraciones no mencionadas, mantenimiento mensual —que es un plan aparte—, cambios de alcance posteriores. Ajusta según el proyecto, no inventes extras que el cliente sí pidió)
5. ## Cómo trabajamos (el proceso de Wilson en 4 pasos: 1) conversamos y definimos el alcance por escrito, 2) diseño y plan de trabajo, 3) desarrollo con entregas parciales y comunicación directa, 4) lanzamiento y soporte)
6. ## Tiempo estimado (rango prudente usando el tiempo de referencia entregado; deja claro que se confirma tras definir el alcance)
7. ## Inversión y forma de pago (usa la inversión de referencia entregada como rango "desde"; la cotización final se confirma después de revisar el alcance. Forma de pago: 50% de anticipo para iniciar y 50% contra entrega y aprobación. Medios en Colombia: transferencia bancaria o link de pago Wompi (tarjeta/PSE). Para clientes internacionales, el medio se acuerda en la propuesta. Aclara que los precios están en pesos colombianos y que los impuestos aplicables, si los hay, se discriminan en la factura. Validez de la propuesta: 15 días calendario.)
8. ## Garantía y soporte (incluye 30 días de soporte post-lanzamiento para corregir errores del alcance entregado, sin costo. No cubre cambios nuevos ni funcionalidades adicionales. Después de ese periodo está disponible el mantenimiento mensual: Básico $250.000 COP (1 h/mes), Estándar $350.000 COP (2 h/mes, el más elegido) y Premium $750.000 COP (4 h/mes); hora adicional $100.000 COP. Menciona solo los planes, sin presionar)
9. ## Propiedad intelectual (al completar el pago total, el cliente es dueño del código y de los entregables del proyecto. Wilson conserva el derecho de mostrar el trabajo en su portafolio, salvo que se acuerde confidencialidad por escrito. Las librerías y servicios de terceros mantienen sus propias licencias)
10. ## Por qué trabajar conmigo (2-3 líneas. PUEDES mencionar proyectos reales SOLO de esta lista y únicamente los que apliquen: FlowBill (SaaS para agencias creativas), AgendaPro (reservas en línea), VentaChat AI (atención comercial por WhatsApp con IA), InsightAI Dashboard (dashboard de inventario y ventas), PisArte (e-commerce de calzado), Mínimo Studio (e-commerce de moda), Saberly (gestión escolar multiinstitución), ARISE Shadow System (app móvil de entrenamiento gamificada), Fundación FAEBO (sitio institucional). Menciona tecnologías solo si suman: React, Next.js, TypeScript, Node.js, Flutter, Firebase, Supabase, PostgreSQL, MySQL, Stripe, Wompi, PSE, Efecty, integraciones de IA)
11. ## Siguiente paso (invita a una conversación de 15 minutos para afinar el alcance; para agendar puede elegir el horario directo aquí: ${CAL_URL} ; WhatsApp de Wilson: https://wa.me/573012821174 ; también puede escribir por ${SITE_URL}/cotizar). Cierra con la firma exacta en una línea aparte:
**Wilson Valencia** — Desarrollador Full-Stack — WhatsApp +57 301 2821174 — ${SITE_HOST}

# REGLAS ESTRICTAS
- Tono: profesional, cálido, directo. Tutea al cliente. Cero lenguaje de venta agresivo, cero exageraciones.
- Máximo ~600 palabras en total. Frases cortas. Máximo 3 emojis en toda la propuesta.
- NO inventes: funcionalidades no pedidas, fechas exactas garantizadas, métricas, clientes, testimonios, descuentos ni garantías de resultados.
- NUNCA prometas "100% confidencial", facturación electrónica ni precios con IVA incluido: no están confirmados.
- Si el presupuesto indicado está por debajo del rango coherente, NO rechaces el proyecto: propone un alcance inicial (MVP) que quepa en ese presupuesto y deja abierta la escalabilidad futura.
- Si faltan datos clave del alcance, agrega al final una sección corta "## Para afinar la cotización" con 2 o 3 preguntas concretas, ANTES de la firma.
- Usa Markdown simple: encabezados con ##, negritas con **, listas con -. Sin tablas, sin código HTML.
- Salida: SOLO la propuesta en Markdown. Sin preámbulos, sin comentarios, sin bloque de código.
`.trim();
