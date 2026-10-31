import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimitOk } from "@/lib/propuestas";
import { guardarLead } from "@/lib/leads-db";
import { SITE_HOST } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Margen para esperar el correo + la escritura en la base de datos
export const maxDuration = 30;

/**
 * POST /api/contacto — formulario de /contact
 * Reemplaza a emailjs: mismo pipeline que el chat y /cotizar
 * (validación → email a Wilson → copia en la BD del panel).
 */

let _resend: Resend | null = null;
function getResend(): Resend {
  if (_resend) return _resend;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY no está configurada");
  _resend = new Resend(apiKey);
  return _resend;
}

function escapeHtml(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function texto(v: unknown, max: number): string {
  return typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

const from = `Contacto Portafolio <${process.env.EMAIL_FROM || "onboarding@resend.dev"}>`;

function origenFilas(utm: Record<string, string>): string {
  const filas: [string, string][] = [
    ["Página", utm.page || "—"],
    ["Fuente", utm.utm_source || "Directo (sin UTM)"],
    ["Medio", utm.utm_medium || "—"],
    ["Campaña", utm.utm_campaign || "—"],
    ["Referrer", utm.referrer || "—"],
  ];
  return filas
    .map(
      ([k, v]) =>
        `<tr><td style="padding: 6px 0; color: #888; width: 110px;">${k}:</td><td style="padding: 6px 0; color: #ddd; word-break: break-all;">${escapeHtml(
          v
        )}</td></tr>`
    )
    .join("");
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!rateLimitOk(ip, 5, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta de nuevo en un rato o escríbeme por WhatsApp." },
        { status: 429 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const nombre = texto(body.nombre, 80);
    const email = texto(body.email, 120);
    const mensaje = typeof body.mensaje === "string" ? body.mensaje.trim().slice(0, 2000) : "";
    const consent = body.consent === true;

    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    if (mensaje.length < 10) {
      return NextResponse.json(
        { error: "Cuéntame un poco más sobre tu proyecto (mínimo 10 caracteres)." },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: "Debes aceptar la política de privacidad para enviar el mensaje." },
        { status: 400 }
      );
    }

    const utmRaw =
      body.utm && typeof body.utm === "object"
        ? (body.utm as Record<string, unknown>)
        : {};
    const utm: Record<string, string> = {
      utm_source: texto(utmRaw.utm_source, 120),
      utm_medium: texto(utmRaw.utm_medium, 120),
      utm_campaign: texto(utmRaw.utm_campaign, 160),
      utm_content: texto(utmRaw.utm_content, 160),
      page: texto(utmRaw.page, 300),
      referrer: texto(utmRaw.referrer, 300),
    };

    let resend: Resend;
    try {
      resend = getResend();
    } catch (err) {
      console.error("Resend init error:", err);
      return NextResponse.json(
        { error: "Servicio de email no configurado" },
        { status: 503 }
      );
    }

    const to = process.env.NOTIFY_EMAIL || "wilson.arroyo12@gmail.com";
    const fecha = new Date().toLocaleString("es-CO", {
      timeZone: "America/Bogota",
    });

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `📬 Nuevo mensaje de contacto — ${nombre.replace(/[\r\n]+/g, " ")}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0B0B0B; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #C2B280; font-size: 24px; margin-bottom: 5px;">¡Nuevo mensaje de contacto!</h1>
            <p style="color: #888; font-size: 13px;">Desde la página /contact del portafolio</p>
          </div>

          <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
            <h2 style="color: #fff; font-size: 18px; margin-bottom: 15px;">📋 Datos del visitante</h2>
            <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #888; width: 130px;">Nombre:</td><td style="padding: 8px 0; color: #fff; font-weight: 600;">${escapeHtml(
                nombre
              )}</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(
                email
              )}" style="color: #C2B280;">${escapeHtml(email)}</a></td></tr>
            </table>
          </div>

          <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
            <h2 style="color: #fff; font-size: 18px; margin-bottom: 15px;">💬 Mensaje</h2>
            <p style="color: #aaa; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(
              mensaje
            )}</p>
          </div>

          <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
            <h2 style="color: #fff; font-size: 18px; margin-bottom: 15px;">📊 Origen</h2>
            <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
              ${origenFilas(utm)}
            </table>
          </div>

          <div style="text-align: center; margin-top: 25px;">
            <a href="mailto:${escapeHtml(
              email
            )}" style="display: inline-block; background: #C2B280; color: #000; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
              ✉️ Responder por email
            </a>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #555; font-size: 11px;">
              Lead capturado en ${SITE_HOST}/contact<br>
              ${fecha}<br>
              El visitante aceptó la política de privacidad al enviar el formulario.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Error al enviar el email. Intenta de nuevo o escríbeme por WhatsApp." },
        { status: 500 }
      );
    }

    // Copia del lead para el panel /panel/leads. Se ESPERA (no fire-and-forget):
    // en Vercel la función se congela al responder y la escritura se perdería.
    await guardarLead({
      origen: "contacto",
      nombre,
      contacto: email,
      presupuesto: "No indicó",
      necesidad: mensaje,
      utm,
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API contacto error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
