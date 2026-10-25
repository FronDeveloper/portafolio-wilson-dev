/**
 * GET /api/propuesta/descartar?t=TOKEN
 * ============================================================
 * Descarta una propuesta. Se llama desde la página de revisión
 * después de que Wilson confirma. Devuelve una página HTML
 * simple confirmando el descarte.
 * Nada se envía a nadie: la propuesta simplemente no se usa.
 * ============================================================
 */

import { NextResponse } from "next/server";
import { verificarToken, fechaBogota } from "@/lib/propuestas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const t = searchParams.get("t") || "";
  const resultado = verificarToken(t);

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
    `[Alma] Propuesta DESCARTADA por Wilson → cliente: ${resultado.payload.n}`
  );

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Propuesta descartada</title>
</head>
<body style="margin:0; padding:0; background:#0B0B0B; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:520px; margin:60px auto; padding:40px 32px; background:#111; border:1px solid #333; border-radius:14px; text-align:center;">
    <div style="font-size:44px; margin-bottom:14px;">🗑️</div>
    <h1 style="color:#C2B280; font-size:22px; margin:0 0 10px;">Propuesta descartada</h1>
    <p style="color:#aaa; font-size:14px; line-height:1.7; margin:0 0 22px;">
      La propuesta para <b style="color:#fff;">${resultado.payload.n}</b> no se envió a nadie.
      El cliente puede volver a solicitarla desde el chat cuando quieras.
    </p>
    <a href="https://wvalencia-dev.vercel.app" style="display:inline-block; background:#C2B280; color:#000; padding:12px 28px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:14px;">
      Volver al portafolio
    </a>
    <p style="color:#555; font-size:11px; margin-top:26px;">${fechaBogota()}</p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
