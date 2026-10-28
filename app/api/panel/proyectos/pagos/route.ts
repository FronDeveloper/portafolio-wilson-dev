import { NextResponse } from "next/server";
import { clientIp, createRateLimiter } from "@/lib/proposal";
import { panelAuthed } from "@/lib/panel-auth";
import {
  actualizarPago,
  crearPago,
  eliminarPago,
  hayBaseDeDatos,
  type EstadoPago,
} from "@/lib/proyectos-db";

/**
 * Pagos del portal de clientes (privado).
 * Wilson registra el monto, pega el link de Wompi si lo generó en su
 * panel y marca "pagado" cuando el dinero está confirmado.
 */

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

function moneda(v: unknown): string {
  const s = typeof v === "string" ? v.trim().toUpperCase() : "";
  return s === "USD" ? "USD" : "COP";
}

function urlSegura(v: unknown): string {
  const s = typeof v === "string" ? v.trim().slice(0, 500) : "";
  if (!s) return "";
  return /^https?:\/\//i.test(s) ? s : "";
}

function datos(body: Record<string, unknown>) {
  const estado: EstadoPago = body.estado === "pagado" ? "pagado" : "pendiente";
  const montoNum = typeof body.monto === "number" ? body.monto : Number(body.monto);
  return {
    concepto: texto(body.concepto, 160),
    monto:
      Number.isFinite(montoNum) && montoNum >= 0 ? Math.round(montoNum) : 0,
    moneda: moneda(body.moneda),
    estado,
    metodo: texto(body.metodo, 30),
    linkPago: urlSegura(body.linkPago),
    vence: fecha(body.vence),
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
  if (!data.concepto || data.monto <= 0) {
    return NextResponse.json(
      { error: "El concepto y un monto mayor a cero son obligatorios." },
      { status: 400 }
    );
  }

  const id = await crearPago(proyectoId, data);
  if (!id) {
    return NextResponse.json({ error: "No se pudo crear el pago." }, { status: 500 });
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
  if (!data.concepto || data.monto <= 0) {
    return NextResponse.json(
      { error: "El concepto y un monto mayor a cero son obligatorios." },
      { status: 400 }
    );
  }

  const ok = await actualizarPago(id, data);
  if (ok === null) {
    return NextResponse.json({ error: "Base de datos no configurada" }, { status: 503 });
  }
  if (!ok) {
    return NextResponse.json({ error: "No se encontró el pago." }, { status: 404 });
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

  const ok = await eliminarPago(id);
  if (ok === null) {
    return NextResponse.json({ error: "Base de datos no configurada" }, { status: 503 });
  }
  if (!ok) {
    return NextResponse.json({ error: "No se encontró el pago." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
