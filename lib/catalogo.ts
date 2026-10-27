/**
 * ============================================================
 *  Constantes compartidas (CLIENT-SAFE)
 * ============================================================
 *  Los precios, planes y presupuestos viven en `lib/pricing.ts`.
 *  Este archivo se mantiene como punto de importación compatible
 *  para el resto del proyecto y añade los tipos de la propuesta.
 * ============================================================
 */

import { SITE_URL } from "./pricing";

export {
  CAPACIDADES_ADICIONALES,
  CAPACIDADES_PAGO,
  CATALOGO,
  CONTACT_EMAIL,
  COP_POR_USD,
  HORA_EXTRA,
  MANTENIMIENTO,
  PLANES,
  PLANES_MANTENIMIENTO,
  PLAN_POR_ID,
  PRESUPUESTOS,
  PRESUPUESTO_LABELS,
  PROYECTO_LABELS,
  SITE_URL,
  SOPORTE_NOTA,
  TIPOS_PROYECTO,
  WHATSAPP_PHONE,
  etiquetaPresupuesto,
  formatearCOP,
  formatearUSD,
  planParaTipo,
  precioDesde,
  precioMantenimiento,
  resumenPrecios,
} from "./pricing";

export type { Moneda, Plan, PlanId, PrecioBase } from "./pricing";

/** URL pública base del portafolio (alias histórico). */
export const SITE_BASE = SITE_URL;

/** Fecha legible en hora de Bogotá */
export function fechaBogota(ms: number = Date.now()): string {
  return new Date(ms).toLocaleString("es-CO", { timeZone: "America/Bogota" });
}

/* ------------------------------------------------------------
 * Tipos compartidos del flujo de propuestas
 * ---------------------------------------------------------- */

export interface SolicitudPropuesta {
  nombre: string;
  whatsapp: string; // normalizado, ej: 573012821174
  email: string;
  tipo: string;
  presupuesto: string;
  detalles: string;
  historial?: { role: string; content: string }[];
  /** Origen del lead (UTM + página), opcional */
  origen?: Record<string, string>;
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
