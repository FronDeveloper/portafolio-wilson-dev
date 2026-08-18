import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (_resend) return _resend;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY no está configurada");
  }
  _resend = new Resend(apiKey);
  return _resend;
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
  landing: "Landing Page / Sitio institucional",
  ecommerce: "E-commerce / Tienda online",
  saas: "SaaS / Sistema a medida",
  app: "App móvil",
  dashboard: "Dashboard / Panel administrativo",
  otro: "Otro / No está seguro",
};

const BUDGET_LABELS: Record<string, string> = {
  "300-800": "$300 - $800 USD",
  "800-1500": "$800 - $1.500 USD",
  "1500-3000": "$1.500 - $3.000 USD",
  "3000+": "Más de $3.000 USD",
  undefined: "No está seguro / Necesita asesoría",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, whatsapp, projectType, budget, description, utm } = body;

    if (!name || !email || !whatsapp || !projectType || !budget) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    let resend;
    try {
      resend = getResend();
    } catch (err) {
      console.error("Resend init error:", err);
      return NextResponse.json(
        { error: "Servicio de email no configurado" },
        { status: 503 }
      );
    }

    const utmInfo = utm
      ? `<tr><td style="padding: 8px 0; color: #888;">Fuente:</td><td style="padding: 8px 0; color: #fff;">${utm.utm_source || "Directo"}</td></tr>
         <tr><td style="padding: 8px 0; color: #888;">Medio:</td><td style="padding: 8px 0; color: #fff;">${utm.utm_medium || "-"}</td></tr>
         <tr><td style="padding: 8px 0; color: #888;">Campaña:</td><td style="padding: 8px 0; color: #fff;">${utm.utm_campaign || "-"}</td></tr>`
      : "<tr><td style=\"padding: 8px 0; color: #888;\">Fuente:</td><td style=\"padding: 8px 0; color: #fff;\">Directo (sin UTM)</td></tr>";

    const { data, error } = await resend.emails.send({
      from: "Portafolio Lead <onboarding@resend.dev>",
      to: ["wilson.arroyo12@gmail.com"],
      subject: `🎯 Nueva solicitud de cotización - ${name} (${PROJECT_TYPE_LABELS[projectType] || projectType})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0B0B0B; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #C2B280; font-size: 24px; margin-bottom: 5px;">¡Nuevo lead del portafolio!</h1>
            <p style="color: #888; font-size: 13px;">Responde en menos de 24h</p>
          </div>

          <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
            <h2 style="color: #fff; font-size: 18px; margin-bottom: 15px;">📋 Datos del cliente</h2>
            <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #888; width: 130px;">Nombre:</td><td style="padding: 8px 0; color: #fff; font-weight: 600;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Email:</td><td style="padding: 8px 0; color: #C2B280;"><a href="mailto:${email}" style="color: #C2B280;">${email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #888;">WhatsApp:</td><td style="padding: 8px 0; color: #fff;"><a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}" style="color: #25D366;">${whatsapp}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Tipo proyecto:</td><td style="padding: 8px 0; color: #fff;">${PROJECT_TYPE_LABELS[projectType] || projectType}</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Presupuesto:</td><td style="padding: 8px 0; color: #fff;">${BUDGET_LABELS[budget] || budget}</td></tr>
            </table>
          </div>

          ${description ? `
          <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
            <h2 style="color: #fff; font-size: 18px; margin-bottom: 15px;">💬 Descripción del proyecto</h2>
            <p style="color: #aaa; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${description}</p>
          </div>
          ` : ""}

          <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
            <h2 style="color: #fff; font-size: 18px; margin-bottom: 15px;">📊 Origen del lead</h2>
            <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
              ${utmInfo}
            </table>
          </div>

          <div style="text-align: center; margin-top: 25px;">
            <a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=Hola%20${encodeURIComponent(name)}%2C%20vi%20tu%20solicitud%20de%20cotizaci%C3%B3n%20en%20mi%20portafolio" style="display: inline-block; background: #25D366; color: #000; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
              💬 Responder por WhatsApp
            </a>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #555; font-size: 11px;">
              Este lead fue capturado en wvalencia-dev.vercel.app/cotizar<br>
              ${new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Error al enviar el email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API cotizar error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
