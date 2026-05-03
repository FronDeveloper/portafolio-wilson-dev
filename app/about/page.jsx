import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <main className="bg-[#0B0B0B] text-white min-h-screen">
      <Navbar />

      <section className="px-8 md:px-20 py-20 max-w-4xl">
        
        <h1 className="text-4xl md:text-5xl font-bold mb-10">
          Sobre mí
        </h1>

        {/* Intro */}
        <p className="text-gray-400 mb-6">
          Soy desarrollador web y móvil enfocado en crear productos digitales
          funcionales, modernos y orientados a resultados reales.
        </p>

        <p className="text-gray-400 mb-6">
          Trabajo con tecnologías como Next.js y Flutter para construir
          soluciones que no solo se ven bien, sino que también funcionan
          de forma eficiente y escalable.
        </p>

        {/* Qué hago */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-[#C2B280]">
          Qué hago
        </h2>

        <ul className="text-gray-400 space-y-3">
          <li>• Desarrollo de sitios web modernos</li>
          <li>• Creación de ecommerce listos para vender</li>
          <li>• Aplicaciones móviles con Flutter</li>
          <li>• Optimización de rendimiento y experiencia de usuario</li>
        </ul>

        {/* Cómo trabajo */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-[#C2B280]">
          Cómo trabajo
        </h2>

        <p className="text-gray-400 mb-6">
          Me enfoco en entender el objetivo del proyecto antes de escribir
          una sola línea de código. Cada solución está pensada para ser clara,
          funcional y alineada con las necesidades del cliente.
        </p>

        <p className="text-gray-400 mb-6">
          Priorizo la comunicación, la simplicidad y la entrega de valor
          real en cada proyecto.
        </p>

        {/* Diferenciador */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-[#C2B280]">
          Mi enfoque
        </h2>

        <p className="text-gray-400 mb-6">
          No solo desarrollo interfaces, construyo herramientas que ayudan
          a las personas y negocios a crecer en el entorno digital.
        </p>

        {/* CTA */}
        <div className="mt-12">
          <a
            href="/contact"
            className="px-6 py-3 bg-[#C2B280] text-black font-semibold rounded-xl hover:opacity-80 transition"
          >
            Trabajemos juntos
          </a>
        </div>

      </section>
      <Footer />
    </main>
  );
}