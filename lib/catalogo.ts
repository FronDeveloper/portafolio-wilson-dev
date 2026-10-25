/**
 * ============================================================
 *  Catálogo y constantes compartidas (CLIENT-SAFE)
 * ============================================================
 *  Este archivo NO importa nada de Node (crypto, fs, etc.),
 *  por eso puede importarse tanto desde componentes cliente
 *  como desde rutas de servidor.
 * ============================================================
 */

/* ------------------------------------------------------------
 * Catálogo real del portafolio (fuente: components/Pricing.jsx)
 * ---------------------------------------------------------- */

export const CATALOGO = {
  landing: {
    nombre: "Landing Page",
    precio: "desde $1.200.000 COP",
    plazo: "5-7 días",
    soporte: "1 mes de soporte gratuito",
    incluye: [
      "Diseño responsive",
      "Hasta 5 secciones",
      "Formulario de contacto",
      "Optimización SEO básica",
      "Entrega en 5-7 días",
      "1 mes de soporte gratuito",
    ],
  },
  ecommerce: {
    nombre: "E-commerce",
    precio: "desde $3.200.000 COP",
    plazo: "3-4 semanas",
    soporte: "3 meses de soporte gratuito",
    incluye: [
      "Catálogo de productos",
      "Carrito de compras",
      "Pasarela de pagos",
      "Panel de administración",
      "Optimización para conversiones",
      "3 meses de soporte gratuito",
    ],
  },
  app: {
    nombre: "App a Medida",
    precio: "desde $6.000.000 COP",
    plazo: "6-8 semanas",
    soporte: "6 meses de soporte gratuito",
    incluye: [
      "Desarrollo a medida",
      "Panel de administración",
      "Base de datos a tu medida",
      "Integraciones personalizadas",
      "Despliegue incluido",
      "6 meses de soporte gratuito",
    ],
  },
} as const;

/** Etiquetas del select del formulario (coherentes con /cotizar) */
export const PROYECTO_LABELS: Record<string, string> = {
  landing: "Landing Page / Sitio web",
  ecommerce: "E-commerce / Tienda online",
  app: "App a medida / Sistema",
  dashboard: "Dashboard / Panel administrativo",
  otro: "No estoy seguro / Necesito asesoría",
};

export const PRESUPUESTO_LABELS: Record<string, string> = {
  "menos-1m": "Menos de $1.000.000 COP",
  "1m-2m": "$1.000.000 - $2.000.000 COP",
  "2m-3m5": "$2.000.000 - $3.500.000 COP",
  "mas-3m5": "Más de $3.500.000 COP",
  "no-definido": "Aún no lo tengo claro",
};

/** Fecha legible en hora de Bogotá */
export function fechaBogota(ms: number = Date.now()): string {
  return new Date(ms).toLocaleString("es-CO", { timeZone: "America/Bogota" });
}

/** URL pública base del portafolio */
export const SITE_BASE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://wvalencia-dev.vercel.app";

/* ------------------------------------------------------------
 * Tipos compartidos
 * ---------------------------------------------------------- */

export interface SolicitudPropuesta {
  nombre: string;
  whatsapp: string; // normalizado, ej: 573012821174
  email: string;
  tipo: string;
  presupuesto: string;
  detalles: string;
  historial?: { role: string; content: string }[];
}

export interface PropuestaPayload {
  n: string; // nombre cliente
  e: string; // email cliente
  w: string; // whatsapp cliente normalizado ("" si no tiene)
  t: string; // tipo proyecto (key)
  b: string; // presupuesto (key)
  d: string; // detalle de la necesidad
  p: string; // texto de la propuesta (editable por Wilson)
  m: string; // modelo usado: "ia" | "plantilla"
  ts: number; // creación (ms)
  exp: number; // expiración (ms)
}
