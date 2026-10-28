import { NextResponse } from "next/server";
import { clientIp, createRateLimiter } from "@/lib/proposal";
import { panelAuthed } from "@/lib/panel-auth";
import {
  ESTADOS_HITO,
  actualizarHito,
  crearHito,
  eliminarHito,
  hayBaseDeDatos,
  type EstadoHito,
} from "@/lib/proyectos-db";

/** Hitos del portal de clientes (privado). */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limited = createRateLimiter(180, 60 * 60 * 1000);

function texto(v: unknown, max: number): string {
  return typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function fecha(v: unknown): string {
  const s = typeof v === "string" ? v.trim() : "";
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
}

function datos(body: Record<string, unknown>) {
  return {
    titulo: texto(body.titulo, 160),
    descripcion: typeof body.descripcion === "string" ? body.descripcion.trim().slice(0, 1000) : "",
    estado: (ESTADOS_HITO.includes(body.estado as EstadoHito)
      ? body.estado
      : "pendiente") as EstadoHito,
    fecha: fecha(body.fecha),
  };
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

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const proyectoId = Number(body.proyectoId);
  const data = datos(body);
  if (!Number.isInteger(proyectoId) || proyectoId <= 0) {
    return NextResponse.json({ error: "Proyecto inválido" }, { status: 400 });
  }
  if (!data.titulo) {
    return NextResponse.json({ error: "El título del hito es obligatorio." }, { status: 400 });
  }

  const id = await crearHito(proyectoId, data);
  if (!id) {
    return NextResponse.json({ error: "No se pudo crear el hito." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id });
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

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const id = Number(body.id);
  const data = datos(body);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Id inválido" }, { status: 400 });
  }
  if (!data.titulo) {
    return NextResponse.json({ error: "El título del hito es obligatorio." }, { status: 400 });
  }

  const ok = await actualizarHito(id, data);
  if (ok === null) {
    return NextResponse.json({ error: "Base de datos no configurada" }, { status: 503 });
  }
  if (!ok) {
    return NextResponse.json({ error: "No se encontró el hito." }, { status: 404 });
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

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Id inválido" }, { status: 400 });
  }

  const ok = await eliminarHito(id);
  if (ok === null) {
    return NextResponse.json({ error: "Base de datos no configurada" }, { status: 503 });
  }
  if (!ok) {
    return NextResponse.json({ error: "No se encontró el hito." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
