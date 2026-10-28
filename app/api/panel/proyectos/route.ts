import { NextResponse } from "next/server";
import { clientIp, createRateLimiter } from "@/lib/proposal";
import { panelAuthed } from "@/lib/panel-auth";
import {
  ESTADOS_PROYECTO,
  actualizarProyecto,
  crearProyecto,
  eliminarProyecto,
  hayBaseDeDatos,
  listarProyectos,
  type EstadoProyecto,
} from "@/lib/proyectos-db";

/**
 * Proyectos del portal de clientes (privado, misma sesión de /panel).
 *
 *   GET    → lista con hitos y pagos
 *   POST   → crea un proyecto y devuelve su token/enlace
 *   PATCH  → actualiza un proyecto (incluye cambiar estado)
 *   DELETE → elimina un proyecto (y sus hitos/pagos en cascada)
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const limited = createRateLimiter(120, 60 * 60 * 1000);

function texto(v: unknown, max: number): string {
  return typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function textoLargo(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function fecha(v: unknown): string {
  const s = typeof v === "string" ? v.trim() : "";
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
}

function numero(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : 0;
}

function moneda(v: unknown): string {
  const s = typeof v === "string" ? v.trim().toUpperCase() : "";
  return s === "USD" ? "USD" : "COP";
}

type Cuerpo = Record<string, unknown>;

function datosProyecto(body: Cuerpo) {
  return {
    cliente: texto(body.cliente, 120),
    email: texto(body.email, 160),
    nombre: texto(body.nombre, 160),
    descripcion: textoLargo(body.descripcion, 3000),
    tipo: texto(body.tipo, 60),
    estado: (ESTADOS_PROYECTO.includes(body.estado as EstadoProyecto)
      ? body.estado
      : "en_progreso") as EstadoProyecto,
    fechaInicio: fecha(body.fechaInicio),
    fechaEntrega: fecha(body.fechaEntrega),
    valorTotal: numero(body.valorTotal),
    moneda: moneda(body.moneda),
  };
}

export async function GET(request: Request) {
  if (!panelAuthed(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (limited(clientIp(request))) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }
  if (!hayBaseDeDatos()) {
    return NextResponse.json({ configured: false, proyectos: [] });
  }
  const proyectos = await listarProyectos();
  if (proyectos === null) {
    return NextResponse.json(
      { error: "No se pudo leer la base de datos. Revisa DATABASE_URL." },
      { status: 503 }
    );
  }
  return NextResponse.json({ configured: true, proyectos });
}

export async function POST(request: Request) {
  if (!panelAuthed(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (limited(clientIp(request))) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }
  if (!hayBaseDeDatos()) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  let body: Cuerpo;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const data = datosProyecto(body);
  if (!data.cliente || !data.nombre) {
    return NextResponse.json(
      { error: "El nombre del cliente y del proyecto son obligatorios." },
      { status: 400 }
    );
  }

  const creado = await crearProyecto(data);
  if (!creado) {
    return NextResponse.json(
      { error: "No se pudo crear el proyecto." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, ...creado });
}

export async function PATCH(request: Request) {
  if (!panelAuthed(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (limited(clientIp(request))) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }
  if (!hayBaseDeDatos()) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  let body: Cuerpo;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Id inválido" }, { status: 400 });
  }

  const data = datosProyecto(body);
  if (!data.cliente || !data.nombre) {
    return NextResponse.json(
      { error: "El nombre del cliente y del proyecto son obligatorios." },
      { status: 400 }
    );
  }

  const ok = await actualizarProyecto(id, data);
  if (ok === null) {
    return NextResponse.json({ error: "Base de datos no configurada" }, { status: 503 });
  }
  if (!ok) {
    return NextResponse.json({ error: "No se encontró el proyecto." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!panelAuthed(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (limited(clientIp(request))) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }
  if (!hayBaseDeDatos()) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  let body: Cuerpo;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Id inválido" }, { status: 400 });
  }

  const ok = await eliminarProyecto(id);
  if (ok === null) {
    return NextResponse.json({ error: "Base de datos no configurada" }, { status: 503 });
  }
  if (!ok) {
    return NextResponse.json({ error: "No se encontró el proyecto." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
