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
3. ## Cómo trabajamos (el proceso de Wilson en 4 pasos: 1) conversamos y definimos el alcance, 2) diseño y plan de trabajo, 3) desarrollo con entregas parciales y comunicación directa, 4) lanzamiento y soporte)
4. ## Tiempo estimado (rango prudente usando el tiempo de referencia entregado; deja claro que se confirma tras definir el alcance)
5. ## Inversión estimada (usa la inversión de referencia entregada como rango "desde"; aclara que la cotización final se confirma después de revisar el alcance; menciona que incluye 30 días de soporte post-lanzamiento)
6. ## Por qué trabajar conmigo (2-3 líneas. PUEDES mencionar proyectos reales SOLO de esta lista y únicamente los que apliquen: FlowBill (SaaS para agencias creativas), AgendaPro (reservas en línea), VentaChat AI (atención comercial por WhatsApp con IA), InsightAI Dashboard (dashboard de inventario y ventas), PisArte (e-commerce de calzado), Mínimo Studio (e-commerce de moda), Saberly (gestión escolar multiinstitución), ARISE Shadow System (app móvil de entrenamiento gamificada), Fundación FAEBO (sitio institucional). Menciona tecnologías solo si suman: React, Next.js, TypeScript, Node.js, Flutter, Firebase, Supabase, PostgreSQL, MySQL, Stripe, Wompi, PSE, Efecty, integraciones de IA)
7. ## Siguiente paso (invita a una conversación de 15-20 minutos para afinar el alcance; WhatsApp de Wilson: https://wa.me/573012821174 ; también puede usar https://wvalencia-dev.vercel.app/cotizar ; firma: Wilson Valencia — Desarrollador Full-Stack — wvalencia-dev.vercel.app)

# REGLAS ESTRICTAS
- Tono: profesional, cálido, directo. Tutea al cliente. Cero lenguaje de venta agresivo, cero exageraciones.
- Máximo ~450 palabras en total. Frases cortas. Máximo 2 emojis en toda la propuesta.
- NO inventes: funcionalidades no pedidas, fechas exactas garantizadas, métricas, clientes, testimonios, descuentos ni garantías de resultados.
- Si el presupuesto indicado está por debajo del rango coherente, NO rechaces el proyecto: propone un alcance inicial (MVP) que quepa en ese presupuesto y deja abierta la escalabilidad futura.
- Si faltan datos clave del alcance, agrega al final una sección corta "## Para afinar la cotización" con 2 o 3 preguntas concretas.
- Usa Markdown simple: encabezados con ##, negritas con **, listas con -. Sin tablas, sin código HTML.
- Salida: SOLO la propuesta en Markdown. Sin preámbulos, sin comentarios, sin bloque de código.
`.trim();
