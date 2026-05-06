import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "App RPG Fitness | Wilson Dev",
  description: "Aplicación móvil gamificada que convierte el entrenamiento físico en experiencia RPG."
};

export default function RPGProject() {
  return (
    <main className="bg-[#0B0B0B] text-white min-h-screen">
      <Navbar />

      <section className="px-8 md:px-20 py-20 max-w-4xl mx-auto">
        <Link href="/projects" className="text-sm text-gray-400 hover:text-[#C2B280] transition inline-block mb-6">
          ← Volver a proyectos
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#C2B280]">
          App RPG Fitness
        </h1>

        <div className="relative w-full h-96 mb-10 rounded-xl overflow-hidden">
          <Image
            src="/images/rpg-app.jpg"
            alt="App RPG Fitness"
            fill
            className="object-cover object-top"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Descripción</h2>
            <p className="text-gray-400">
              Aplicación móvil gamificada que convierte el entrenamiento físico en
              una experiencia tipo videojuego con progresión por niveles, experiencia (XP)
              y recompensas desbloqueables.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Problema que resuelve</h2>
            <p className="text-gray-400">
              Muchos usuarios abandonan sus rutinas de ejercicio por falta de motivación
              y seguimiento visual de su progreso.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Solución implementada</h2>
          <p className="text-gray-400">
            Desarrollé una app cross-platform (iOS/Android) donde el progreso físico
            se traduce en niveles, puntos de experiencia, logros y recompensas.
            Incluye sistema de misiones diarias, ranking de amigos y recordatorios
            personalizados.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Características principales</h2>
          <ul className="text-gray-400 list-disc list-inside space-y-2">
            <li>Sistema de niveles y XP basado en entrenamientos completados</li>
            <li>Misiones diarias con recompensas especiales</li>
            <li>Gráficas de progreso y estadísticas detalladas</li>
            <li>Sincronización en la nube con Firebase</li>
            <li>Modo oscuro y personalización de avatar</li>
          </ul>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Tecnologías utilizadas</h2>
          <div className="flex flex-wrap gap-2">
            {["Flutter", "Dart", "Firebase Auth", "Firestore", "Cloud Functions"].map(tech => (
              <span key={tech} className="bg-[#111] border border-gray-800 px-3 py-1 rounded-full text-sm text-gray-300">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#111] p-6 rounded-xl border border-gray-800 mb-6">
          <h3 className="text-xl font-semibold mb-2 text-[#C2B280]">📱 Estado del proyecto</h3>
          <p className="text-gray-400 mb-2">
            La aplicación está completamente desarrollada y en proceso de publicación en Google Play Store.
          </p>
          <p className="text-yellow-400 text-sm">
            ⏳ Próximamente disponible para descarga. Mientras tanto, puedes ver el video demo:
          </p>
        </div>

        <div className="flex gap-4 flex-wrap">
          {/* 🔁 CUANDO TENGAS EL VIDEO, REEMPLAZAR href="#"" */}
          <a
            href="#"
            className="inline-block px-6 py-3 bg-[#C2B280] text-black rounded-xl font-semibold hover:opacity-80 transition"
          >
            🎥 Ver video demo
          </a>
          <a
            href="https://github.com/FronDeveloper/rpg-fitness-app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border border-gray-600 rounded-xl font-semibold hover:bg-white hover:text-black transition"
          >
            📦 Ver código en GitHub
          </a>
        </div>

        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
          <p className="text-blue-300 text-sm">
            💡 ¿Quieres probar la app antes del lanzamiento oficial? 
            Escríbeme y te enviaré el APK de prueba.
          </p>
        </div>
      </section>
    </main>
  );
}