import { NextResponse } from "next/server";
import { clientIp, createRateLimiter } from "@/lib/proposal";
import { panelAuthed } from "@/lib/panel-auth";
import {
  guardarConfigPagos,
  hayBaseDeDatos,
  obtenerConfigPagos,
} from "@/lib/proyectos-db";

/**
 * Datos de cobro que ve el cliente en su portal (privado).
 * Se configuran una vez desde /panel/proyectos y aplican a todos los
 * proyectos: banco, cuenta, titular, NIT y link base de Wompi.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limited = createRateLimiter(60, 60 * 60 * 1000);

function texto(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function urlSegura(v: unknown): string {
  const s = typeof v === "string" ? v.trim().slice(0, 500) : "";
  if (!s) return "";
  return /^https?:\/\//i.test(s) ? s : "";
}

export async function GET(request: Request) {
  if (!panelAuthed(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (limited(clientIp(request))) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }
  if (!hayBaseDeDatos()) {
    return NextResponse.json({ configured: false });
  }
  return NextResponse.json({
    configured: true,
    config: await obtenerConfigPagos(),
  });
}

export async function PUT(request: Request) {
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

  const ok = await guardarConfigPagos({
    banco: texto(body.banco, 120),
    tipoCuenta: texto(body.tipoCuenta, 60),
    numeroCuenta: texto(body.numeroCuenta, 60),
    titular: texto(body.titular, 160),
    nit: texto(body.nit, 40),
    wompiLink: urlSegura(body.wompiLink),
    nota: texto(body.nota, 800),
  });

  if (ok === null) {
    return NextResponse.json({ error: "Base de datos no configurada" }, { status: 503 });
  }
  if (!ok) {
    return NextResponse.json({ error: "No se pudo guardar la configuración." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
