import { NextResponse } from "next/server";
import {
  PANEL_COOKIE,
  PANEL_MAX_AGE,
  checkPanelPassword,
  clientIp,
  createRateLimiter,
  expectedPanelToken,
  isValidPanelToken,
} from "@/lib/proposal";

/**
 * Autenticación del panel privado /panel
 *   POST    { password }  → valida contra PANEL_PASSWORD y deja cookie 7 días
 *   GET                   → { authed, configured } para la pantalla de login
 *   DELETE                → cierra sesión (borra la cookie)
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limited = createRateLimiter(10, 60 * 60 * 1000); // 10 intentos/hora/IP

function readCookie(request: Request): string | null {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === PANEL_COOKIE) return rest.join("=");
  }
  return null;
}

export async function GET(request: Request) {
  return NextResponse.json({
    authed: isValidPanelToken(readCookie(request)),
    configured: !!process.env.PANEL_PASSWORD,
  });
}

export async function POST(request: Request) {
  if (limited(clientIp(request))) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera una hora e intenta de nuevo." },
      { status: 429 }
    );
  }

  if (!process.env.PANEL_PASSWORD) {
    return NextResponse.json(
      {
        error:
          "PANEL_PASSWORD no está configurada. Agrégala en Vercel → Settings → Environment Variables y redespliega.",
      },
      { status: 503 }
    );
  }

  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!password) {
    return NextResponse.json({ error: "Escribe la contraseña" }, { status: 400 });
  }

  const token = expectedPanelToken();
  const ok = !!token && checkPanelPassword(password);

  if (!ok) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PANEL_COOKIE, token!, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: PANEL_MAX_AGE,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(PANEL_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
