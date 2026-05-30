import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "AgendaPro — Sistema de citas online para negocios | Wilson Valencia Dev",
  description:
    "¿Recibes reservas por WhatsApp y se te cruzan las citas? Así construí AgendaPro: sistema de agendamiento con calendario, notificaciones automáticas por email y WhatsApp. Next.js y Supabase.",
  keywords: [
    "sistema de citas online colombia",
    "software agendamiento negocios",
    "reservas online next.js supabase",
    "agenda online salones consultorios colombia",
    "notificaciones whatsapp citas",
  ],
  openGraph: {
    title: "AgendaPro — Sistema de citas para negocios | Wilson Valencia",
    description:
      "Sistema de agendamiento con calendario interactivo, notificaciones automáticas y portal de reservas. Construido con Next.js y Supabase.",
    url: "https://wvalencia-dev.vercel.app/projects/agenda-pro",
  },
  alternates: {
    canonical: "https://wvalencia-dev.vercel.app/projects/agenda-pro",
  },
};

export default function AgendaProProject() {
  return (
    <main className="bg-[#0B0B0B] text-white min-h-screen">
      <Navbar />

      <section className="px-8 md:px-20 py-20 max-w-4xl mx-auto">
        <Link href="/projects" className="text-sm text-gray-400 hover:text-[#C2B280] transition inline-block mb-6">
          ← Volver a proyectos
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#C2B280]">
          AgendaPro
        </h1>

        <div className="relative w-full h-96 mb-10 rounded-xl overflow-hidden">
          <Image
            src="/images/agenda-pro.jpg"
            alt="AgendaPro"
            fill
            className="object-cover object-top"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Descripción</h2>
            <p className="text-gray-400">
              Sistema de agendamiento de citas completo para negocios locales como clínicas, barberías,
              restaurantes y consultorios. Incluye calendario interactivo, portal de reservas público,
              dashboard de administración y notificaciones automáticas.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Problema que resuelve</h2>
            <p className="text-gray-400">
              Los negocios locales necesitan gestionar citas de manera eficiente sin depender de
              sistemas complejos o costosos. Muchos aún usan agendas manuales o WhatsApp sin organización.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Solución implementada</h2>
          <p className="text-gray-400">
            Desarrollé un sistema completo con calendario interactivo (día/semana/mes), portal de reservas
            público con disponibilidad en tiempo real, dashboard de administración para gestionar servicios
            y staff, y sistema de notificaciones automáticas por email y WhatsApp con recordatorios.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Características principales</h2>
          <div className="space-y-2 text-gray-400">
            <p>• Registro y autenticación de negocios</p>
            <p>• Gestión completa de servicios y personal</p>
            <p>• Calendario interactivo con vista día/semana/mes</p>
            <p>• Portal público de reservas con disponibilidad en tiempo real</p>
            <p>• Dashboard de administración con estadísticas</p>
            <p>• Notificaciones automáticas por email (Resend)</p>
            <p>• Notificaciones por WhatsApp (Twilio) - opcional</p>
            <p>• Recordatorios automáticos 24h antes de la cita</p>
            <p>• Sistema de cancelación con notificaciones</p>
            <p>• Base de datos en Supabase con políticas RLS</p>
            <p>• Cron jobs en Vercel para recordatorios</p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Tecnologías utilizadas</h2>
          <div className="flex flex-wrap gap-2">
            {["Next.js 14", "TypeScript", "Supabase", "NextAuth", "Resend", "Twilio", "Tailwind CSS", "shadcn/ui", "Vercel Cron"].map(tech => (
              <span key={tech} className="bg-[#111] border border-gray-800 px-3 py-1 rounded-full text-sm text-gray-300">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#111] p-6 rounded-xl border border-gray-800 mb-6">
          <h3 className="text-xl font-semibold mb-2 text-[#C2B280]">📊 Resultados</h3>
          <p className="text-gray-400">
            • Sistema 100% funcional con reservas en tiempo real<br />
            • Portal público optimizado para móviles<br />
            • Notificaciones automáticas funcionando<br />
            • Gestión eficiente de servicios y personal<br />
            • Dashboard intuitivo para administradores<br />
            • Desplegado en Vercel con cron jobs activos
          </p>
        </div>

        <div className="flex gap-4 flex-wrap">
          <a
            href="https://agendaprocol.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#C2B280] text-black rounded-xl font-semibold hover:opacity-80 transition"
          >
            🌐 Ver sitio en vivo →
          </a>
          <a
            href="https://github.com/FronDeveloper/agendaPro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border border-gray-600 rounded-xl font-semibold hover:bg-white hover:text-black transition"
          >
            📦 Ver código en GitHub
          </a>
        </div>
      </section>
    </main>
  );
}