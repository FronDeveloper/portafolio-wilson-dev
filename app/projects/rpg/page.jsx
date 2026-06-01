import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "ARISE — App RPG de entrenamiento publicada en Google Play | Wilson Valencia Dev",
  description:
    "App móvil que convierte el entrenamiento físico en un RPG. Sistema de niveles, misiones diarias y recompensas por cada entreno. Desarrollada con Flutter y Firebase. Disponible en Google Play.",
  keywords: [
    "app fitness gamificada flutter",
    "aplicación entrenamiento rpg android",
    "flutter firebase app colombia",
    "desarrollo app móvil colombia",
    "gamificación fitness app google play",
    "arise shadow system app",
    "solo leveling fitness app",
  ],
  openGraph: {
    title: "ARISE — App RPG de entrenamiento en Google Play | Wilson Valencia",
    description:
      "App que convierte tu entrenamiento en un RPG al estilo Solo Leveling. Construida con Flutter y Firebase. Disponible en Google Play.",
    url: "https://wvalencia-dev.vercel.app/projects/rpg",
  },
  alternates: {
    canonical: "https://wvalencia-dev.vercel.app/projects/rpg",
  },
};

const tech = ["Flutter", "Dart", "Firebase Auth", "Firestore", "Cloud Functions"];

const features = [
  { icon: "⚔️", title: "Sistema de niveles y XP",        desc: "Cada entrenamiento completado otorga puntos de experiencia y sube el nivel de tu personaje — igual que en un RPG." },
  { icon: "🎯", title: "Misiones diarias",                desc: "Retos diarios con recompensas especiales que incentivan la constancia y el progreso progresivo." },
  { icon: "📊", title: "Estadísticas y progreso",         desc: "Gráficas detalladas de rendimiento: fuerza, agilidad, resistencia y más — todo medido y visualizado." },
  { icon: "☁️", title: "Sincronización en la nube",       desc: "Progreso guardado en Firebase en tiempo real. Cambias de dispositivo y tu personaje sigue exactamente donde lo dejaste." },
  { icon: "🎮", title: "Personalización de personaje",    desc: "Avatar personalizable que evoluciona visualmente conforme subes de nivel y desbloqueas logros." },
  { icon: "📱", title: "Android e iOS",                   desc: "Un solo desarrollo en Flutter que funciona nativamente en ambas plataformas sin comprometer rendimiento." },
];

export default function RPGProject() {
  return (
    <main className="bg-[#0B0B0B] text-white min-h-screen">
      <Navbar />

      <section className="px-8 md:px-20 py-20 max-w-4xl mx-auto">
        <Link
          href="/projects"
          className="text-sm text-gray-400 hover:text-violet-400 transition inline-block mb-6"
        >
          ← Volver a proyectos
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            ARISE
          </h1>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs font-bold bg-green-900/50 text-green-400 border border-green-700 px-3 py-1 rounded-full">
              ✓ En Google Play
            </span>
            <span className="text-xs font-bold bg-purple-900/50 text-purple-400 border border-purple-700 px-3 py-1 rounded-full">
              Flutter · Firebase
            </span>
          </div>
        </div>

        <p className="text-gray-400 text-lg mb-10">
          Shadow System — La app que convierte tu entrenamiento físico en un RPG al estilo Solo Leveling.
        </p>

        {/* Hero image */}
        <div className="relative w-full h-72 md:h-96 mb-8 rounded-2xl overflow-hidden border border-purple-900/40">
          <Image
            src="/images/rpg-app.jpg"
            alt="ARISE — App RPG de entrenamiento"
            fill
            className="object-cover object-top"
          />
          {/* Overlay glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-60" />
        </div>

        {/* Google Play CTA — destacado */}
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-700/50 rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-green-400 font-bold text-lg mb-1">
              🎉 ¡Disponible en Google Play!
            </p>
            <p className="text-gray-400 text-sm">
              Descarga ARISE gratis y comienza tu entrenamiento RPG hoy.
            </p>
          </div>
          <a
            href="https://play.google.com/store/apps/details?id=com.arisesystem.arise_app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-green-900/30"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.18 23.76c.3.17.64.22.98.14l12.07-6.97-2.79-2.79-10.26 9.62zm-1.9-20.7A1.99 1.99 0 001 4.5v15c0 .45.14.87.38 1.21l.09.1 8.4-8.4v-.2L1.28 3.06zm18.54 8.24l-2.72-1.57-3.06 3.06 3.06 3.06 2.74-1.58c.78-.45.78-1.52-.02-1.97zM4.16.28L16.23 7.1 13.44 9.9 3.18.28a1.24 1.24 0 00-.98.13L4.16.28z"/>
            </svg>
            Descargar en Google Play
          </a>
        </div>

        {/* Problem / Solution */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#111] border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-3 text-white">🔴 El problema</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              La mayoría de apps de fitness fallan en retener usuarios porque se basan solo 
              en disciplina — no hay progresión visual, no hay recompensas, no hay razón 
              emocional para volver mañana.
            </p>
          </div>
          <div className="bg-[#111] border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-3 text-white">🟢 La solución</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              ARISE convierte cada entreno en progreso de personaje RPG. Ver tu nivel subir, 
              desbloquear habilidades y completar misiones activa los mismos mecanismos de 
              motivación que los videojuegos — aplicados al entrenamiento real.
            </p>
          </div>
        </div>

        {/* Features grid */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Funcionalidades</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-[#111] border border-gray-800 rounded-xl p-5 hover:border-violet-500/40 transition-all"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-xl">{f.icon}</span>
                  <h3 className="font-semibold text-sm text-white">{f.title}</h3>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Stack técnico</h2>
          <div className="flex flex-wrap gap-2">
            {tech.map((t) => (
              <span
                key={t}
                className="bg-[#111] border border-gray-800 px-3 py-1.5 rounded-full text-sm text-gray-300 hover:border-violet-500/50 transition"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Solo Leveling inspiration */}
        <div className="bg-gradient-to-br from-purple-900/20 to-violet-900/10 border border-purple-800/40 rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-semibold mb-2 text-purple-300">
            🎌 Inspiración: Solo Leveling
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            ARISE está inspirada en el universo de Solo Leveling — donde el protagonista 
            comienza como el cazador más débil y a través de entrenamiento constante se 
            convierte en el más poderoso. La misma narrativa aplicada a tu progreso físico real: 
            tú eres el protagonista, cada entreno es una misión, cada semana eres más fuerte.
          </p>
        </div>

        {/* Results */}
        <div className="bg-[#111] border border-gray-800 rounded-xl p-6 mb-10">
          <h3 className="text-lg font-semibold mb-4 text-violet-400">📊 Logros del proyecto</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-400">
            {[
              "Publicada en Google Play Store",
              "Disponible para Android globalmente",
              "Un solo codebase para Android e iOS (Flutter)",
              "Sincronización en tiempo real con Firebase",
              "Sistema de gamificación completo con XP y niveles",
              "Misiones diarias y sistema de recompensas",
            ].map((r) => (
              <p key={r} className="flex items-center gap-2">
                <span className="text-green-400">✓</span> {r}
              </p>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-4 flex-wrap">
          <a
            href="https://play.google.com/store/apps/details?id=com.arisesystem.arise_app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-violet-500/20"
          >
            📱 Descargar en Google Play →
          </a>
          <a
            href="https://github.com/FronDeveloper/rpg-fitness-app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border border-gray-700 rounded-xl font-semibold hover:border-violet-500 hover:text-violet-400 transition"
          >
            📦 Ver código en GitHub
          </a>
        </div>

      </section>
    </main>
  );
}