import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Mínimo Studio | Wilson Dev",
  description: "E-commerce de ropa minimalista con panel admin, pagos con Stripe + Wompi + PSE, autenticación y gestión de inventario en tiempo real.",
};

const TECH = [
  "Next.js 15", "TypeScript", "Prisma ORM", "PostgreSQL",
  "Stripe", "Wompi", "PSE", "NextAuth.js",
  "Tailwind CSS", "Vercel", "shadcn/ui", "React Context"
];

const FEATURES = [
  { icon: "🛍️", title: "Catálogo completo", desc: "8 productos con variantes de talla, imágenes múltiples, filtros por categoría y precio en COP." },
  { icon: "🛒", title: "Carrito persistente", desc: "Carrito con React Context, barra de progreso hacia envío gratis y animaciones de entrada." },
  { icon: "💳", title: "Checkout multi-paso", desc: "4 pasos: información, envío, pago y revisión. Stripe, Wompi, PSE y Efecty integrados." },
  { icon: "🔐", title: "Autenticación con roles", desc: "NextAuth con roles admin y cliente. Sesión JWT, login con credenciales y páginas protegidas." },
  { icon: "⚙️", title: "Panel de administración", desc: "Dashboard con estadísticas, CRUD de productos, gestión de pedidos, clientes y configuración." },
  { icon: "📸", title: "Upload de imágenes local", desc: "Subida de imágenes desde el admin guardadas en disco y registradas en PostgreSQL." },
];

export default function MinimoStudioProject() {
  return (
    <main className="bg-[#0B0B0B] text-white min-h-screen">
      <Navbar />

      <section className="px-8 md:px-20 py-20 max-w-5xl mx-auto">
        <Link href="/projects" className="text-sm text-gray-400 hover:text-[#C2B280] transition inline-block mb-6">
          ← Volver a proyectos
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3 inline-block">
              ✓ Completado · En producción
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#C2B280]">
              Mínimo Studio
            </h1>
            <p className="text-gray-400 mt-2 text-lg">E-commerce de ropa minimalista — Full Stack</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href="https://minimo-studio.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C2B280] text-black rounded-xl font-semibold hover:opacity-80 transition text-sm"
            >
              🌐 Ver demo en vivo
            </a>
            <a
              href="https://github.com/FronDeveloper/minimo-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-700 text-white rounded-xl font-semibold hover:border-[#C2B280] hover:text-[#C2B280] transition text-sm"
            >
              📦 Ver código
            </a>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative w-full h-80 md:h-[480px] mb-12 rounded-2xl overflow-hidden bg-[#111] border border-gray-800">
          <Image
            src="/images/minimo-studio.jpg"
            alt="Mínimo Studio - E-commerce"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6">
            <p className="text-white/80 text-sm">minimo-studio.vercel.app</p>
          </div>
        </div>

        {/* Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-3">El proyecto</h2>
            <p className="text-gray-400 leading-relaxed">
              Tienda online completa para una marca de ropa minimalista colombiana. Construida con el
              stack más usado en producción por equipos de producto modernos — Next.js 15, Prisma ORM
              y PostgreSQL en Vercel — con pagos reales integrados para el mercado local colombiano.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-3">El reto</h2>
            <p className="text-gray-400 leading-relaxed">
              Construir un e-commerce funcional de principio a fin: catálogo, carrito, checkout multi-paso
              con métodos de pago locales (Wompi, PSE, Efecty), panel de administración completo y
              gestión de imágenes de productos desde el dashboard.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Funcionalidades implementadas</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-[#111] border border-gray-800 rounded-xl p-5 hover:border-[#C2B280]/40 transition">
                <p className="text-2xl mb-2">{f.icon}</p>
                <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Stack técnico</h2>
          <div className="flex flex-wrap gap-2">
            {TECH.map((t) => (
              <span key={t} className="bg-[#111] border border-gray-800 px-3 py-1.5 rounded-full text-sm text-gray-300 hover:border-[#C2B280] hover:text-[#C2B280] transition">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-[#C2B280]">📊 Resultados del proyecto</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-400">
            {[
              "E-commerce funcional desplegado en producción con Vercel + PostgreSQL",
              "Checkout con 4 métodos de pago: Stripe, Wompi, PSE y Efecty",
              "Panel admin con CRUD de productos, pedidos, clientes y configuración",
              "Upload de imágenes locales conectado directamente a la tienda",
              "Autenticación con NextAuth — roles admin y cliente diferenciados",
              "Precios, formatos y métodos de pago adaptados al mercado colombiano",
            ].map((r) => (
              <div key={r} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Demo credentials */}
        <div className="bg-[#111] p-6 rounded-2xl border border-[#C2B280]/30 mb-8">
          <h3 className="text-xl font-semibold mb-3 text-[#C2B280]">🔑 Credenciales demo</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-black/40 rounded-xl p-4">
              <p className="font-semibold text-white mb-2">👤 Admin</p>
              <p className="text-gray-400 font-mono">admin@minimostudio.co</p>
              <p className="text-gray-400 font-mono">admin123</p>
              <p className="text-gray-500 text-xs mt-1">→ Accede al panel de administración</p>
            </div>
            <div className="bg-black/40 rounded-xl p-4">
              <p className="font-semibold text-white mb-2">🛍️ Cliente</p>
              <p className="text-gray-400 font-mono">cliente@minimostudio.co</p>
              <p className="text-gray-400 font-mono">cliente123</p>
              <p className="text-gray-500 text-xs mt-1">→ Accede al área de cliente</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-4 flex-wrap">
          <a
            href="https://minimo-studio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C2B280] text-black rounded-xl font-semibold hover:opacity-80 transition"
          >
            🌐 Ver demo en vivo
          </a>
          <a
            href="https://github.com/FronDeveloper/minimo-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 text-white rounded-xl font-semibold hover:border-[#C2B280] hover:text-[#C2B280] transition"
          >
            📦 Ver en GitHub
          </a>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-800 text-gray-400 rounded-xl font-semibold hover:text-white transition"
          >
            ← Otros proyectos
          </Link>
        </div>
      </section>
    </main>
  );
}
