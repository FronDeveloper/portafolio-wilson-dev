import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  PROYECTO_LABELS,
  etiquetaPresupuesto,
  PRESUPUESTO_LABELS,
  LEGACY_PRESUPUESTO_LABELS,
  SITE_HOST,
} from "@/lib/pricing";
import { rateLimitOk } from "@/lib/propuestas";
import { guardarLead } from "@/lib/leads-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Margen para esperar el correo + la escritura en la base de datos
export const maxDuration = 30;

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

const from = `Portafolio Lead <${process.env.EMAIL_FROM || "onboarding@resend.dev"}>`;

function origenFilas(utm: Record<string, string>): string {
  const filas: [string, string][] = [
    ["Página", utm.page || "—"],
    ["Fuente", utm.utm_source || "Directo (sin UTM)"],
    ["Medio", utm.utm_medium || "—"],
    ["Campaña", utm.utm_campaign || "—"],
    ["Contenido", utm.utm_content || "—"],
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

    const name = texto(body.name, 80);
    const email = texto(body.email, 120);
    const whatsapp = texto(body.whatsapp, 30);
    const projectType = texto(body.projectType, 40);
    const budget = texto(body.budget, 40);
    const description = texto(body.description, 2000);
    const consent = body.consent === true;

    if (!name || !email || !whatsapp || !projectType || !budget) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    if (whatsapp.replace(/\D/g, "").length < 7) {
      return NextResponse.json(
        { error: "WhatsApp inválido" },
        { status: 400 }
      );
    }

    if (!PROYECTO_LABELS[projectType]) {
      return NextResponse.json(
        { error: "Tipo de proyecto inválido" },
        { status: 400 }
      );
    }

    if (!PRESUPUESTO_LABELS[budget] && !LEGACY_PRESUPUESTO_LABELS[budget]) {
      return NextResponse.json(
        { error: "Rango de presupuesto inválido" },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: "Debes aceptar la política de privacidad para enviar la solicitud." },
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

    const telDigits = whatsapp.replace(/\D/g, "");
    const to = process.env.NOTIFY_EMAIL || "wilson.arroyo12@gmail.com";
    const fecha = new Date().toLocaleString("es-CO", {
      timeZone: "America/Bogota",
    });

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `🎯 Nueva cotización — ${name.replace(/[\r\n]+/g, " ")} (${
        PROYECTO_LABELS[projectType]
      })`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0B0B0B; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #C2B280; font-size: 24px; margin-bottom: 5px;">¡Nueva solicitud de cotización!</h1>
            <p style="color: #888; font-size: 13px;">Responde en menos de 24h</p>
          </div>

          <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
            <h2 style="color: #fff; font-size: 18px; margin-bottom: 15px;">📋 Datos del cliente</h2>
            <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #888; width: 130px;">Nombre:</td><td style="padding: 8px 0; color: #fff; font-weight: 600;">${escapeHtml(
                name
              )}</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(
                email
              )}" style="color: #C2B280;">${escapeHtml(email)}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #888;">WhatsApp:</td><td style="padding: 8px 0;"><a href="https://wa.me/${telDigits}" style="color: #25D366;">${escapeHtml(
                whatsapp
              )}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Tipo proyecto:</td><td style="padding: 8px 0; color: #fff;">${
                PROYECTO_LABELS[projectType]
              }</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Presupuesto:</td><td style="padding: 8px 0; color: #fff;">${escapeHtml(
                etiquetaPresupuesto(budget)
              )}</td></tr>
            </table>
          </div>

          ${
            description
              ? `<div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
            <h2 style="color: #fff; font-size: 18px; margin-bottom: 15px;">💬 Descripción del proyecto</h2>
            <p style="color: #aaa; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(
              description
            )}</p>
          </div>`
              : ""
          }

          <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
            <h2 style="color: #fff; font-size: 18px; margin-bottom: 15px;">📊 Origen del lead</h2>
            <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
              ${origenFilas(utm)}
            </table>
          </div>

          <div style="text-align: center; margin-top: 25px;">
            <a href="https://wa.me/${telDigits}?text=${encodeURIComponent(
              `Hola ${name}, vi tu solicitud de cotización en mi portafolio`
            )}" style="display: inline-block; background: #25D366; color: #000; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
              💬 Responder por WhatsApp
            </a>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #555; font-size: 11px;">
              Lead capturado en ${SITE_HOST}/cotizar<br>
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
      origen: "cotizar",
      nombre: name,
      contacto: email,
      whatsapp: telDigits,
      presupuesto: etiquetaPresupuesto(budget),
      necesidad: description || PROYECTO_LABELS[projectType],
      utm,
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API cotizar error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
