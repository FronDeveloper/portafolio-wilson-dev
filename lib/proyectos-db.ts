/**
 * ============================================================
 *  Portal de clientes — persistencia (Postgres)
 *  Wilson Valencia Dev        (SERVER-ONLY)
 * ============================================================
 *  Cada proyecto tiene un token privado y su enlace público es
 *  /proyecto/<token>: ahí el cliente ve avances, hitos y pagos.
 *
 *  ⚠️ OPCIONAL como los leads: sin DATABASE_URL nada se rompe, el
 *  panel simplemente avisa que falta configurar la base de datos.
 *
 *  Las tablas se crean solas en el primer uso.
 * ============================================================
 */

import crypto from "node:crypto";
import type { Pool as PgPool } from "pg";

// ── Estados ──────────────────────────────────────────────────────────────────

export const ESTADOS_PROYECTO = [
  "en_progreso",
  "en_revision",
  "pausado",
  "entregado",
] as const;
export type EstadoProyecto = (typeof ESTADOS_PROYECTO)[number];

export const ETIQUETA_PROYECTO: Record<EstadoProyecto, string> = {
  en_progreso: "En progreso",
  en_revision: "En revisión",
  pausado: "Pausado",
  entregado: "Entregado ✅",
};

export const ESTADOS_HITO = ["pendiente", "en_curso", "completado"] as const;
export type EstadoHito = (typeof ESTADOS_HITO)[number];

export const ETIQUETA_HITO: Record<EstadoHito, string> = {
  pendiente: "Pendiente",
  en_curso: "En curso",
  completado: "Completado",
};

export const ESTADOS_PAGO = ["pendiente", "pagado"] as const;
export type EstadoPago = (typeof ESTADOS_PAGO)[number];

// ── Tipos ────────────────────────────────────────────────────────────────────

export interface Hito {
  id: string;
  proyectoId: string;
  titulo: string;
  descripcion: string;
  estado: EstadoHito;
  fecha: string;
  orden: number;
}

export interface Pago {
  id: string;
  proyectoId: string;
  concepto: string;
  monto: number;
  moneda: string;
  estado: EstadoPago;
  metodo: string;
  linkPago: string;
  vence: string;
  pagadoEn: string;
  orden: number;
}

export interface Proyecto {
  id: string;
  token: string;
  cliente: string;
  email: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  estado: EstadoProyecto;
  fechaInicio: string;
  fechaEntrega: string;
  valorTotal: number;
  moneda: string;
  creadoEn: string;
  hitos: Hito[];
  pagos: Pago[];
}

export interface ConfigPagos {
  banco: string;
  tipoCuenta: string;
  numeroCuenta: string;
  titular: string;
  nit: string;
  wompiLink: string;
  nota: string;
  actualizadoEn: string;
}

// ── Pool perezoso ────────────────────────────────────────────────────────────

let _pool: PgPool | null = null;
let _poolFailed = false;
let _schemaReady = false;

function connectionString(): string | null {
  return process.env.DATABASE_URL || null;
}

export function hayBaseDeDatos(): boolean {
  return !!connectionString();
}

async function getPool(): Promise<PgPool | null> {
  const conn = connectionString();
  if (!conn) return null;
  if (_poolFailed) return null;
  if (_pool) return _pool;
  try {
    const { Pool } = await import("pg");
    // Neon/Supabase exigen SSL; Postgres local (Docker) no lo soporta.
    const local = /localhost|127\.0\.0\.1|sslmode=disable/.test(conn);
    _pool = new Pool({
      connectionString: conn,
      ssl: local ? undefined : { rejectUnauthorized: false },
      max: 3,
      connectionTimeoutMillis: 8000,
    });
    return _pool;
  } catch (err) {
    console.error("[Proyectos] No se pudo inicializar Postgres:", err);
    _poolFailed = true;
    return null;
  }
}

async function ensureSchema(pool: PgPool): Promise<void> {
  if (_schemaReady) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS proyectos (
      id BIGSERIAL PRIMARY KEY,
      token TEXT UNIQUE NOT NULL,
      cliente TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      nombre TEXT NOT NULL,
      descripcion TEXT NOT NULL DEFAULT '',
      tipo TEXT NOT NULL DEFAULT '',
      estado TEXT NOT NULL DEFAULT 'en_progreso',
      fecha_inicio TEXT NOT NULL DEFAULT '',
      fecha_entrega TEXT NOT NULL DEFAULT '',
      valor_total BIGINT NOT NULL DEFAULT 0,
      moneda TEXT NOT NULL DEFAULT 'COP',
      creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS hitos (
      id BIGSERIAL PRIMARY KEY,
      proyecto_id BIGINT NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
      titulo TEXT NOT NULL,
      descripcion TEXT NOT NULL DEFAULT '',
      estado TEXT NOT NULL DEFAULT 'pendiente',
      fecha TEXT NOT NULL DEFAULT '',
      orden INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS pagos (
      id BIGSERIAL PRIMARY KEY,
      proyecto_id BIGINT NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
      concepto TEXT NOT NULL,
      monto BIGINT NOT NULL DEFAULT 0,
      moneda TEXT NOT NULL DEFAULT 'COP',
      estado TEXT NOT NULL DEFAULT 'pendiente',
      metodo TEXT NOT NULL DEFAULT '',
      link_pago TEXT NOT NULL DEFAULT '',
      vence TEXT NOT NULL DEFAULT '',
      pagado_en TIMESTAMPTZ,
      orden INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS config_pagos (
      id INTEGER PRIMARY KEY DEFAULT 1,
      banco TEXT NOT NULL DEFAULT '',
      tipo_cuenta TEXT NOT NULL DEFAULT '',
      numero_cuenta TEXT NOT NULL DEFAULT '',
      titular TEXT NOT NULL DEFAULT '',
      nit TEXT NOT NULL DEFAULT '',
      wompi_link TEXT NOT NULL DEFAULT '',
      nota TEXT NOT NULL DEFAULT '',
      actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS hitos_proyecto_idx ON hitos (proyecto_id, orden);
    CREATE INDEX IF NOT EXISTS pagos_proyecto_idx ON pagos (proyecto_id, orden);
  `);
  _schemaReady = true;
}

function nuevoToken(): string {
  return crypto.randomBytes(18).toString("base64url");
}

// ── Mapeadores ───────────────────────────────────────────────────────────────

function mapHito(r: Record<string, unknown>): Hito {
  const estado = String(r.estado) as EstadoHito;
  return {
    id: String(r.id),
    proyectoId: String(r.proyecto_id),
    titulo: String(r.titulo || ""),
    descripcion: String(r.descripcion || ""),
    estado: ESTADOS_HITO.includes(estado) ? estado : "pendiente",
    fecha: String(r.fecha || ""),
    orden: Number(r.orden) || 0,
  };
}

function mapPago(r: Record<string, unknown>): Pago {
  const estado = String(r.estado) as EstadoPago;
  return {
    id: String(r.id),
    proyectoId: String(r.proyecto_id),
    concepto: String(r.concepto || ""),
    monto: Number(r.monto) || 0,
    moneda: String(r.moneda || "COP"),
    estado: ESTADOS_PAGO.includes(estado) ? estado : "pendiente",
    metodo: String(r.metodo || ""),
    linkPago: String(r.link_pago || ""),
    vence: String(r.vence || ""),
    pagadoEn: r.pagado_en ? new Date(r.pagado_en as string).toISOString() : "",
    orden: Number(r.orden) || 0,
  };
}

function mapProyecto(r: Record<string, unknown>): Proyecto {
  const estado = String(r.estado) as EstadoProyecto;
  return {
    id: String(r.id),
    token: String(r.token || ""),
    cliente: String(r.cliente || ""),
    email: String(r.email || ""),
    nombre: String(r.nombre || ""),
    descripcion: String(r.descripcion || ""),
    tipo: String(r.tipo || ""),
    estado: ESTADOS_PROYECTO.includes(estado) ? estado : "en_progreso",
    fechaInicio: String(r.fecha_inicio || ""),
    fechaEntrega: String(r.fecha_entrega || ""),
    valorTotal: Number(r.valor_total) || 0,
    moneda: String(r.moneda || "COP"),
    creadoEn: new Date(r.creado_en as string).toISOString(),
    hitos: [],
    pagos: [],
  };
}

// ── Proyectos ────────────────────────────────────────────────────────────────

export interface ProyectoInput {
  cliente: string;
  email?: string;
  nombre: string;
  descripcion?: string;
  tipo?: string;
  estado?: EstadoProyecto;
  fechaInicio?: string;
  fechaEntrega?: string;
  valorTotal?: number;
  moneda?: string;
}

export async function crearProyecto(
  data: ProyectoInput
): Promise<{ id: string; token: string } | null> {
  try {
    const pool = await getPool();
    if (!pool) return null;
    await ensureSchema(pool);
    const token = nuevoToken();
    const { rows } = await pool.query(
      `INSERT INTO proyectos
        (token, cliente, email, nombre, descripcion, tipo, estado, fecha_inicio, fecha_entrega, valor_total, moneda)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id, token`,
      [
        token,
        data.cliente.slice(0, 120),
        (data.email || "").slice(0, 160),
        data.nombre.slice(0, 160),
        (data.descripcion || "").slice(0, 3000),
        (data.tipo || "").slice(0, 60),
        data.estado && ESTADOS_PROYECTO.includes(data.estado)
          ? data.estado
          : "en_progreso",
        (data.fechaInicio || "").slice(0, 10),
        (data.fechaEntrega || "").slice(0, 10),
        Math.max(0, Math.round(data.valorTotal || 0)),
        (data.moneda || "COP").slice(0, 3).toUpperCase(),
      ]
    );
    return { id: String(rows[0].id), token: String(rows[0].token) };
  } catch (err) {
    console.error("[Proyectos] Error al crear proyecto:", err);
    return null;
  }
}

async function adjuntarHitosYPagos(
  pool: PgPool,
  proyectos: Proyecto[]
): Promise<Proyecto[]> {
  if (proyectos.length === 0) return proyectos;
  const ids = proyectos.map((p) => Number(p.id));
  const [hitosRes, pagosRes] = await Promise.all([
    pool.query(
      `SELECT id, proyecto_id, titulo, descripcion, estado, fecha, orden
       FROM hitos WHERE proyecto_id = ANY($1::bigint[]) ORDER BY orden, id`,
      [ids]
    ),
    pool.query(
      `SELECT id, proyecto_id, concepto, monto, moneda, estado, metodo,
              link_pago, vence, pagado_en, orden
       FROM pagos WHERE proyecto_id = ANY($1::bigint[]) ORDER BY orden, id`,
      [ids]
    ),
  ]);
  const hitos = hitosRes.rows.map(mapHito);
  const pagos = pagosRes.rows.map(mapPago);
  for (const p of proyectos) {
    p.hitos = hitos.filter((h) => h.proyectoId === p.id);
    p.pagos = pagos.filter((x) => x.proyectoId === p.id);
  }
  return proyectos;
}

/** Lista todos los proyectos (panel). null = sin BD o error. */
export async function listarProyectos(): Promise<Proyecto[] | null> {
  try {
    const pool = await getPool();
    if (!pool) return null;
    await ensureSchema(pool);
    const { rows } = await pool.query(
      `SELECT id, token, cliente, email, nombre, descripcion, tipo, estado,
              fecha_inicio, fecha_entrega, valor_total, moneda, creado_en
       FROM proyectos ORDER BY creado_en DESC`
    );
    return adjuntarHitosYPagos(pool, rows.map(mapProyecto));
  } catch (err) {
    console.error("[Proyectos] Error al listar:", err);
    return null;
  }
}

/** Proyecto por token (página pública del cliente). */
export async function obtenerProyectoPorToken(
  token: string
): Promise<Proyecto | null> {
  try {
    const pool = await getPool();
    if (!pool) return null;
    await ensureSchema(pool);
    const { rows } = await pool.query(
      `SELECT id, token, cliente, email, nombre, descripcion, tipo, estado,
              fecha_inicio, fecha_entrega, valor_total, moneda, creado_en
       FROM proyectos WHERE token = $1 LIMIT 1`,
      [token]
    );
    if (rows.length === 0) return null;
    return (await adjuntarHitosYPagos(pool, [mapProyecto(rows[0])]))[0];
  } catch (err) {
    console.error("[Proyectos] Error al buscar por token:", err);
    return null;
  }
}

export async function actualizarProyecto(
  id: number,
  data: ProyectoInput
): Promise<boolean | null> {
  try {
    const pool = await getPool();
    if (!pool) return null;
    await ensureSchema(pool);
    const { rowCount } = await pool.query(
      `UPDATE proyectos SET
        cliente=$2, email=$3, nombre=$4, descripcion=$5, tipo=$6, estado=$7,
        fecha_inicio=$8, fecha_entrega=$9, valor_total=$10, moneda=$11
       WHERE id=$1`,
      [
        id,
        data.cliente.slice(0, 120),
        (data.email || "").slice(0, 160),
        data.nombre.slice(0, 160),
        (data.descripcion || "").slice(0, 3000),
        (data.tipo || "").slice(0, 60),
        data.estado && ESTADOS_PROYECTO.includes(data.estado)
          ? data.estado
          : "en_progreso",
        (data.fechaInicio || "").slice(0, 10),
        (data.fechaEntrega || "").slice(0, 10),
        Math.max(0, Math.round(data.valorTotal || 0)),
        (data.moneda || "COP").slice(0, 3).toUpperCase(),
      ]
    );
    return (rowCount ?? 0) > 0;
  } catch (err) {
    console.error("[Proyectos] Error al actualizar:", err);
    return false;
  }
}

export async function eliminarProyecto(id: number): Promise<boolean | null> {
  try {
    const pool = await getPool();
    if (!pool) return null;
    await ensureSchema(pool);
    const { rowCount } = await pool.query(
      `DELETE FROM proyectos WHERE id=$1`,
      [id]
    );
    return (rowCount ?? 0) > 0;
  } catch (err) {
    console.error("[Proyectos] Error al eliminar:", err);
    return false;
  }
}

// ── Hitos ────────────────────────────────────────────────────────────────────

export interface HitoInput {
  titulo: string;
  descripcion?: string;
  estado?: EstadoHito;
  fecha?: string;
}

export async function crearHito(
  proyectoId: number,
  data: HitoInput
): Promise<string | null> {
  try {
    const pool = await getPool();
    if (!pool) return null;
    await ensureSchema(pool);
    const { rows } = await pool.query(
      `INSERT INTO hitos (proyecto_id, titulo, descripcion, estado, fecha, orden)
       VALUES ($1,$2,$3,$4,$5,
         COALESCE((SELECT MAX(orden)+1 FROM hitos WHERE proyecto_id=$1), 0))
       RETURNING id`,
      [
        proyectoId,
        data.titulo.slice(0, 160),
        (data.descripcion || "").slice(0, 1000),
        data.estado && ESTADOS_HITO.includes(data.estado)
          ? data.estado
          : "pendiente",
        (data.fecha || "").slice(0, 10),
      ]
    );
    return String(rows[0].id);
  } catch (err) {
    console.error("[Proyectos] Error al crear hito:", err);
    return null;
  }
}

export async function actualizarHito(
  id: number,
  data: HitoInput
): Promise<boolean | null> {
  try {
    const pool = await getPool();
    if (!pool) return null;
    await ensureSchema(pool);
    const { rowCount } = await pool.query(
      `UPDATE hitos SET titulo=$2, descripcion=$3, estado=$4, fecha=$5 WHERE id=$1`,
      [
        id,
        data.titulo.slice(0, 160),
        (data.descripcion || "").slice(0, 1000),
        data.estado && ESTADOS_HITO.includes(data.estado)
          ? data.estado
          : "pendiente",
        (data.fecha || "").slice(0, 10),
      ]
    );
    return (rowCount ?? 0) > 0;
  } catch (err) {
    console.error("[Proyectos] Error al actualizar hito:", err);
    return false;
  }
}

export async function eliminarHito(id: number): Promise<boolean | null> {
  try {
    const pool = await getPool();
    if (!pool) return null;
    await ensureSchema(pool);
    const { rowCount } = await pool.query(`DELETE FROM hitos WHERE id=$1`, [id]);
    return (rowCount ?? 0) > 0;
  } catch (err) {
    console.error("[Proyectos] Error al eliminar hito:", err);
    return false;
  }
}

// ── Pagos ────────────────────────────────────────────────────────────────────

export interface PagoInput {
  concepto: string;
  monto: number;
  moneda?: string;
  estado?: EstadoPago;
  metodo?: string;
  linkPago?: string;
  vence?: string;
}

export async function crearPago(
  proyectoId: number,
  data: PagoInput
): Promise<string | null> {
  try {
    const pool = await getPool();
    if (!pool) return null;
    await ensureSchema(pool);
    const estado: EstadoPago = data.estado === "pagado" ? "pagado" : "pendiente";
    const { rows } = await pool.query(
      `INSERT INTO pagos
        (proyecto_id, concepto, monto, moneda, estado, metodo, link_pago, vence, pagado_en, orden)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,
         COALESCE((SELECT MAX(orden)+1 FROM pagos WHERE proyecto_id=$1), 0))
       RETURNING id`,
      [
        proyectoId,
        data.concepto.slice(0, 160),
        Math.max(0, Math.round(data.monto || 0)),
        (data.moneda || "COP").slice(0, 3).toUpperCase(),
        estado,
        (data.metodo || "").slice(0, 30),
        (data.linkPago || "").slice(0, 500),
        (data.vence || "").slice(0, 10),
        estado === "pagado" ? new Date().toISOString() : null,
      ]
    );
    return String(rows[0].id);
  } catch (err) {
    console.error("[Proyectos] Error al crear pago:", err);
    return null;
  }
}

export async function actualizarPago(
  id: number,
  data: PagoInput
): Promise<boolean | null> {
  try {
    const pool = await getPool();
    if (!pool) return null;
    await ensureSchema(pool);
    const estado: EstadoPago = data.estado === "pagado" ? "pagado" : "pendiente";
    const { rowCount } = await pool.query(
      `UPDATE pagos SET
        concepto=$2, monto=$3, moneda=$4, estado=$5, metodo=$6,
        link_pago=$7, vence=$8,
        pagado_en = CASE WHEN $5 = 'pagado' THEN COALESCE(pagado_en, now()) ELSE NULL END
       WHERE id=$1`,
      [
        id,
        data.concepto.slice(0, 160),
        Math.max(0, Math.round(data.monto || 0)),
        (data.moneda || "COP").slice(0, 3).toUpperCase(),
        estado,
        (data.metodo || "").slice(0, 30),
        (data.linkPago || "").slice(0, 500),
        (data.vence || "").slice(0, 10),
      ]
    );
    return (rowCount ?? 0) > 0;
  } catch (err) {
    console.error("[Proyectos] Error al actualizar pago:", err);
    return false;
  }
}

export async function eliminarPago(id: number): Promise<boolean | null> {
  try {
    const pool = await getPool();
    if (!pool) return null;
    await ensureSchema(pool);
    const { rowCount } = await pool.query(`DELETE FROM pagos WHERE id=$1`, [id]);
    return (rowCount ?? 0) > 0;
  } catch (err) {
    console.error("[Proyectos] Error al eliminar pago:", err);
    return false;
  }
}

// ── Configuración de cobro ───────────────────────────────────────────────────

const CONFIG_VACIA: ConfigPagos = {
  banco: "",
  tipoCuenta: "",
  numeroCuenta: "",
  titular: "",
  nit: "",
  wompiLink: "",
  nota: "",
  actualizadoEn: "",
};

export async function obtenerConfigPagos(): Promise<ConfigPagos> {
  try {
    const pool = await getPool();
    if (!pool) return CONFIG_VACIA;
    await ensureSchema(pool);
    const { rows } = await pool.query(
      `SELECT banco, tipo_cuenta, numero_cuenta, titular, nit, wompi_link,
              nota, actualizado_en
       FROM config_pagos WHERE id=1 LIMIT 1`
    );
    if (rows.length === 0) return CONFIG_VACIA;
    const r = rows[0];
    return {
      banco: String(r.banco || ""),
      tipoCuenta: String(r.tipo_cuenta || ""),
      numeroCuenta: String(r.numero_cuenta || ""),
      titular: String(r.titular || ""),
      nit: String(r.nit || ""),
      wompiLink: String(r.wompi_link || ""),
      nota: String(r.nota || ""),
      actualizadoEn: r.actualizado_en
        ? new Date(r.actualizado_en as string).toISOString()
        : "",
    };
  } catch (err) {
    console.error("[Proyectos] Error al leer config de pagos:", err);
    return CONFIG_VACIA;
  }
}

export async function guardarConfigPagos(
  data: Omit<ConfigPagos, "actualizadoEn">
): Promise<boolean | null> {
  try {
    const pool = await getPool();
    if (!pool) return null;
    await ensureSchema(pool);
    await pool.query(
      `INSERT INTO config_pagos
        (id, banco, tipo_cuenta, numero_cuenta, titular, nit, wompi_link, nota, actualizado_en)
       VALUES (1,$1,$2,$3,$4,$5,$6,$7, now())
       ON CONFLICT (id) DO UPDATE SET
         banco=EXCLUDED.banco,
         tipo_cuenta=EXCLUDED.tipo_cuenta,
         numero_cuenta=EXCLUDED.numero_cuenta,
         titular=EXCLUDED.titular,
         nit=EXCLUDED.nit,
         wompi_link=EXCLUDED.wompi_link,
         nota=EXCLUDED.nota,
         actualizado_en=now()`,
      [
        (data.banco || "").slice(0, 120),
        (data.tipoCuenta || "").slice(0, 60),
        (data.numeroCuenta || "").slice(0, 60),
        (data.titular || "").slice(0, 160),
        (data.nit || "").slice(0, 40),
        (data.wompiLink || "").slice(0, 500),
        (data.nota || "").slice(0, 800),
      ]
    );
    return true;
  } catch (err) {
    console.error("[Proyectos] Error al guardar config de pagos:", err);
    return false;
  }
}
