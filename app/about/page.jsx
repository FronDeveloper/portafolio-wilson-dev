"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaReact, FaNodeJs, FaDatabase, FaMobileAlt,
} from "react-icons/fa";
import {
  SiNextdotjs, SiTailwindcss, SiFlutter,
  SiFirebase, SiSupabase, SiTypescript, SiPostgresql,
} from "react-icons/si";

export default function AboutPage() {
  // CAMBIO 3: Supabase, TypeScript y PostgreSQL agregados
  // CAMBIO 4: perfil humanizado
  const skills = [
    // Los colores de marca se oscurecen cuando el original no alcanza a leerse
    // sobre blanco (Next.js era blanco puro, React y Tailwind eran casi neón).
    { name: "Next.js",      icon: <SiNextdotjs />,    color: "#0F294E" },
    { name: "TypeScript",   icon: <SiTypescript />,   color: "#3178C6" },
    { name: "React",        icon: <FaReact />,         color: "#087EA4" },
    { name: "Supabase",     icon: <SiSupabase />,      color: "#059669" },
    { name: "PostgreSQL",   icon: <SiPostgresql />,    color: "#336791" },
    { name: "Tailwind CSS", icon: <SiTailwindcss />,   color: "#0891B2" },
    { name: "Node.js",      icon: <FaNodeJs />,        color: "#339933" },
    { name: "Flutter",      icon: <SiFlutter />,       color: "#02569B" },
    { name: "Firebase",     icon: <SiFirebase />,      color: "#D97706" },
    { name: "MongoDB",      icon: <FaDatabase />,      color: "#47A248" },
    { name: "Apps Móviles", icon: <FaMobileAlt />,     color: "#1D4ED8" },
  ];

  return (
    <main className="text-tinta min-h-screen">
      <Navbar />

      <section className="px-8 md:px-20 py-24">
        <div className="max-w-6xl mx-auto">

          {/* Grid principal */}
          <div className="grid md:grid-cols-2 gap-12 items-start">

            {/* Columna izquierda */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border border-acento/30 shadow-lg mx-auto md:mx-0">
                <Image
                  src="/profile.jpg"
                  alt="Wilson Valencia"
                  fill
                  sizes="(max-width: 768px) 256px, 320px"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="bg-superficie p-6 rounded-xl border border-borde">
                <h3 className="text-lg font-semibold mb-4 text-acento">Contacto directo</h3>
                <div className="space-y-2 text-tinta-suave">
                  <p>📍 Medellín, Colombia</p>
                  <p>💻 Trabajo remoto global</p>
                  <p>📧 wilson.arroyo12@gmail.com</p>
                  <p>📱 +57 301 2821174</p>
                </div>
                <a
                  href="/cotizar"
                  className="inline-block mt-4 w-full text-center px-4 py-2 bg-acento text-white font-semibold rounded-xl hover:opacity-80 transition"
                >
                  Contáctame
                </a>
              </div>
            </motion.div>

            {/* Columna derecha */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-3xl md:text-4xl font-bold">
                Sobre <span className="text-acento">mí</span>
              </h1>

              {/* CAMBIO 4: párrafo humanizado */}
              <div className="space-y-4 text-tinta-suave leading-relaxed">
                <p>
                  Soy Wilson Valencia, desarrollador full-stack con base en
                  Medellín, Colombia. Me dedico a construir aplicaciones web
                  que resuelven problemas reales de negocio — desde sistemas
                  de gestión empresarial hasta e-commerce y dashboards con
                  inteligencia artificial.
                </p>

                <p>
                  Empecé en el desarrollo por curiosidad gracias a un amigo que me mostró este mundo, y me quedé porque
                  me apasiona el momento en que una idea se convierte en algo
                  que la gente realmente usa. Trabajo principalmente con
                  Next.js, TypeScript y Supabase, aunque lo que más me
                  interesa no es el stack sino entender el problema antes de
                  escribir la primera línea de código.
                </p>

                <p>
                  Ofrezco servicios de desarrollo freelance a empresas y
                  personas que necesitan software a medida — no plantillas.
                  Si tienes un proyecto en mente, me interesa escucharlo.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-superficie p-3 rounded-lg border border-borde">
                  <p className="text-acento text-xl font-bold">7+</p>
                  <p className="text-tinta-suave text-sm">Proyectos</p>
                </div>
                <div className="bg-superficie p-3 rounded-lg border border-borde">
                  <p className="text-acento text-xl font-bold">24h</p>
                  <p className="text-tinta-suave text-sm">Respuesta garantizada</p>
                </div>
                <div className="bg-superficie p-3 rounded-lg border border-borde">
                  <p className="text-acento text-xl font-bold">30d</p>
                  <p className="text-tinta-suave text-sm">Soporte post-lanzamiento</p>
                </div>
                <div className="bg-superficie p-3 rounded-lg border border-borde">
                  <p className="text-acento text-xl font-bold">Remote</p>
                  <p className="text-tinta-suave text-sm">Trabajo global</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tecnologías — CAMBIO 3: stack ampliado */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-20"
          >
            <h2 className="text-2xl font-semibold mb-8 text-center">
              Tecnologías que <span className="text-acento">domino</span>
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-superficie p-4 rounded-xl border border-borde hover:border-acento transition text-center group"
                >
                  <div
                    className="text-3xl mb-2 group-hover:scale-110 transition flex justify-center"
                    style={{ color: skill.color }}
                    aria-hidden="true"
                  >
                    {skill.icon}
                  </div>
                  <p className="text-xs text-tinta-suave">{skill.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA final */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center"
          >
            <p className="text-tinta-suave mb-4">
              ¿Tienes un proyecto en mente o quieres saber más sobre mi trabajo?
            </p>
            <a
              href="/cotizar"
              className="inline-block px-8 py-3 bg-acento text-white font-semibold rounded-xl hover:opacity-80 transition"
            >
              Hablemos de tu proyecto
            </a>
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}