import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import HowIWork from "@/components/HowIWork";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-[#0B0B0B] text-white min-h-screen pb-24">

      <Navbar />
      <Hero />

      {/* ¿EN QUÉ PUEDO AYUDARTE? */}
      <section className="px-8 md:px-20 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          ¿En qué puedo{" "}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            ayudarte?
          </span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "🖥️",
              title: "Sistemas a medida",
              desc: "CRMs, dashboards, plataformas de gestión y facturación — software que resuelve el problema específico de tu negocio, no una plantilla genérica.",
              color: "hover:border-violet-500/50 hover:shadow-violet-500/10",
            },
            {
              icon: "🛒",
              title: "E-commerce",
              desc: "Tiendas online con pasarelas colombianas (Wompi, PSE, Efecty), carrito optimizado y panel de administración incluido.",
              color: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
            },
            {
              icon: "📱",
              title: "Apps móviles",
              desc: "Aplicaciones nativas para Android e iOS con Flutter — un solo desarrollo, dos plataformas, listas para publicar.",
              color: "hover:border-fuchsia-500/50 hover:shadow-fuchsia-500/10",
            },
          ].map((x) => (
            <div
              key={x.title}
              className={`bg-[#111] p-6 rounded-xl border border-gray-800 transition-all duration-300 hover:shadow-lg ${x.color}`}
            >
              <p className="text-3xl mb-3">{x.icon}</p>
              <h3 className="text-lg font-semibold mb-2 text-white">{x.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{x.desc}</p>
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
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
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
              className="bg-[#111] p-6 rounded-xl border border-gray-800 hover:border-violet-500/40 transition-all duration-300"
            >
              <p className="text-3xl mb-3">{x.icon}</p>
              <h3 className="font-semibold mb-2 text-white">{x.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{x.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="px-8 md:px-20 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-3 text-center">
          Lo que dicen mis{" "}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            clientes
          </span>
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10">
          No solo construyo código, construyo relaciones basadas en confianza y resultados.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              quote: "Tienda online funcionando con productos reales y pagos integrados. Más de 50 pedidos procesados sin errores.",
              name: "Pisarte Oficial",
              role: "Ecommerce propio · En operación",
              stars: 5,
            },
            {
              quote: "Wilson entendió nuestras necesidades y creó un sitio que refleja fielmente nuestra misión social.",
              name: "Fundación FAEBO",
              role: "Proyecto real · Cliente satisfecho",
              stars: 5,
            },
            {
              quote: "Los beta testers reportan alta motivación gracias al sistema de gamificación por niveles y recompensas.",
              name: "App RPG Fitness",
              role: "Beta cerrada · En revisión Google Play",
              stars: 5,
            },
          ].map((t, i) => (
            <div
              key={i}
              className="bg-[#111] border border-gray-800 rounded-xl p-6 hover:border-violet-500/30 transition-all duration-300"
            >
              <div className="flex gap-0.5 mb-4">
                {Array(t.stars).fill(0).map((_, j) => (
                  <span key={j} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4 italic">
                "{t.quote}"
              </p>
              <div className="border-t border-gray-800 pt-3">
                <p className="font-semibold text-white text-sm">{t.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-600 mt-6">
          ⭐ 100% de clientes recomiendan mi trabajo
        </p>
      </section>

      {/* PRECIOS */}
      <section className="px-8 md:px-20 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-3 text-center">
          Inversión{" "}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            transparente
          </span>
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10">
          Precios base orientativos. Cada proyecto se cotiza según necesidades. Sin letras pequeñas.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Landing Page",
              sub: "Ideal para empezar tu presencia online",
              price: "$300 USD",
              features: ["Diseño responsive", "Hasta 5 secciones", "Formulario de contacto", "SEO básico", "Entrega 5-7 días", "1 mes de soporte"],
              highlight: false,
            },
            {
              title: "Ecommerce",
              sub: "Vende tus productos sin complicaciones",
              price: "$800 USD",
              features: ["Catálogo de productos", "Carrito de compras", "Pasarela de pagos", "Panel de administración", "Optimización conversiones", "3 meses de soporte"],
              highlight: true,
            },
            {
              title: "App a Medida",
              sub: "Soluciones personalizadas para tu negocio",
              price: "$1500 USD",
              features: ["Desarrollo a medida", "Panel de administración", "Base de datos propia", "Integraciones personalizadas", "Despliegue incluido", "6 meses de soporte"],
              highlight: false,
            },
          ].map((plan) => (
            <div
              key={plan.title}
              className={`rounded-xl p-6 border transition-all duration-300 ${
                plan.highlight
                  ? "bg-gradient-to-b from-violet-600/10 to-cyan-600/5 border-violet-500/50 shadow-lg shadow-violet-500/10 relative"
                  : "bg-[#111] border-gray-800 hover:border-gray-600"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  RECOMENDADO
                </span>
              )}
              <h3 className="font-bold text-white text-lg mb-1">{plan.title}</h3>
              <p className="text-gray-500 text-xs mb-4">{plan.sub}</p>
              <p className="text-3xl font-extrabold mb-1">
                <span className={plan.highlight
                  ? "bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
                  : "text-white"
                }>
                  desde {plan.price}
                </span>
              </p>
              <p className="text-gray-600 text-xs mb-5">+ IVA</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-400 text-xs">
                    <span className={plan.highlight ? "text-violet-400" : "text-green-400"}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition ${
                  plan.highlight
                    ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:opacity-90"
                    : "border border-gray-700 hover:border-violet-500 hover:text-violet-400"
                }`}
              >
                Solicitar cotización
              </Link>
            </div>
          ))}
        </div>
        <p className="text-gray-600 text-xs text-center mt-4">
          * Los precios son referenciales. Plazos, complejidad e integraciones pueden modificar la cotización.
        </p>
      </section>

      {/* CTA FINAL */}
      <section className="px-8 md:px-20 py-16 max-w-5xl mx-auto">
        <div className="relative bg-gradient-to-br from-violet-600/15 via-[#111] to-cyan-600/10 border border-violet-500/30 rounded-2xl p-10 text-center overflow-hidden">
          {/* Glow decorativo */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          <h2 className="text-3xl font-bold mb-3">
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm">
            Cuéntame tu idea y en menos de 24 horas te doy una propuesta inicial sin compromiso.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-violet-500/25"
            >
              Escribirme ahora →
            </Link>
            <a
              href="https://wa.me/573012821174?text=Hola%20Wilson%2C%20vi%20tu%20portafolio%20y%20me%20interesa%20hablar%20sobre%20un%20proyecto"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-gray-700 rounded-xl font-semibold hover:border-violet-500 hover:text-violet-400 transition"
            >
              💬 WhatsApp
            </a>
          </div>
          <p className="text-gray-600 text-xs mt-5">
            O escríbeme a{" "}
            <a href="mailto:wilson.arroyo12@gmail.com" className="text-violet-400 hover:underline">
              wilson.arroyo12@gmail.com
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}