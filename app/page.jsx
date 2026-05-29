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

      {/* HERO */}
      <Hero />

      {/* ¿EN QUÉ PUEDO AYUDARTE? */}
      <section className="px-8 md:px-20 py-16 max-w-5xl">
        <h2 className="text-3xl font-semibold mb-10 text-[#C2B280]">
          ¿En qué puedo ayudarte?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#111] p-6 rounded-xl border border-gray-800 hover:border-[#C2B280]/40 transition">
            <p className="text-3xl mb-3">🌐</p>
            <h3 className="text-xl font-semibold mb-3">Sistemas a medida</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              CRMs, dashboards, plataformas de gestión y facturación —
              software que resuelve el problema específico de tu negocio,
              no una plantilla genérica.
            </p>
          </div>
          <div className="bg-[#111] p-6 rounded-xl border border-gray-800 hover:border-[#C2B280]/40 transition">
            <p className="text-3xl mb-3">🛒</p>
            <h3 className="text-xl font-semibold mb-3">E-commerce</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tiendas online optimizadas para ventas con pasarelas de pago
              colombianas (Wompi, PSE, Efecty) y panel de administración
              incluido.
            </p>
          </div>
          <div className="bg-[#111] p-6 rounded-xl border border-gray-800 hover:border-[#C2B280]/40 transition">
            <p className="text-3xl mb-3">📱</p>
            <h3 className="text-xl font-semibold mb-3">Apps móviles</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Aplicaciones nativas para Android e iOS con Flutter — un
              solo desarrollo, dos plataformas, listas para publicar en
              las tiendas.
            </p>
          </div>
        </div>
      </section>

      {/* PROYECTOS */}
      <Projects />

      {/* CÓMO TRABAJO */}
      <HowIWork />

      {/* ¿POR QUÉ TRABAJAR CONMIGO? */}
      <section className="px-8 md:px-20 py-16 max-w-5xl">
        <h2 className="text-3xl font-semibold mb-10 text-[#C2B280]">
          ¿Por qué trabajar conmigo?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
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
            <div key={x.title} className="bg-[#111] p-6 rounded-xl border border-gray-800 hover:border-[#C2B280]/40 transition">
              <p className="text-3xl mb-3">{x.icon}</p>
              <h3 className="font-semibold mb-2">{x.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{x.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-8 md:px-20 py-16 max-w-5xl">
        <div className="bg-[#111] border border-[#C2B280]/30 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-3">
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Cuéntame tu idea y en menos de 24 horas te doy una propuesta
            inicial sin compromiso.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="px-8 py-3 bg-[#C2B280] text-black rounded-xl font-semibold hover:opacity-80 transition"
            >
              Escribirme ahora →
            </Link>
            <a
              href="https://wa.me/573012821174?text=Hola%20Wilson%2C%20vi%20tu%20portafolio%20y%20me%20interesa%20hablar%20sobre%20un%20proyecto"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-gray-700 rounded-xl font-semibold hover:border-[#C2B280] hover:text-[#C2B280] transition"
            >
              💬 WhatsApp
            </a>
          </div>
          <p className="text-gray-600 text-xs mt-6">
            También puedes escribirme a{" "}
            <a
              href="mailto:wilson.arroyo12@gmail.com"
              className="text-[#C2B280] hover:underline"
            >
              wilson.arroyo12@gmail.com
            </a>
          </p>
        </div>
      </section>

      <Footer />

    </main>
  );
}