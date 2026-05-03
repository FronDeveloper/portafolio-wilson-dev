import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function EcommerceProject() {
  return (
    <main className="bg-[#0B0B0B] text-white min-h-screen">
      <Navbar />

      <section className="px-8 md:px-20 py-20 max-w-4xl">

        {/* 🔙 BOTÓN VOLVER */}
        <Link href="/projects" className="text-sm text-gray-400 hover:text-white">
          ← Volver
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-8 text-[#C2B280]">
          Ecommerce de Calzado
        </h1>

        <Image
          src="/images/ecommerce.jpg"
          alt="Ecommerce"
          width={1200}
          height={600}
          className="rounded-xl mb-10"
        />

        <h2 className="text-2xl font-semibold mb-4">Descripción</h2>
        <p className="text-gray-400 mb-6">
          Plataforma de comercio electrónico diseñada para ofrecer una experiencia
          de compra rápida, intuitiva y optimizada para conversiones.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Problema</h2>
        <p className="text-gray-400 mb-6">
          El cliente necesitaba una solución digital para vender productos sin
          complicaciones y con un proceso de compra claro.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Solución</h2>
        <p className="text-gray-400 mb-6">
          Se desarrolló un ecommerce con navegación sencilla, carrito optimizado
          y diseño enfocado en mejorar la experiencia del usuario.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Tecnologías</h2>
        <p className="text-gray-400 mb-6">
          Next.js / Tailwind / Stripe
        </p>

        <a
          href="#"
          className="inline-block mt-6 px-6 py-3 bg-[#C2B280] text-black rounded-xl font-semibold"
        >
          Ver demo
        </a>

      </section>
    </main>
  );
}