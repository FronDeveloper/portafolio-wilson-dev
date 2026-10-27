import { NextResponse } from "next/server";
import {
  PANEL_COOKIE,
  isValidPanelToken,
  createRateLimiter,
  clientIp,
} from "@/lib/proposal";
import {
  ESTADOS_LEAD,
  actualizarLead,
  hayBaseDeDatos,
  listarLeads,
  type EstadoLead,
} from "@/lib/leads-db";

/**
 * API del panel de leads (/panel/leads) — protegida con la MISMA sesión
 * del panel de propuestas (PANEL_PASSWORD → cookie de 7 días).
 *
 *   GET    → lista los últimos leads (o { configured: false } sin BD)
 *   PATCH  → { id, estado, notas } actualiza un lead
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limited = createRateLimiter(120, 60 * 60 * 1000);

function readCookie(request: Request): string | null {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === PANEL_COOKIE) return rest.join("=");
  }
  return null;
}

function authed(request: Request): boolean {
  return isValidPanelToken(readCookie(request));
}

export async function GET(request: Request) {
  if (!authed(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (limited(clientIp(request))) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }

  if (!hayBaseDeDatos()) {
    return NextResponse.json({ configured: false, leads: [] });
  }

  const leads = await listarLeads(200);
  if (leads === null) {
    return NextResponse.json(
      { error: "No se pudo leer la base de datos. Revisa DATABASE_URL en Vercel." },
      { status: 503 }
    );
  }
  return NextResponse.json({ configured: true, leads });
}

export async function PATCH(request: Request) {
  if (!authed(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (limited(clientIp(request))) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }

  if (!hayBaseDeDatos()) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  let body: { id?: unknown; estado?: unknown; notas?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const id = Number(body.id);
  const estado = typeof body.estado === "string" ? body.estado : "";
  const notas = typeof body.notas === "string" ? body.notas : "";

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Id inválido" }, { status: 400 });
  }
  if (!ESTADOS_LEAD.includes(estado as EstadoLead)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const result = await actualizarLead(id, estado as EstadoLead, notas);
  if (result === null) {
    return NextResponse.json(
      { error: "Base de datos no configurada" },
      { status: 503 }
    );
  }
  if (!result) {
    return NextResponse.json(
      { error: "No se encontró el lead o falló la actualización" },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
