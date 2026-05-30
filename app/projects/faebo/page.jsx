import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Fundación FAEBO — Sitio institucional para fundación social | Wilson Valencia Dev",
  description:
    "Sitio web institucional para fundación social colombiana. Diseño accesible, sección de misión y visión, y canal de contacto para donantes. Proyecto real entregado al cliente.",
  keywords: [
    "sitio web fundación colombia",
    "desarrollo web fundación social",
    "página institucional ong colombia",
    "diseño web fundación html css",
  ],
  openGraph: {
    title: "Fundación FAEBO — Sitio institucional social | Wilson Valencia",
    description:
      "Página institucional para fundación social colombiana. Diseño claro, accesible y enfocado en generar confianza para donantes.",
    url: "https://wvalencia-dev.vercel.app/projects/faebo",
  },
  alternates: {
    canonical: "https://wvalencia-dev.vercel.app/projects/faebo",
  },
};

export default function FaeboProject() {
  return (
    <main className="bg-[#0B0B0B] text-white min-h-screen">
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
            className="inline-block px-6 py-3 bg-gray-700 text-gray-400 rounded-xl font-semibold cursor-not-allowed"
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
    </main>
  );
}