/**
 * ============================================================
 *  Persistencia de leads — Fase 3 del panel
 *  Wilson Valencia Dev        (SERVER-ONLY)
 * ============================================================
 *  Guarda cada lead (chat de Alma, /cotizar, /contact) en una base
 *  de datos Postgres para que Wilson los gestione en /panel/leads.
 *
 *  ⚠️ OPCIONAL: si DATABASE_URL no está configurada, NADA se rompe —
 *  los leads siguen llegando por correo como siempre y el panel lo
 *  indica con instrucciones para activarla (Neon/Supabase gratis).
 *
 *  La tabla se crea sola en el primer uso (CREATE TABLE IF NOT
 *  EXISTS): no hay paso de migración manual.
 * ============================================================
 */

import type { Pool as PgPool } from "pg";

export const ESTADOS_LEAD = [
  "nuevo",
  "calificado",
  "llamada",
  "propuesta",
  "cerrado",
  "descartado",
] as const;

export type EstadoLead = (typeof ESTADOS_LEAD)[number];

export const ETIQUETA_ESTADO: Record<EstadoLead, string> = {
  nuevo: "Nuevo",
  calificado: "Calificado",
  llamada: "Llamada",
  propuesta: "Propuesta",
  cerrado: "Cerrado ✅",
  descartado: "Descartado",
};

export interface LeadNuevo {
  /** De dónde vino: "chat" (Alma) | "cotizar" | "contacto" */
  origen: string;
  nombre: string;
  /** Email o contacto principal */
  contacto: string;
  /** WhatsApp en dígitos (vacío si no hay) */
  whatsapp?: string;
  /** Etiqueta legible del presupuesto (ya resuelta) */
  presupuesto: string;
  necesidad: string;
  /** UTM + página + referrer (ya saneado por la ruta que captura) */
  utm: Record<string, string>;
}

export interface LeadGuardado {
  id: string;
  creadoEn: string;
  origen: string;
  nombre: string;
  contacto: string;
  whatsapp: string;
  presupuesto: string;
  necesidad: string;
  utm: Record<string, string>;
  estado: EstadoLead;
  notas: string;
}

// ── Pool perezoso (serverless: una instancia por proceso) ───────────────────

let _pool: PgPool | null = null;
let _poolFailed = false;

function connectionString(): string | null {
  return process.env.DATABASE_URL || null;
}

async function getPool(): Promise<PgPool | null> {
  if (!connectionString()) return null;
  if (_poolFailed) return null;
  if (_pool) return _pool;
  try {
    const { Pool } = await import("pg");
    _pool = new Pool({
      connectionString: connectionString()!,
      // Neon/Supabase exigen SSL; con rejectUnauthorized:false funcionan ambos
      ssl: { rejectUnauthorized: false },
      max: 3,
      connectionTimeoutMillis: 8000,
    });
    return _pool;
  } catch (err) {
    console.error("[Leads] No se pudo inicializar el cliente de Postgres:", err);
    _poolFailed = true;
    return null;
  }
}

export function hayBaseDeDatos(): boolean {
  return !!connectionString();
}

let _schemaReady = false;

async function ensureSchema(pool: PgPool): Promise<void> {
  if (_schemaReady) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id BIGSERIAL PRIMARY KEY,
      creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
      origen TEXT NOT NULL,
      nombre TEXT NOT NULL,
      contacto TEXT NOT NULL DEFAULT '',
      whatsapp TEXT NOT NULL DEFAULT '',
      presupuesto TEXT NOT NULL DEFAULT '',
      necesidad TEXT NOT NULL DEFAULT '',
      utm JSONB NOT NULL DEFAULT '{}',
      estado TEXT NOT NULL DEFAULT 'nuevo',
      notas TEXT NOT NULL DEFAULT ''
    )
  `);
  _schemaReady = true;
}

// ── Operaciones ──────────────────────────────────────────────────────────────

/** Guarda un lead. Devuelve false si no hay BD o falló (sin lanzar). */
export async function guardarLead(lead: LeadNuevo): Promise<boolean> {
  try {
    const pool = await getPool();
    if (!pool) return false;
    await ensureSchema(pool);
    await pool.query(
      `INSERT INTO leads (origen, nombre, contacto, whatsapp, presupuesto, necesidad, utm)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        lead.origen.slice(0, 20),
        lead.nombre.slice(0, 120),
        lead.contacto.slice(0, 200),
        (lead.whatsapp || "").slice(0, 30),
        lead.presupuesto.slice(0, 120),
        lead.necesidad.slice(0, 2000),
        JSON.stringify(lead.utm || {}),
      ]
    );
    return true;
  } catch (err) {
    console.error("[Leads] No se pudo guardar el lead en la base de datos:", err);
    return false;
  }
}

/** Lista los últimos leads. null = BD no configurada o error. */
export async function listarLeads(limite = 100): Promise<LeadGuardado[] | null> {
  try {
    const pool = await getPool();
    if (!pool) return null;
    await ensureSchema(pool);
    const { rows } = await pool.query(
      `SELECT id, creado_en, origen, nombre, contacto, whatsapp, presupuesto,
              necesidad, utm, estado, notas
       FROM leads
       ORDER BY creado_en DESC
       LIMIT $1`,
      [Math.min(Math.max(limite, 1), 300)]
    );
    return rows.map((r: Record<string, unknown>) => {
      const estado = String(r.estado) as EstadoLead;
      return {
        id: String(r.id),
        creadoEn: new Date(r.creado_en as string).toISOString(),
        origen: String(r.origen || ""),
        nombre: String(r.nombre || ""),
        contacto: String(r.contacto || ""),
        whatsapp: String(r.whatsapp || ""),
        presupuesto: String(r.presupuesto || ""),
        necesidad: String(r.necesidad || ""),
        utm: (r.utm as Record<string, string>) || {},
        estado: ESTADOS_LEAD.includes(estado) ? estado : "nuevo",
        notas: String(r.notas || ""),
      };
    });
  } catch (err) {
    console.error("[Leads] Error al listar leads:", err);
    return null;
  }
}

/** Actualiza estado y notas. Devuelve null si no hay BD, false si falló. */
export async function actualizarLead(
  id: number,
  estado: EstadoLead,
  notas: string
): Promise<boolean | null> {
  try {
    const pool = await getPool();
    if (!pool) return null;
    await ensureSchema(pool);
    const { rowCount } = await pool.query(
      `UPDATE leads SET estado = $2, notas = $3 WHERE id = $1`,
      [id, estado, notas.slice(0, 2000)]
    );
    return (rowCount ?? 0) > 0;
  } catch (err) {
    console.error("[Leads] Error al actualizar el lead:", err);
    return false;
  }
}
