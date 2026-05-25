import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Mínimo Studio | Wilson Dev",
  description: "Tienda de ropa minimalista con carrito de compras, autenticación y pasarela de pago."
};

export default function MinimoStudioProject() {
  return (
    <main className="bg-[#0B0B0B] text-white min-h-screen">
      <Navbar />

      <section className="px-8 md:px-20 py-20 max-w-4xl mx-auto">
        <Link href="/projects" className="text-sm text-gray-400 hover:text-[#C2B280] transition inline-block mb-6">
          ← Volver a proyectos
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#C2B280]">
          Mínimo Studio
        </h1>

        <div className="relative w-full h-96 mb-10 rounded-xl overflow-hidden bg-[#111] flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">👕</p>
            <p className="text-sm">Imagen del proyecto</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Descripción</h2>
            <p className="text-gray-400">
              Tienda de ropa minimalista con sistema completo de e-commerce. Incluye catálogo de productos,
              carrito de compras persistente, autenticación de usuarios y pasarela de pagos.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Problema que resuelve</h2>
            <p className="text-gray-400">
              Necesidad de una plataforma de comercio electrónico moderna para vender ropa con diseño minimalista.
              Se requería gestión de inventario, autenticación de usuarios y procesamiento de pagos seguros.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Solución implementada</h2>
          <p className="text-gray-400">
            Desarrollé un e-commerce completo con Next.js 16, Prisma ORM y PostgreSQL. El sistema incluye
            autenticación con NextAuth, gestión de carrito con React Context, integración con Stripe para pagos,
            y panel de administración para gestionar productos y pedidos.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Tecnologías utilizadas</h2>
          <div className="flex flex-wrap gap-2">
            {["Next.js 16", "Prisma", "PostgreSQL", "Stripe", "NextAuth", "Tailwind CSS", "React", "TypeScript"].map(tech => (
              <span key={tech} className="bg-[#111] border border-gray-800 px-3 py-1 rounded-full text-sm text-gray-300">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#111] p-6 rounded-xl border border-gray-800 mb-6">
          <h3 className="text-xl font-semibold mb-2 text-[#C2B280]">📊 Resultados</h3>
          <p className="text-gray-400">
            • Sistema de autenticación completo con roles (admin/cliente)<br />
            • Gestión de productos con categorías e imágenes<br />
            • Carrito de compras persistente con localStorage<br />
            • Pasarela de pagos integrada con Stripe<br />
            • Panel de administración para gestión de pedidos<br />
            • Diseño responsive optimizado para móviles
          </p>
        </div>

        <div className="flex gap-4 flex-wrap">
          <a
            href="https://github.com/FronDeveloper/minimo-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#C2B280] text-black rounded-xl font-semibold hover:opacity-80 transition"
          >
            📦 Ver código en GitHub
          </a>
        </div>
      </section>
    </main>
  );
}
