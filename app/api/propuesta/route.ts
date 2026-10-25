/**
 * POST /api/propuesta
 * ============================================================
 * 1. Recibe los datos del formulario (lanzados desde el chat de Alma)
 * 2. Groq redacta el borrador con los precios reales de Wilson
 * 3. Firma el borrador (HMAC) y lo envía SOLO al email de Wilson
 *    con un botón hacia /propuesta/revisar
 *
 * NUNCA se envía nada al cliente en este paso: primero Wilson aprueba.
 * ============================================================
 */

import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  generarPropuesta,
  firmarToken,
  limpiarTexto,
  normalizarWhatsApp,
  escapeHtml,
  rateLimitOk,
  fechaBogota,
  SITE_BASE,
  PROYECTO_LABELS,
  PRESUPUESTO_LABELS,
  type SolicitudPropuesta,
  type PropuestaPayload,
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
    // ---- Rate limit (5 propuestas por hora por IP) ----
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!rateLimitOk(ip, 5)) {
      console.warn(`[Alma] Propuesta: rate limit alcanzado para ${ip}`);
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta más tarde." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // ---- Validación y saneamiento ----
    const nombre = limpiarTexto(body?.nombre, 80);
    const whatsappRaw = limpiarTexto(body?.whatsapp, 30);
    const email = limpiarTexto(body?.email, 120).toLowerCase();
    const tipo = limpiarTexto(body?.tipo, 20);
    const presupuesto = limpiarTexto(body?.presupuesto, 20);
    const detalles =
      typeof body?.detalles === "string" ? body.detalles.trim().slice(0, 1000) : "";

    const esMsgValido = (m: unknown) =>
      !!m &&
      typeof m === "object" &&
      typeof (m as { content?: string }).content === "string" &&
      ["user", "assistant"].includes((m as { role?: string }).role || "");

    const historial = Array.isArray(body?.historial)
      ? body.historial
          .filter(esMsgValido)
          .slice(-10)
          .map((m: { role: string; content: string }) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: String(m.content).slice(0, 800),
          }))
      : [];

    if (!nombre) {
      return NextResponse.json({ error: "Falta el nombre" }, { status: 400 });
    }
    if (!whatsappRaw && !email) {
      return NextResponse.json(
        { error: "Necesitamos tu WhatsApp o tu correo para enviarte la propuesta" },
        { status: 400 }
      );
    }
    if (email && !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const whatsapp = normalizarWhatsApp(whatsappRaw);

    const solicitud: SolicitudPropuesta = {
      nombre,
      whatsapp,
      email,
      tipo,
      presupuesto,
      detalles,
      historial,
    };

    // ---- 1) Generar borrador ----
    const { texto, modelo } = await generarPropuesta(solicitud);
    console.log(`[Alma] Propuesta generada para ${nombre} (modelo: ${modelo})`);

    // ---- 2) Firmar el borrador ----
    const now = Date.now();
    const payload: PropuestaPayload = {
      n: nombre,
      e: email,
      w: whatsapp,
      t: tipo,
      b: presupuesto,
      d: detalles,
      p: texto,
      m: modelo,
      ts: now,
      exp: now + 7 * 24 * 60 * 60 * 1000, // 7 días
    };

    let token: string;
    try {
      token = firmarToken(payload);
    } catch (err) {
      console.error("[Alma] Propuesta:", err);
      return NextResponse.json(
        { error: "Configuración interna incompleta (falta la clave de firma)" },
        { status: 500 }
      );
    }
    const urlRevision = `${SITE_BASE}/propuesta/revisar?t=${token}`;

    // ---- 3) Enviar el borrador SOLO a Wilson ----
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; background: #0B0B0B; padding: 36px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 26px;">
          <h1 style="color: #C2B280; font-size: 24px; margin-bottom: 6px;">📝 Propuesta lista para revisar</h1>
          <p style="color: #888; font-size: 13px;">Generada por Alma · ${fechaBogota()} · origen: ${modelo === "ia" ? "IA (Groq)" : "plantilla"}</p>
        </div>

        <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 22px; margin-bottom: 18px;">
          <h2 style="color: #fff; font-size: 17px; margin: 0 0 14px;">👤 Cliente</h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #888; width: 120px;">Nombre:</td><td style="padding: 6px 0; color: #fff; font-weight: 600;">${escapeHtml(nombre)}</td></tr>
            ${whatsapp ? `<tr><td style="padding: 6px 0; color: #888;">WhatsApp:</td><td style="padding: 6px 0;"><a href="https://wa.me/${whatsapp}" style="color: #25D366;">+${escapeHtml(whatsapp)}</a></td></tr>` : ""}
            ${email ? `<tr><td style="padding: 6px 0; color: #888;">Email:</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #C2B280;">${escapeHtml(email)}</a></td></tr>` : ""}
            <tr><td style="padding: 6px 0; color: #888;">Proyecto:</td><td style="padding: 6px 0; color: #fff;">${escapeHtml(PROYECTO_LABELS[tipo] || tipo || "No especificado")}</td></tr>
            <tr><td style="padding: 6px 0; color: #888;">Presupuesto:</td><td style="padding: 6px 0; color: #fff;">${escapeHtml(PRESUPUESTO_LABELS[presupuesto] || presupuesto || "No definido")}</td></tr>
          </table>
          ${detalles ? `<p style="color: #aaa; font-size: 13px; line-height: 1.6; margin: 14px 0 0; white-space: pre-wrap;"><b style="color:#C2B280;">Necesidad:</b> ${escapeHtml(detalles)}</p>` : ""}
        </div>

        <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 22px; margin-bottom: 22px;">
          <h2 style="color: #fff; font-size: 17px; margin: 0 0 14px;">📄 Borrador de propuesta</h2>
          <p style="color: #ddd; font-size: 14px; line-height: 1.7; white-space: pre-wrap; background: #0B0B0B; border: 1px solid #222; border-radius: 6px; padding: 16px;">${escapeHtml(texto)}</p>
        </div>

        <div style="text-align: center; margin: 26px 0;">
          <a href="${urlRevision}" style="display: inline-block; background: #C2B280; color: #000; padding: 15px 34px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
            ✅ Revisar, editar y aprobar
          </a>
          <p style="color: #666; font-size: 12px; margin-top: 14px;">
            Solo al aprobar se prepara el envío al cliente. Nada sale sin tu confirmación.
          </p>
        </div>

        <div style="text-align: center; margin-top: 26px; border-top: 1px solid #222; padding-top: 18px;">
          <p style="color: #555; font-size: 11px; line-height: 1.7;">
            🔐 Este enlace es personal: quien lo abra puede aprobar la propuesta. No lo reenvíes.<br>
            ⏳ Expira el ${fechaBogota(payload.exp)}.<br>
            Wilson Valencia — wvalencia-dev.vercel.app
          </p>
        </div>
      </div>
    `;

    const resend = getResend();
    const { error } = await resend.emails.send({
      from: "Alma Propuestas <onboarding@resend.dev>",
      to: [NOTIFY_EMAIL],
      subject: `📝 Propuesta para ${nombre} — ${PROYECTO_LABELS[tipo] || "Proyecto web"}`,
      html,
    });

    if (error) {
      console.error("[Alma] Propuesta: error enviando borrador:", error);
      return NextResponse.json(
        { error: "La propuesta se generó pero no pude notificar a Wilson. Intenta de nuevo o escríbele por WhatsApp." },
        { status: 500 }
      );
    }

    console.log(`[Alma] Propuesta: borrador enviado a ${NOTIFY_EMAIL} (cliente: ${nombre})`);

    return NextResponse.json({
      ok: true,
      modelo,
      mensaje:
        "¡Listo! Wilson ya recibió tu solicitud y está preparando tu propuesta. Te escribirá por WhatsApp muy pronto.",
    });
  } catch (err) {
    console.error("[Alma] Propuesta: error interno:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
