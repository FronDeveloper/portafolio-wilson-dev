import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimitOk } from "@/lib/propuestas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/testimonios — formulario de /testimonios
 *
 * Un testimonio NUNCA se publica automáticamente: llega por correo a
 * Wilson y él decide si lo agrega al sitio (con permiso del cliente).
 * Sin base de datos: mismo patrón que las propuestas.
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

const from = `Testimonios Portafolio <${process.env.EMAIL_FROM || "onboarding@resend.dev"}>`;

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!rateLimitOk(ip, 3, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta más tarde." },
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
    const cargo = texto(body.cargo, 120);
    const testimonio =
      typeof body.testimonio === "string"
        ? body.testimonio.trim().slice(0, 800)
        : "";
    const consent = body.consent === true;

    if (!nombre || !testimonio) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    if (testimonio.length < 20) {
      return NextResponse.json(
        { error: "El testimonio es muy corto (mínimo 20 caracteres)." },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        {
          error:
            "Debes dar tu permiso para que Wilson pueda publicar tu testimonio (con tu nombre) o no lo revisará.",
        },
        { status: 400 }
      );
    }

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
      subject: `⭐ Nuevo testimonio para revisar — ${nombre.replace(/[\r\n]+/g, " ")}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0B0B0B; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #C2B280; font-size: 24px; margin-bottom: 5px;">Nuevo testimonio recibido</h1>
            <p style="color: #888; font-size: 13px;">Revisa el texto antes de considerar publicarlo</p>
          </div>

          <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
            <h2 style="color: #fff; font-size: 18px; margin-bottom: 15px;">📋 Autor</h2>
            <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #888; width: 130px;">Nombre:</td><td style="padding: 8px 0; color: #fff; font-weight: 600;">${escapeHtml(
                nombre
              )}</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Cargo / empresa:</td><td style="padding: 8px 0; color: #fff;">${
                cargo ? escapeHtml(cargo) : "No indicó"
              }</td></tr>
            </table>
          </div>

          <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
            <h2 style="color: #fff; font-size: 18px; margin-bottom: 15px;">⭐ Testimonio</h2>
            <p style="color: #aaa; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${escapeHtml(
              testimonio
            )}</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #555; font-size: 11px;">
              El cliente autorizó (checkbox) que su testimonio se publique con su nombre.<br>
              Verifica el proyecto y su permiso explícito antes de publicar.<br>
              ${fecha}
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Error al enviar el testimonio. Intenta de nuevo más tarde." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API testimonios error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
