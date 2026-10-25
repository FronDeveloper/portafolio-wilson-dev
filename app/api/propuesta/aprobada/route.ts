/**
 * POST /api/propuesta/aprobada
 * ============================================================
 * Wilson ya revisó/editó la propuesta y la abrió por WhatsApp.
 * Este endpoint deja constancia: envía a Wilson un email de
 * confirmación con la versión FINAL que envió (su Gmail queda
 * como archivo histórico, sin necesidad de base de datos).
 *
 * Es "fire-and-forget" desde el cliente: si falla, no afecta
 * el flujo de WhatsApp.
 * ============================================================
 */

import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  verificarToken,
  escapeHtml,
  fechaBogota,
  PROYECTO_LABELS,
  PRESUPUESTO_LABELS,
} from "@/lib/propuestas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (_resend) return _resend;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY no está configurada");
  _resend = new Resend(apiKey);
  return _resend;
}

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "wilson.arroyo12@gmail.com";

export async function POST(request: Request) {
  try {
    const { t } = await request.json();
    const resultado = verificarToken(t);

    if (!resultado.ok) {
      console.warn(`[Alma] Aprobada: token inválido (${resultado.razon})`);
      return NextResponse.json({ ok: false }, { status: 403 });
    }

    const { n, e, w, t: tipo, b, p } = resultado.payload;
    console.log(`[Alma] Propuesta APROBADA por Wilson → cliente: ${n}`);

    // Email de archivo (best-effort: si falla, no rompe nada)
    try {
      const resend = getResend();
      await resend.emails.send({
        from: "Alma Propuestas <onboarding@resend.dev>",
        to: [NOTIFY_EMAIL],
        subject: `✅ Propuesta aprobada y enviada a ${n}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; background: #0B0B0B; padding: 36px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #C2B280; font-size: 24px; margin-bottom: 6px;">✅ Propuesta aprobada</h1>
              <p style="color: #888; font-size: 13px;">Aprobada por Wilson · ${fechaBogota()}</p>
            </div>

            <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 22px; margin-bottom: 18px;">
              <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; color: #888; width: 120px;">Cliente:</td><td style="padding: 6px 0; color: #fff; font-weight: 600;">${escapeHtml(n)}</td></tr>
                ${w ? `<tr><td style="padding: 6px 0; color: #888;">WhatsApp:</td><td style="padding: 6px 0;"><a href="https://wa.me/${w}" style="color: #25D366;">+${escapeHtml(w)}</a></td></tr>` : ""}
                ${e ? `<tr><td style="padding: 6px 0; color: #888;">Email:</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(e)}" style="color: #C2B280;">${escapeHtml(e)}</a></td></tr>` : ""}
                <tr><td style="padding: 6px 0; color: #888;">Proyecto:</td><td style="padding: 6px 0; color: #fff;">${escapeHtml(PROYECTO_LABELS[tipo] || tipo || "-")}</td></tr>
                <tr><td style="padding: 6px 0; color: #888;">Presupuesto:</td><td style="padding: 6px 0; color: #fff;">${escapeHtml(PRESUPUESTO_LABELS[b] || b || "-")}</td></tr>
              </table>
            </div>

            <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 22px; margin-bottom: 18px;">
              <h2 style="color: #fff; font-size: 16px; margin: 0 0 12px;">📄 Versión final enviada</h2>
              <p style="color: #ddd; font-size: 14px; line-height: 1.7; white-space: pre-wrap; background: #0B0B0B; border: 1px solid #222; border-radius: 6px; padding: 16px;">${escapeHtml(p)}</p>
            </div>

            <div style="text-align: center;">
              <p style="color: #666; font-size: 12px;">💡 Tip: guarda este correo como archivo de la propuesta. Si el cliente dice que sí, este texto es el punto de partida del contrato.</p>
            </div>
          </div>
        `,
      });
      console.log("[Alma] Aprobada: email de archivo enviado");
    } catch (err) {
      console.error("[Alma] Aprobada: no se pudo enviar el email de archivo (no crítico):", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Alma] Aprobada: error interno:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
