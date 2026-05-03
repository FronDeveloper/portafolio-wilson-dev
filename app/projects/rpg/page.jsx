import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function RPGProject() {
  return (
    <main className="bg-[#0B0B0B] text-white min-h-screen">
      <Navbar />

      <section className="px-8 md:px-20 py-20 max-w-4xl">

        <Link href="/projects" className="text-sm text-gray-400 hover:text-white">
          ← Volver
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-8 text-[#C2B280]">
          App RPG Fitness
        </h1>

        <Image
          src="/images/rpg-app.jpg"
          alt="App RPG Fitness"
          width={1200}
          height={600}
          className="rounded-xl mb-10"
        />

        <h2 className="text-2xl font-semibold mb-4">Descripción</h2>
        <p className="text-gray-400 mb-6">
          Aplicación móvil gamificada que convierte el entrenamiento físico en
          una experiencia tipo videojuego con progresión por niveles.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Problema</h2>
        <p className="text-gray-400 mb-6">
          Muchos usuarios abandonan sus rutinas por falta de motivación y seguimiento.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Solución</h2>
        <p className="text-gray-400 mb-6">
          Se desarrolló una app donde el progreso físico se traduce en niveles,
          recompensas y objetivos, incentivando la constancia del usuario.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Tecnologías</h2>
        <p className="text-gray-400 mb-6">
          Flutter / Firebase
        </p>

      </section>
    </main>
  );
}