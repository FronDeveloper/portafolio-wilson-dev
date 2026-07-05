import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // Enviar email con la guía
    const { data, error } = await resend.emails.send({
      from: "Wilson Valencia <onboarding@resend.dev>",
      to: [email],
      subject: "📚 Tu guía: Cómo construir un SaaS multi-tenant",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0B0B0B; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #C2B280; font-size: 28px; margin-bottom: 10px;">Wilson Valencia Dev</h1>
            <p style="color: #888; font-size: 14px;">Desarrollador Full-Stack Freelance</p>
          </div>

          <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
            <h2 style="color: #fff; font-size: 20px; margin-bottom: 15px;">📚 Tu guía está lista</h2>
            <p style="color: #aaa; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
              Gracias por descargar la guía. Aquí tienes el contenido completo sobre cómo
              construir un SaaS multi-tenant con Next.js, TypeScript y Supabase.
            </p>

            <h3 style="color: #C2B280; font-size: 16px; margin-bottom: 10px;">Contenido:</h3>
            <ul style="color: #aaa; font-size: 14px; line-height: 1.8; padding-left: 20px;">
              <li>Schema multi-tenant con Supabase (RLS policies)</li>
              <li>Autenticación con roles y permisos</li>
              <li>Estructura de proyecto lista para producción</li>
              <li>Patrones de billing y suscripciones</li>
              <li>Deployment en Vercel + Supabase</li>
            </ul>

            <div style="text-align: center; margin-top: 25px;">
              <a href="https://wvalencia-dev.vercel.app" style="display: inline-block; background: #C2B280; color: #000; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
                Ver mis proyectos →
              </a>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #555; font-size: 12px;">
              Wilson Valencia — Desarrollador Full-Stack<br>
              📧 wilson.arroyo12@gmail.com<br>
              💬 WhatsApp: +57 301 2821174<br><br>
              Si no solicitaste esta guía, ignora este email.
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
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}