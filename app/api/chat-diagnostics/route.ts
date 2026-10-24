import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * GET /api/chat-diagnostics?key=TU_CLAVE
 *
 * Endpoint de diagnóstico para Wilson: prueba en un solo paso todos los
 * canales del chatbot (Groq, Resend, Telegram, CallMeBot) y reporta el
 * resultado en JSON, con pistas de solución concretas cuando algo falla.
 *
 * Requiere la env var DIAGNOSTICS_KEY en Vercel (cualquier texto secreto).
 * Sin esa variable el endpoint responde 403 y no expone nada.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const GROQ_MODELS_URL = "https://api.groq.com/openai/v1/models";
const FROM = "Alma Diagnóstico <onboarding@resend.dev>";

function hintResend(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("testing") || m.includes("your own email") || m.includes("test emails")) {
    return (
      "Resend está en MODO PRUEBA: sin dominio verificado solo envía al email con el que " +
      "creaste tu cuenta de Resend. Solución A: entra a resend.com y confirma cuál es ese " +
      "email — si NO es wilson.arroyo12@gmail.com, cambia NOTIFY_EMAIL en Vercel a ese email. " +
      "Solución B (recomendada a futuro): verifica tu propio dominio en Resend → Domains y " +
      "cambia el from del código a algo@tudominio.com."
    );
  }
  if (m.includes("unauthorized") || m.includes("api key") || m.includes("invalid")) {
    return "RESEND_API_KEY inválida o revocada — genera otra en resend.com/api-keys y actualízala en Vercel (Settings → Environment Variables).";
  }
  return "Revisa resend.com → Logs para ver el motivo exacto del rechazo.";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key") || "";
  const secret = process.env.DIAGNOSTICS_KEY;

  if (!secret) {
    return NextResponse.json(
      {
        error:
          "Endpoint deshabilitado. Define la env var DIAGNOSTICS_KEY en Vercel (Settings → Environment Variables) con un valor secreto, espera el redeploy y añade ?key=ese-valor a esta URL.",
      },
      { status: 403 }
    );
  }
  if (key !== secret) {
    return NextResponse.json({ error: "key inválida" }, { status: 403 });
  }

  const to = process.env.NOTIFY_EMAIL || "wilson.arroyo12@gmail.com";

  const result: Record<string, unknown> = {
    servicio: "Alma v2.1 — diagnóstico de notificaciones del chatbot",
    fecha: new Date().toISOString(),
    env: {
      GROQ_API_KEY: !!process.env.GROQ_API_KEY,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      NOTIFY_EMAIL_efectivo: to,
      TELEGRAM_BOT_TOKEN: !!process.env.TELEGRAM_BOT_TOKEN,
      TELEGRAM_CHAT_ID: !!process.env.TELEGRAM_CHAT_ID,
      CALLMEBOT_PHONE: !!process.env.CALLMEBOT_PHONE,
      CALLMEBOT_APIKEY: !!process.env.CALLMEBOT_APIKEY,
    },
    groq: null as Record<string, unknown> | null,
    resend: null as Record<string, unknown> | null,
    telegram: null as Record<string, unknown> | null,
    callmebot: null as Record<string, unknown> | null,
  };

  // ── GROQ (cerebro del chat) ──────────────────────────────────────────────
  try {
    const res = await fetch(GROQ_MODELS_URL, {
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY || ""}` },
    });
    if (res.ok) {
      result.groq = { ok: true, detalle: "API key válida — el chat debería responder" };
    } else {
      const errText = (await res.text().catch(() => "")).slice(0, 300);
      result.groq = {
        ok: false,
        status: res.status,
        error: errText,
        hint:
          res.status === 401 || res.status === 403
            ? "GROQ_API_KEY inválida, revocada o ausente — genera otra en console.groq.com/keys y actualízala en Vercel"
            : "Error inesperado de Groq — reintenta en unos minutos",
      };
    }
  } catch (e) {
    result.groq = { ok: false, error: String(e) };
  }

  // ── RESEND (envía un email de prueba REAL a tu bandeja) ─────────────────
  try {
    if (!process.env.RESEND_API_KEY) {
      result.resend = {
        ok: false,
        error: "RESEND_API_KEY no configurada",
        hint: "Agrégala en Vercel → Settings → Environment Variables (la misma que usa tu formulario de contacto).",
      };
    } else {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: FROM,
        to: [to],
        subject: "🔍 Prueba de diagnóstico — Alma",
        html: `<div style="font-family:sans-serif;padding:24px;">
          <h2 style="color:#C2B280;">✅ El envío de emails del portafolio funciona</h2>
          <p>Si lees esto en tu bandeja, Resend está entregando correctamente a <b>${to}</b>.</p>
          <p style="color:#888;font-size:12px;">Si NO llegó: revisa SPAM/Promociones y luego resend.com → Logs.</p>
        </div>`,
      });
      if (error) {
        result.resend = {
          ok: false,
          status: (error as { statusCode?: number }).statusCode ?? null,
          error: (error as { message?: string }).message,
          hint: hintResend((error as { message?: string }).message || ""),
        };
      } else {
        result.resend = {
          ok: true,
          id: data?.id,
          detalle: `Email de prueba enviado a ${to} — revisa bandeja de entrada y SPAM`,
        };
      }
    }
  } catch (e) {
    result.resend = { ok: false, error: String(e) };
  }

  // ── TELEGRAM (aviso instantáneo en tu celular, opcional) ────────────────
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      result.telegram = {
        configured: false,
        nota: "Opcional (recomendado): aviso instantáneo gratuito en tu celular. Setup de 5 min con BotFather — ver LEEME-ALMA-V2.1.",
      };
    } else {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "✅ Prueba de diagnóstico — las notificaciones de leads de Alma están funcionando",
        }),
      });
      const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (res.ok) {
        result.telegram = { configured: true, ok: true, detalle: "Mensaje de prueba enviado a tu Telegram" };
      } else {
        result.telegram = {
          configured: true,
          ok: false,
          status: res.status,
          error: JSON.stringify(body).slice(0, 300),
          hint:
            res.status === 400 || res.status === 404
              ? "Verifica TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID: escríbele /start a tu bot en Telegram y abre https://api.telegram.org/bot<TU_TOKEN>/getUpdates para ver tu chat_id real"
              : "Error inesperado de Telegram — reintenta",
        };
      }
    }
  } catch (e) {
    result.telegram = { configured: true, ok: false, error: String(e) };
  }

  // ── CALLMEBOT (WhatsApp real hacia tu número, opcional) ─────────────────
  try {
    const phone = process.env.CALLMEBOT_PHONE;
    const apikey = process.env.CALLMEBOT_APIKEY;
    if (!phone || !apikey) {
      result.callmebot = {
        configured: false,
        nota: "Opcional: aviso por WhatsApp real. El bot gratuito de CallMeBot estuvo sin cupos (callmebot.com). Si consigues tu apikey, configura CALLMEBOT_PHONE (formato +573012821174) y CALLMEBOT_APIKEY.",
      };
    } else {
      const reqUrl = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
        phone
      )}&text=${encodeURIComponent("✅ Prueba de diagnóstico — Alma")}&apikey=${encodeURIComponent(apikey)}`;
      const res = await fetch(reqUrl);
      const body = (await res.text().catch(() => "")).slice(0, 200);
      if (res.ok) {
        result.callmebot = {
          configured: true,
          ok: true,
          detalle: "Solicitud aceptada — revisa tu WhatsApp",
          respuesta: body,
        };
      } else {
        result.callmebot = {
          configured: true,
          ok: false,
          status: res.status,
          respuesta: body,
          hint: "Verifica CALLMEBOT_PHONE (formato +573012821174, con el +) y CALLMEBOT_APIKEY",
        };
      }
    }
  } catch (e) {
    result.callmebot = { configured: true, ok: false, error: String(e) };
  }

  return NextResponse.json(result, { status: 200 });
}
