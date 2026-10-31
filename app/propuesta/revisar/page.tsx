/**
 * /propuesta/revisar?t=TOKEN   (PÁGINA PRIVADA — solo Wilson)
 * ============================================================
 * Server component: valida el token firmado ANTES de renderizar.
 * - Token válido  → muestra el panel de revisión editable
 * - Token inválido/expirado → muestra un aviso amable
 *
 * La página no se indexa (robots noindex) y no expone el token
 * a ningún tercero: solo existe en el email de Wilson.
 * ============================================================
 */

import type { Metadata } from "next";
import { verificarToken } from "@/lib/propuestas";
import { SITE_URL } from "@/lib/pricing";
import PropuestaReview from "@/components/PropuestaReview";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Revisión de propuesta",
  robots: { index: false, follow: false },
};

export default async function RevisarPropuestaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const t = typeof params.t === "string" ? params.t : "";
  const resultado = verificarToken(t);

  const avisos: Record<string, { icono: string; titulo: string; detalle: string }> = {
    "sin-secreto": {
      icono: "🔐",
      titulo: "Configuración pendiente",
      detalle:
        "El servidor no tiene la clave de firma. Agrega DIAGNOSTICS_KEY en las variables de entorno de Vercel y haz Redeploy.",
    },
    formato: {
      icono: "✂️",
      titulo: "Enlace incompleto",
      detalle:
        "El enlace quedó cortado. Abre el correo y haz clic directamente en el botón dorado.",
    },
    firma: {
      icono: "🚫",
      titulo: "Enlace no válido",
      detalle:
        "Este enlace no fue firmado correctamente. Usa el botón del correo que te llegó.",
    },
    expirado: {
      icono: "⏳",
      titulo: "Enlace expirado",
      detalle:
        "Las propuestas expiran a los 7 días por seguridad. Pídele al cliente que vuelva a solicitarla desde el chat y te llegará una nueva.",
    },
  };

  if (!resultado.ok) {
    const aviso = avisos[resultado.razon] || avisos.firma;
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0B0B0B] px-4">
        <div className="max-w-md w-full bg-[#111] border border-[#333] rounded-2xl p-10 text-center">
          <div className="text-5xl mb-4">{aviso.icono}</div>
          <h1 className="text-[#C2B280] text-2xl font-bold mb-3">{aviso.titulo}</h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">{aviso.detalle}</p>
          <a
            href={SITE_URL}
            className="inline-block bg-[#C2B280] text-black font-semibold text-sm px-7 py-3 rounded-xl hover:opacity-80 transition"
          >
            Volver al portafolio
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0B0B] px-4 py-10">
      <PropuestaReview payload={resultado.payload} token={t} />
    </main>
  );
}
