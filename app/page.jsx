import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import HowIWork from "@/components/HowIWork";
import Footer from "@/components/Footer";
import Link from "next/link";
import SeccionPrecios from "@/components/SeccionPrecios";
import Faq from "@/components/Faq";

export const metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="text-tinta min-h-screen">

      <Navbar />
      <Hero />

      {/* ¿EN QUÉ PUEDO AYUDARTE? */}
      <section className="px-8 md:px-20 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          ¿En qué puedo{" "}
          <span className="texto-gradiente-clara">
            ayudarte?
          </span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "🖥️",
              title: "Sistemas a medida",
              desc: "CRMs, dashboards, plataformas de gestión y facturación — software que resuelve el problema específico de tu negocio, no una plantilla genérica.",
              color: "hover:border-acento/50 hover:shadow-acento/20",
            },
            {
              icon: "🛒",
              title: "E-commerce",
              desc: "Tiendas online con pasarelas colombianas (Wompi, PSE, Efecty), carrito optimizado y panel de administración incluido.",
              color: "hover:border-acento/50 hover:shadow-acento/20",
            },
            {
              icon: "📱",
              title: "Apps móviles",
              desc: "Aplicaciones nativas para Android e iOS con Flutter — un solo desarrollo, dos plataformas, listas para publicar.",
              color: "hover:border-acento/50 hover:shadow-acento/20",
            },
          ].map((x) => (
            <div
              key={x.title}
              className={`bg-superficie p-6 rounded-xl border border-borde transition-all duration-300 hover:shadow-lg ${x.color}`}
            >
              <p className="text-3xl mb-3">{x.icon}</p>
              <h3 className="text-lg font-semibold mb-2 text-tinta">{x.title}</h3>
              <p className="text-tinta-suave text-sm leading-relaxed">{x.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROYECTOS */}
      <Projects />

      {/* CÓMO TRABAJO */}
      <HowIWork />

      {/* ¿POR QUÉ TRABAJAR CONMIGO? */}
      <section className="px-8 md:px-20 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          ¿Por qué trabajar{" "}
          <span className="texto-gradiente-clara">
            conmigo?
          </span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "🎯",
              title: "Enfoque en resultados",
              desc: "Primero entiendo tu problema, luego propongo la solución técnica. No al revés.",
            },
            {
              icon: "💬",
              title: "Comunicación directa",
              desc: "Sin intermediarios. Hablas directamente con quien construye tu producto.",
            },
            {
              icon: "🔒",
              title: "Compromiso real",
              desc: "Respuesta en menos de 24h y 30 días de soporte incluidos después del lanzamiento.",
            },
          ].map((x) => (
            <div
              key={x.title}
              className="bg-superficie p-6 rounded-xl border border-borde hover:border-acento/40 transition-all duration-300"
            >
              <p className="text-3xl mb-3">{x.icon}</p>
              <h3 className="font-semibold mb-2 text-tinta">{x.title}</h3>
              <p className="text-tinta-suave text-sm leading-relaxed">{x.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RESULTADOS REALES */}
      <section className="px-8 md:px-20 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-3 text-center">
          Resultados{" "}
          <span className="texto-gradiente-clara">
            reales
          </span>
        </h2>
        <p className="text-tinta-suave text-center text-sm mb-10">
          Métricas y hechos verificables de los proyectos construidos.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            {
              metric: "50+",
              label: "Pedidos procesados",
              desc: "Pisarte lleva más de 50 pedidos reales sin un solo error de pago desde su lanzamiento.",
              tag: "Ecommerce en producción",
              icon: "🛒",
              color: "from-acento/10 to-acento/5 border-acento/20",
            },
            {
              metric: "7",
              label: "Módulos en producción",
              desc: "FlowBill tiene dashboard, clientes, proyectos, kanban, facturación, reportes y portal del cliente — todos funcionales.",
              tag: "SaaS desplegado en Vercel",
              icon: "🧾",
              color: "from-acento/10 to-acento/5 border-acento/20",
            },
            {
              metric: "2",
              label: "Sistemas de auth independientes",
              desc: "FlowBill maneja autenticación simultánea para la agencia y para sus clientes en rutas completamente separadas.",
              tag: "Arquitectura avanzada",
              icon: "🔐",
              color: "from-acento/10 to-acento/5 border-acento/20",
            },
            {
              metric: "4",
              label: "Pasarelas de pago integradas",
              desc: "Mínimo Studio acepta Stripe, Wompi, PSE y Efecty — el stack de pagos más completo para e-commerce colombiano.",
              tag: "Pagos colombianos",
              icon: "💳",
              color: "from-green-500/10 to-green-500/5 border-green-500/20",
            },
            {
              metric: "Google Play",
              label: "Publicada ✓",
              desc: "ARISE Shadow System está disponible en Google Play. App RPG de fitness inspirada en Solo Leveling, construida con Flutter y Firebase.",
              tag: "App móvil Flutter",
              icon: "📱",
              color: "from-yellow-500/10 to-yellow-500/5 border-yellow-500/20",
            },
            {
              metric: "24h",
              label: "Tiempo de respuesta",
              desc: "Todos mis proyectos y propuestas tienen respuesta garantizada en menos de 24 horas hábiles.",
              tag: "Compromiso real",
              icon: "⚡",
              color: "from-orange-500/10 to-orange-500/5 border-orange-500/20",
            },
          ].map((r, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${r.color} border rounded-xl p-6 hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{r.icon}</span>
                <span className="text-[10px] font-bold text-tinta-suave bg-fondo/50 px-2 py-0.5 rounded-full">
                  {r.tag}
                </span>
              </div>
              <div className="text-3xl font-black text-tinta mb-1">{r.metric}</div>
              <div className="text-sm font-bold text-tinta mb-2">{r.label}</div>
              <p className="text-tinta-suave text-xs leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>

        {/* Nota honesta sobre testimonios */}
        <div className="bg-superficie border border-borde rounded-xl p-5 flex gap-4 items-start">
          <span className="text-xl flex-shrink-0">💬</span>
          <div>
            <p className="text-sm font-semibold text-tinta mb-1">
              ¿Buscas referencias directas?
            </p>
            <p className="text-xs text-tinta-suave leading-relaxed">
              Estoy construyendo mi base de clientes activamente. Si quieres hablar con alguien
              que haya trabajado conmigo o ver el código fuente de cualquier proyecto,{" "}
              <a href="/cotizar" className="text-acento hover:underline font-medium">
                escríbeme directamente
              </a>{" "}
              y lo coordino sin problema.
            </p>
          </div>
        </div>
      </section>

      {/* PRECIOS — moneda automática: Colombia ve COP, resto del mundo USD */}
      <SeccionPrecios />

      {/* FAQ — acordeón SEO-friendly con schema FAQPage */}
      <Faq />

      {/* CTA FINAL — tarjeta navy que conecta con el hero y el footer */}
      <section className="px-8 md:px-20 py-16 max-w-5xl mx-auto">
        <div className="superficie-navy relative border border-white/10 rounded-2xl p-10 text-center overflow-hidden text-texto-claro">
          {/* Rejilla tenue + glow decorativo */}
          <div className="rejilla-navy pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="linea-gradiente absolute top-0 left-1/2 -translate-x-1/2 w-64" aria-hidden="true" />
          <h2 className="relative text-3xl font-bold mb-3 text-texto-claro">
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="relative text-texto-claro-suave mb-8 max-w-md mx-auto text-sm">
            Cuéntame tu idea y en menos de 24 horas te doy una propuesta inicial sin compromiso.
          </p>
          <div className="relative flex gap-4 justify-center flex-wrap">
            <Link
              href="/cotizar"
              className="boton-gradiente px-8 py-3 rounded-xl font-semibold transition shadow-lg shadow-[#6366f1]/25"
            >
              Escribirme ahora →
            </Link>
            <a
              href="https://wa.me/573012821174?text=Hola%20Wilson%2C%20vi%20tu%20portafolio%20y%20me%20interesa%20hablar%20sobre%20un%20proyecto"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-white/20 rounded-xl font-semibold hover:border-white/50 hover:bg-white/5 hover:text-white transition"
            >
              💬 WhatsApp
            </a>
          </div>
          <p className="relative text-texto-claro-suave text-xs mt-5">
            O escríbeme a{" "}
            <a href="mailto:wilson.arroyo12@gmail.com" className="text-[#8ab4ff] hover:underline">
              wilson.arroyo12@gmail.com
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
