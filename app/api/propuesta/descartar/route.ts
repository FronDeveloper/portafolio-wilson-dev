/**
 * POST /api/propuesta/descartar
 * ============================================================
 * Body: { t: TOKEN }
 * Registra en los logs que Wilson descartó una propuesta.
 *
 * Importante: las propuestas no se guardan en una base de datos
 * (todo viaja dentro del token firmado), así que este endpoint no
 * puede invalidar el enlace. Solo deja constancia y evita que el
 * flujo de envío se complete.
 * ============================================================
 */

import { NextResponse } from "next/server";
import { verificarToken, fechaBogota } from "@/lib/propuestas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { t?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
  }

  const token = typeof body.t === "string" ? body.t : "";
  const resultado = verificarToken(token);

  if (!resultado.ok) {
    const motivos: Record<string, string> = {
      "sin-secreto": "Configuración interna incompleta.",
      formato: "El enlace está incompleto o quedó cortado.",
      firma: "El enlace no es válido.",
      expirado: "El enlace expiró (7 días).",
    };
    return NextResponse.json(
      { ok: false, error: motivos[resultado.razon] || "Enlace inválido" },
      { status: 403 }
    );
  }

  console.log(
    `[Alma] Propuesta DESCARTADA por Wilson → cliente: ${resultado.payload.n} · ${fechaBogota()}`
  );

  return NextResponse.json({ ok: true });
}
