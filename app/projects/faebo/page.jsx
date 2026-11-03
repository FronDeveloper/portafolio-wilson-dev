import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Fundación FAEBO — Sitio institucional para fundación social",
  description:
    "Sitio web institucional para fundación social colombiana. Diseño accesible, sección de misión y visión, y canal de contacto para donantes. Proyecto real entregado al cliente.",
  keywords: [
    "sitio web fundación colombia",
    "desarrollo web fundación social",
    "página institucional ong colombia",
    "diseño web fundación html css",
  ],
  openGraph: {
    images: ["/opengraph-image"],
    title: "Fundación FAEBO — Sitio institucional social",
    description:
      "Página institucional para fundación social colombiana. Diseño claro, accesible y enfocado en generar confianza para donantes.",
    url: "/projects/faebo",
  },
  alternates: {
    canonical: "/projects/faebo",
  },
};

export default function FaeboProject() {
  return (
    <main className="min-h-screen bg-[#0D1117] text-white">
      <Navbar />

      <section className="px-8 md:px-20 py-20 max-w-4xl mx-auto">
        <Link href="/projects" className="text-sm text-gray-400 hover:text-[#C2B280] transition inline-block mb-6">
          ← Volver a proyectos
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#C2B280]">
          Fundación FAEBO
        </h1>

        <div className="relative w-full h-96 mb-10 rounded-xl overflow-hidden">
          <Image
            src="/images/faebo.jpg"
            alt="Fundación FAEBO"
            fill
            sizes="(max-width: 768px) 100vw, 1000px"
            className="object-cover object-top"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Descripción</h2>
            <p className="text-gray-400">
              Sitio web institucional desarrollado para fortalecer la presencia digital
              de la fundación y comunicar su impacto social.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Problema que resuelve</h2>
            <p className="text-gray-400">
              La fundación no contaba con una plataforma digital que transmitiera
              confianza ni facilitara la comunicación con posibles donantes.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Solución implementada</h2>
          <p className="text-gray-400">
            Diseñé y desarrollé un sitio web claro, accesible y enfocado en
            resaltar el impacto social, mejorando la visibilidad y el contacto
            con donantes y voluntarios.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Tecnologías utilizadas</h2>
          <div className="flex flex-wrap gap-2">
            {["HTML5", "CSS3", "JavaScript", "Responsive Design"].map(tech => (
              <span key={tech} className="bg-[#111] border border-gray-800 px-3 py-1 rounded-full text-sm text-gray-300">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* ⚠️ BANNER DE ADVERTENCIA - ELIMINAR CUANDO EL SITIO ESTÉ PUBLICADO */}
        <div className="bg-yellow-500/10 border border-yellow-500 p-4 rounded-lg mb-6">
          <p className="text-yellow-400 text-sm">
            ⚠️ Este sitio está actualmente en fase de despliegue. 
            El código está completado y funcionando localmente.
          </p>
        </div>

        <div className="flex gap-4 flex-wrap">
          {/* 🔁 CUANDO EL SITIO ESTÉ PUBLICADO, REEMPLAZAR href="#"" por la URL real */}
          <a
            href="#"
            className="inline-block px-6 py-3 bg-gray-700 text-gray-200 rounded-xl font-semibold cursor-not-allowed"
          >
            🚧 Próximamente disponible
          </a>
          <a
            href="https://github.com/FronDeveloper/fundacion-faebo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border border-gray-600 rounded-xl font-semibold hover:bg-white hover:text-black transition"
          >
            📦 Ver código en GitHub
          </a>
        </div>
      </section>

      {/* CTA de cierre — P1 del informe: los casos terminaban sin siguiente paso */}
      <section className="border-t border-gray-800 mt-14 pt-10 pb-16 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
          ¿Quieres un sistema así para tu empresa?
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-7">
          Cuéntame tu proceso y recibe cotización en menos de 24 horas, sin compromiso.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/cotizar"
            className="inline-block px-6 py-3 bg-[#C2B280] text-black rounded-xl font-semibold hover:opacity-80 transition"
          >
            Cotizar mi proyecto →
          </a>
          <a
            href="/contact"
            className="inline-block px-6 py-3 border border-gray-600 text-gray-300 rounded-xl font-semibold hover:bg-white/10 transition"
          >
            Escríbeme directo
          </a>
        </div>
      </section>
    </main>
  );
}
