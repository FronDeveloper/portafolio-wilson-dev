import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "FlowBill — Sistema de gestión y facturación para agencias | Wilson Valencia Dev",
  description:
    "¿Tu agencia gestiona proyectos en Excel y facturas en Word? Mira cómo construí FlowBill: sistema SaaS completo con Kanban, facturación con IVA y portal del cliente en Next.js y Supabase.",
  keywords: [
    "sistema de gestión proyectos next.js",
    "software facturación agencias colombia",
    "saas gestión proyectos supabase",
    "portal cliente proyectos",
    "kanban next.js typescript",
  ],
  openGraph: {
    title: "FlowBill — Sistema SaaS de gestión y facturación | Wilson Valencia",
    description:
      "Sistema completo para agencias creativas: Kanban, facturación con IVA, portal del cliente y reportes financieros. Construido con Next.js 14 y Supabase.",
    url: "https://wvalencia-dev.vercel.app/projects/flowbill",
  },
  alternates: {
    canonical: "https://wvalencia-dev.vercel.app/projects/flowbill",
  },
};

const tech = [
  "Next.js 14",
  "TypeScript",
  "Supabase",
  "PostgreSQL",
  "Tailwind CSS",
  "Recharts",
  "Supabase Auth",
  "jsPDF",
  "Resend",
  "Vercel",
];

const modules = [
  {
    icon: "📊",
    title: "Dashboard",
    desc: "KPIs en tiempo real: proyectos activos, ingresos del mes, facturas pendientes y tareas vencidas. Gráfica de ingresos de los últimos 6 meses.",
  },
  {
    icon: "👥",
    title: "Gestión de clientes",
    desc: "CRM básico con estados activo/prospecto/inactivo. Vista detalle por cliente con historial de proyectos y facturas.",
  },
  {
    icon: "📁",
    title: "Proyectos",
    desc: "Gestión completa del ciclo de vida. Progreso calculado automáticamente desde tareas. URLs de vista previa visibles para el cliente.",
  },
  {
    icon: "🗂️",
    title: "Kanban",
    desc: "Tablero drag & drop con columnas Por hacer / En progreso / Revisión / Listo. Filtros por responsable y prioridad.",
  },
  {
    icon: "🧾",
    title: "Facturación",
    desc: "Creación de facturas con líneas de servicio, IVA 19% automático y vista PDF profesional. Estados: borrador → enviada → pagada.",
  },
  {
    icon: "🌐",
    title: "Portal del cliente",
    desc: "Acceso independiente para cada cliente. Ve el progreso de su proyecto, aprueba entregables con comentarios y descarga sus facturas.",
  },
];

export default function FlowBillProject() {
  return (
    <main className="text-white min-h-screen">
      <Navbar />

      <section className="px-8 md:px-20 py-20 max-w-4xl mx-auto">
        <Link
          href="/projects"
          className="text-sm text-gray-400 hover:text-[#C2B280] transition inline-block mb-6"
        >
          ← Volver a proyectos
        </Link>

        {/* Title */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <h1 className="text-4xl md:text-5xl font-bold text-[#C2B280]">
            FlowBill
          </h1>
          <span className="text-xs font-bold bg-green-900/50 text-green-400 border border-green-700 px-3 py-1 rounded-full">
            ✓ En producción
          </span>
        </div>
        <p className="text-gray-400 text-lg mb-10">
          Sistema SaaS de gestión de proyectos y facturación para agencias creativas y consultoras pequeñas.
        </p>

        {/* Hero image */}
        <div className="relative w-full h-72 md:h-96 mb-12 rounded-2xl overflow-hidden border border-gray-800">
          <Image
            src="/images/flowbill.jpg"
            alt="FlowBill — Sistema de gestión y facturación"
            fill
            className="object-cover object-top"
          />
        </div>

        {/* Problem / Solution */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-[#111] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3 text-white">
              🔴 El problema
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Las agencias creativas pequeñas gestionan sus proyectos en Excel,
              sus facturas en Word y se comunican con clientes por WhatsApp.
              Todo está disperso, nada queda registrado y el cliente nunca sabe
              cómo va su proyecto sin preguntar.
            </p>
          </div>
          <div className="bg-[#111] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3 text-white">
              🟢 La solución
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Desarrollé un sistema completo que centraliza todo: desde que
              llega un cliente hasta que se cobra la factura. Incluye un portal
              independiente donde el cliente ve el avance de su proyecto en
              tiempo real y aprueba entregables sin salir de la plataforma.
            </p>
          </div>
        </div>

        {/* Modules */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Módulos del sistema</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {modules.map((m) => (
              <div
                key={m.title}
                className="bg-[#111] border border-gray-800 rounded-xl p-5 hover:border-[#C2B280]/50 transition"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-xl">{m.icon}</span>
                  <h3 className="font-semibold text-white">{m.title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Portal del cliente highlight */}
        <div className="bg-gradient-to-br from-blue-950/50 to-purple-950/30 border border-blue-800/50 rounded-2xl p-7 mb-12">
          <h2 className="text-xl font-semibold mb-3 text-blue-300">
            ✨ Diferenciador: Portal del cliente
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Cada cliente tiene acceso a un portal independiente con login propio
            donde puede ver el progreso de sus proyectos con un semáforo de
            salud (🟢 En tiempo / 🟡 En riesgo / 🔴 Atrasado), aprobar
            entregables con comentarios, ver links de vista previa del proyecto
            en desarrollo y descargar sus facturas en PDF.
          </p>
          <div className="flex gap-3 flex-wrap text-xs">
            {[
              "Login independiente por cliente",
              "Semáforo de salud del proyecto",
              "Aprobación de entregables",
              "Comentarios en tareas",
              "Links de vista previa",
              "Descarga de facturas PDF",
            ].map((f) => (
              <span
                key={f}
                className="bg-blue-900/40 text-blue-300 border border-blue-800/50 px-2.5 py-1 rounded-full"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Stack técnico</h2>
          <div className="flex flex-wrap gap-2">
            {tech.map((t) => (
              <span
                key={t}
                className="bg-[#111] border border-gray-800 px-3 py-1.5 rounded-full text-sm text-gray-300 hover:border-[#C2B280]/50 transition"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Key decisions */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Decisiones técnicas destacadas
          </h2>
          <div className="space-y-4 text-sm text-gray-400">
            <div className="flex gap-3">
              <span className="text-[#C2B280] flex-shrink-0 mt-0.5">→</span>
              <p>
                <span className="text-white font-medium">Modo demo sin backend:</span>{" "}
                El sistema funciona completamente con datos en memoria usando React
                state, lo que permite demostraciones inmediatas sin configurar
                Supabase. La arquitectura está lista para conectar la base de datos
                real en cualquier momento.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-[#C2B280] flex-shrink-0 mt-0.5">→</span>
              <p>
                <span className="text-white font-medium">Autenticación dual:</span>{" "}
                El middleware maneja dos sistemas de auth independientes — uno para
                el equipo de la agencia (Supabase Auth) y otro para los clientes
                (cookie-based) — con rutas completamente separadas.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-[#C2B280] flex-shrink-0 mt-0.5">→</span>
              <p>
                <span className="text-white font-medium">Schema con RLS:</span>{" "}
                Base de datos PostgreSQL diseñada con Row Level Security para que
                cada cliente solo pueda acceder a sus propios datos, incluso
                compartiendo la misma base de datos.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-[#C2B280] flex-shrink-0 mt-0.5">→</span>
              <p>
                <span className="text-white font-medium">Semáforo de salud calculado:</span>{" "}
                El estado del proyecto (🟢🟡🔴) se calcula dinámicamente cruzando
                tareas vencidas, fecha de entrega y porcentaje de avance — sin
                que el equipo tenga que actualizarlo manualmente.
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-[#111] p-6 rounded-xl border border-gray-800 mb-10">
          <h3 className="text-xl font-semibold mb-3 text-[#C2B280]">
            📊 Lo que incluye el sistema
          </h3>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-400">
            {[
              "7 módulos completos y funcionales",
              "8 tablas en PostgreSQL con relaciones",
              "Portal del cliente con auth independiente",
              "Facturación con IVA 19% automático",
              "Kanban con drag & drop nativo",
              "Reportes financieros con Recharts",
              "Schema SQL con RLS y triggers",
              "Deploy en Vercel listo para producción",
            ].map((r) => (
              <p key={r} className="flex items-center gap-2">
                <span className="text-green-400">✓</span> {r}
              </p>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-4 flex-wrap">
          <a
            href="https://flowbill-web.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#C2B280] text-black rounded-xl font-semibold hover:opacity-80 transition"
          >
            🌐 Ver demo en vivo →
          </a>
          <a
            href="https://flowbill-web.vercel.app/portal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border border-blue-700 text-blue-300 rounded-xl font-semibold hover:bg-blue-900/30 transition"
          >
            👤 Ver portal del cliente →
          </a>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 bg-[#0f1117] border border-gray-800 rounded-xl p-5 text-sm">
          <p className="text-gray-500 font-medium mb-3">Credenciales demo</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-xs mb-1">Panel de administración</p>
              <p className="text-gray-300 font-mono text-xs">admin@flowbill.co</p>
              <p className="text-gray-300 font-mono text-xs">demo2026</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs mb-1">Portal del cliente</p>
              <p className="text-gray-300 font-mono text-xs">scastro@invandinas.com</p>
              <p className="text-gray-300 font-mono text-xs">cliente123</p>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}