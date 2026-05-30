import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Pisarte — Ecommerce de calzado en producción | Wilson Valencia Dev",
  description:
    "Tienda online de calzado real con más de 50 pedidos procesados. Flujo de compra optimizado, pasarela de pago integrada y diseño moderno. Construida con Next.js.",
  keywords: [
    "ecommerce calzado colombia",
    "tienda online calzado next.js",
    "pisarte ecommerce",
    "desarrollo ecommerce colombia producción",
  ],
  openGraph: {
    title: "Pisarte — Ecommerce de calzado en producción | Wilson Valencia",
    description:
      "Tienda online real de calzado con 50+ pedidos procesados. Pasarela de pago, catálogo y diseño optimizado para conversiones. Construida con Next.js.",
    url: "https://wvalencia-dev.vercel.app/projects/ecommerce",
  },
  alternates: {
    canonical: "https://wvalencia-dev.vercel.app/projects/ecommerce",
  },
};

export default function EcommerceProject() {
  return (
    <main className="bg-[#0B0B0B] text-white min-h-screen">
      <Navbar />

      <section className="px-8 md:px-20 py-20 max-w-4xl mx-auto">
        <Link href="/projects" className="text-sm text-gray-400 hover:text-[#C2B280] transition inline-block mb-6">
          ← Volver a proyectos
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#C2B280]">
          Ecommerce de Calzado
        </h1>

        <div className="relative w-full h-96 mb-10 rounded-xl overflow-hidden">
          <Image
            src="/images/ecommerce.jpg"
            alt="Ecommerce PisarteOficial"
            fill
            className="object-cover object-top"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Descripción</h2>
            <p className="text-gray-400">
              Tienda online real con productos físicos, carrito de compras y pasarela de pago integrada.
              Actualmente en funcionamiento con clientes reales.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Problema que resuelve</h2>
            <p className="text-gray-400">
              El cliente necesitaba vender sus productos de calzado en línea sin complicaciones técnicas.
              Se requería un sistema de inventario simple y pagos seguros.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Solución implementada</h2>
          <p className="text-gray-400">
            Desarrollé un ecommerce completo con Next.js, Tailwind CSS y pasarela de pago.
            El sitio permite navegación por categorías, filtro de productos, carrito persistente
            y checkout optimizado para móviles.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Tecnologías utilizadas</h2>
          <div className="flex flex-wrap gap-2">
            {["Next.js", "Tailwind CSS", "Stripe", "MongoDB", "Vercel"].map(tech => (
              <span key={tech} className="bg-[#111] border border-gray-800 px-3 py-1 rounded-full text-sm text-gray-300">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#111] p-6 rounded-xl border border-gray-800 mb-6">
          <h3 className="text-xl font-semibold mb-2 text-[#C2B280]">📊 Resultados</h3>
          <p className="text-gray-400">
            • Sitio 100% funcional con productos reales<br />
            • Procesamiento de pagos seguro<br />
            • Diseño responsive optimizado para móviles<br />
            • Tiempo de carga menor a 2 segundos
          </p>
        </div>

        <div className="flex gap-4 flex-wrap">
          <a
            href="https://pisarteoficial.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#C2B280] text-black rounded-xl font-semibold hover:opacity-80 transition"
          >
            🌐 Ver sitio en vivo →
          </a>
          <a
            href="https://github.com/FronDeveloper/ecommerce-pisarte"
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