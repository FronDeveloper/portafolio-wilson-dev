import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-[#0B0B0B] text-white min-h-screen pb-24">
      <Navbar />
      <Hero />

      {/* Estadísticas rápidas */}
      <section className="px-8 md:px-20 py-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-[#C2B280]">4+</p>
            <p className="text-gray-400 text-sm">Proyectos entregados</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#C2B280]">100%</p>
            <p className="text-gray-400 text-sm">Clientes satisfechos</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#C2B280]">24h</p>
            <p className="text-gray-400 text-sm">Respuesta garantizada</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#C2B280]">Remoto</p>
            <p className="text-gray-400 text-sm">Trabajo desde Colombia</p>
          </div>
        </div>
      </section>

      {/* 💡 QUÉ HAGO */}
      <section className="px-8 md:px-20 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-10 text-[#C2B280]">
          ¿En qué puedo ayudarte?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#111] p-6 rounded-xl border border-gray-800 hover:border-[#C2B280] transition">
            <h3 className="text-xl font-semibold mb-3">Sitios Web</h3>
            <p className="text-gray-400">
              Desarrollo páginas modernas, rápidas y adaptadas a cualquier dispositivo.
            </p>
          </div>

          <div className="bg-[#111] p-6 rounded-xl border border-gray-800 hover:border-[#C2B280] transition">
            <h3 className="text-xl font-semibold mb-3">Ecommerce</h3>
            <p className="text-gray-400">
              Tiendas online optimizadas para ventas con experiencia de usuario clara.
            </p>
          </div>

          <div className="bg-[#111] p-6 rounded-xl border border-gray-800 hover:border-[#C2B280] transition">
            <h3 className="text-xl font-semibold mb-3">Aplicaciones Web</h3>
            <p className="text-gray-400">
              Desarrollo soluciones personalizadas según las necesidades de tu negocio.
            </p>
          </div>
        </div>
      </section>

      {/* 🧠 DIFERENCIAL */}
      <section className="px-8 md:px-20 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-10 text-[#C2B280]">
          ¿Por qué trabajar conmigo?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-4">
            <h3 className="font-semibold mb-2 text-lg">✅ Enfoque en resultados</h3>
            <p className="text-gray-400">
              No solo diseño, desarrollo soluciones que aportan valor real y medible.
            </p>
          </div>

          <div className="p-4">
            <h3 className="font-semibold mb-2 text-lg">✅ Comunicación clara</h3>
            <p className="text-gray-400">
              Mantengo contacto constante durante todo el desarrollo con entregas semanales.
            </p>
          </div>

          <div className="p-4">
            <h3 className="font-semibold mb-2 text-lg">✅ Soporte post-lanzamiento</h3>
            <p className="text-gray-400">
              1 mes de soporte gratuito y garantía de funcionamiento.
            </p>
          </div>
        </div>
      </section>

      {/* 🚀 PROYECTOS */}
      <Projects />

      {/* ⭐ TESTIMONIOS */}
      <Testimonials />

      {/* 💰 PRECIOS */}
      <Pricing />

      {/* 📞 CTA FINAL */}
      <section className="px-8 md:px-20 py-20 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          ¿Tienes un proyecto en mente?
        </h2>

        <p className="text-gray-400 mb-8">
          Estoy listo para ayudarte a llevar tu idea al siguiente nivel.
        </p>

        <Link
          href="/contact"
          className="bg-[#C2B280] text-black px-8 py-4 rounded-xl font-semibold hover:opacity-80 transition inline-block"
        >
          Hablemos
        </Link>
      </section>

      <Footer />
    </main>
  );
}