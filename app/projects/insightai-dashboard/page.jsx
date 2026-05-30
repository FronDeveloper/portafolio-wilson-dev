import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "InsightAI Dashboard — Dashboard con IA para tiendas | Wilson Valencia Dev",
  description:
    "¿Necesitas visualizar métricas de tu tienda con inteligencia artificial? InsightAI es un dashboard con análisis de ventas, inventario y asistente IA integrado. Construido con Next.js y Supabase.",
  keywords: [
    "dashboard inteligencia artificial colombia",
    "dashboard ia next.js supabase",
    "análisis ventas ia tienda",
    "visualización métricas next.js",
    "dashboard negocios colombia",
  ],
  openGraph: {
    title: "InsightAI Dashboard — IA para análisis de negocio | Wilson Valencia",
    description:
      "Dashboard con inteligencia artificial para tiendas: métricas en tiempo real, análisis de ventas y asistente IA. Stack: Next.js y Supabase.",
    url: "https://wvalencia-dev.vercel.app/projects/insightai-dashboard",
  },
  alternates: {
    canonical: "https://wvalencia-dev.vercel.app/projects/insightai-dashboard",
  },
};

export default function InsightAIDashboardProject() {
  return (
    <main className="bg-[#0B0B0B] text-white min-h-screen">
      <Navbar />

      <section className="px-8 md:px-20 py-20 max-w-4xl mx-auto">
        <Link href="/projects" className="text-sm text-gray-400 hover:text-[#C2B280] transition inline-block mb-6">
          ← Volver a proyectos
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#C2B280]">
          InsightAI Dashboard
        </h1>

        <div className="relative w-full h-96 mb-10 rounded-xl overflow-hidden">
          <Image
            src="/images/insightai-dashboard.jpg"
            alt="InsightAI Dashboard"
            fill
            className="object-cover object-top"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Descripción</h2>
            <p className="text-gray-400">
              Dashboard de gestión inteligente para tiendas de productos naturales con análisis de ventas,
              gestión de inventario y chatbot con IA. Diseñado para dueños de negocios sin conocimientos técnicos.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Problema que resuelve</h2>
            <p className="text-gray-400">
              Los dueños de tiendas de productos naturales necesitan visualizar métricas clave de su negocio
              sin tener conocimientos técnicos de análisis de datos o programación.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Solución implementada</h2>
          <p className="text-gray-400">
            Desarrollé un dashboard intuitivo con gráficos interactivos, gestión de inventario en tiempo real,
            análisis de ventas por período y categorías, y un chatbot con IA que responde preguntas sobre el negocio.
            Incluye autenticación segura, gestión de clientes y exportación de reportes.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Características principales</h2>
          <div className="space-y-2 text-gray-400">
            <p>• Dashboard con KPIs en tiempo real (ventas, stock, clientes)</p>
            <p>• Gráficos interactivos de ventas mensuales y semanales</p>
            <p>• Gestión completa de inventario con alertas de stock bajo</p>
            <p>• Registro de transacciones con productos reales</p>
            <p>• Análisis de ventas por categoría y productos más vendidos</p>
            <p>• Gestión de clientes con segmentación y métricas</p>
            <p>• Reportes detallados con filtros y exportación</p>
            <p>• Chatbot con IA para consultas del negocio</p>
            <p>• Autenticación segura con NextAuth</p>
            <p>• Base de datos en Supabase con políticas RLS</p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Tecnologías utilizadas</h2>
          <div className="flex flex-wrap gap-2">
            {["Next.js 16", "TypeScript", "Supabase", "NextAuth", "Recharts", "Tailwind CSS", "shadcn/ui", "Lucide Icons", "Anthropic API"].map(tech => (
              <span key={tech} className="bg-[#111] border border-gray-800 px-3 py-1 rounded-full text-sm text-gray-300">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#111] p-6 rounded-xl border border-gray-800 mb-6">
          <h3 className="text-xl font-semibold mb-2 text-[#C2B280]">📊 Resultados</h3>
          <p className="text-gray-400">
            • Dashboard 100% funcional con datos en tiempo real<br />
            • Interfaz intuitiva sin necesidad de conocimientos técnicos<br />
            • Análisis completo de ventas y tendencias<br />
            • Gestión eficiente de inventario y clientes<br />
            • Chatbot con IA que responde preguntas del negocio<br />
            • Desplegado en Vercel con SSL y optimización automática
          </p>
        </div>

        <div className="flex gap-4 flex-wrap">
          <a
            href="https://vitainsight.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#C2B280] text-black rounded-xl font-semibold hover:opacity-80 transition"
          >
            🌐 Ver sitio en vivo →
          </a>
          <a
            href="https://github.com/FronDeveloper/insightai-dashboard"
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