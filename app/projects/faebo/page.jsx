import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function FaeboProject() {
  return (
    <main className="bg-[#0B0B0B] text-white min-h-screen">
      <Navbar />

      <section className="px-8 md:px-20 py-20 max-w-4xl">

        <Link href="/projects" className="text-sm text-gray-400 hover:text-white">
          ← Volver
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-8 text-[#C2B280]">
          Fundación FAEBO
        </h1>

        <Image
          src="/images/faebo.jpg"
          alt="FAEBO"
          width={1200}
          height={600}
          className="rounded-xl mb-10"
        />

        <h2 className="text-2xl font-semibold mb-4">Descripción</h2>
        <p className="text-gray-400 mb-6">
          Sitio web institucional desarrollado para fortalecer la presencia digital
          de la fundación y comunicar su impacto social.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Problema</h2>
        <p className="text-gray-400 mb-6">
          La fundación no contaba con una plataforma digital que transmitiera
          confianza ni facilitara la comunicación con posibles donantes.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Solución</h2>
        <p className="text-gray-400 mb-6">
          Se diseñó y desarrolló un sitio web claro, accesible y enfocado en
          resaltar el impacto social, mejorando la visibilidad y el contacto.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Tecnologías</h2>
        <p className="text-gray-400 mb-6">
          HTML / CSS / JavaScript
        </p>

      </section>
    </main>
  );
}