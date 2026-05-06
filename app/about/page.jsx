"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaReact, FaNodeJs, FaDatabase, FaMobileAlt } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiFlutter, SiFirebase } from "react-icons/si";

export default function AboutPage() {
  const skills = [
    { name: "React/Next.js", icon: <FaReact />, color: "#61DAFB" },
    { name: "Tailwind CSS", icon: <SiTailwindcss />, color: "#06B6D4" },
    { name: "Node.js", icon: <FaNodeJs />, color: "#339933" },
    { name: "MongoDB", icon: <FaDatabase />, color: "#47A248" },
    { name: "Flutter", icon: <SiFlutter />, color: "#02569B" },
    { name: "Firebase", icon: <SiFirebase />, color: "#FFCA28" },
    { name: "Apps Móviles", icon: <FaMobileAlt />, color: "#C2B280" },
    { name: "Next.js", icon: <SiNextdotjs />, color: "#FFFFFF" },
  ];

  return (
    <main className="bg-[#0B0B0B] text-white min-h-screen">
      <Navbar />

      <section className="px-8 md:px-20 py-24">
        <div className="max-w-6xl mx-auto">
          
          {/* Grid principal */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* Columna izquierda - Foto y datos */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border border-[#C2B280]/30 shadow-lg mx-auto md:mx-0">
                <Image
                  src="/profile.jpg"
                  alt="Wilson Valencia"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Contacto rápido */}
              <div className="bg-[#111] p-6 rounded-xl border border-gray-800">
                <h3 className="text-lg font-semibold mb-4 text-[#C2B280]">Contacto directo</h3>
                <div className="space-y-2 text-gray-400">
                  <p>📍 Medellín, Colombia</p>
                  <p>💻 Trabajo remoto global</p>
                  <p>📧 wilson.arroyo12@gmail.com</p>
                  <p>📱 +57 301 2821174</p>
                </div>
                <a
                  href="/contact"
                  className="inline-block mt-4 w-full text-center px-4 py-2 bg-[#C2B280] text-black font-semibold rounded-xl hover:opacity-80 transition"
                >
                  Contáctame
                </a>
              </div>
            </motion.div>

            {/* Columna derecha - Texto y habilidades */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-3xl md:text-4xl font-bold">
                Sobre <span className="text-[#C2B280]">mí</span>
              </h1>

              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Soy desarrollador web y móvil con experiencia en la creación de 
                  soluciones digitales completas que resuelven problemas reales. 
                  No solo escribo código, construyo productos que generan valor.
                </p>

                <p>
                  Mi enfoque combina diseño atractivo, rendimiento optimizado y 
                  funcionalidades bien pensadas. Cada proyecto que entrego está 
                  pensado para cumplir objetivos de negocio específicos.
                </p>

                <p>
                  Trabajo con tecnologías modernas como React, Next.js, Flutter 
                  y Firebase, adaptándome a las necesidades específicas de cada 
                  cliente. Actualmente colaboro de forma remota con empresas y 
                  emprendedores que buscan calidad y compromiso.
                </p>
              </div>

              {/* Principios */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                  <p className="text-[#C2B280] text-xl font-bold">100%</p>
                  <p className="text-gray-400 text-sm">Compromiso</p>
                </div>
                <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                  <p className="text-[#C2B280] text-xl font-bold">24h</p>
                  <p className="text-gray-400 text-sm">Respuesta garantizada</p>
                </div>
                <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                  <p className="text-[#C2B280] text-xl font-bold">30d</p>
                  <p className="text-gray-400 text-sm">Soporte post-lanzamiento</p>
                </div>
                <div className="bg-[#111] p-3 rounded-lg border border-gray-800">
                  <p className="text-[#C2B280] text-xl font-bold">Remote</p>
                  <p className="text-gray-400 text-sm">Trabajo global</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sección de habilidades técnicas */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-20"
          >
            <h2 className="text-2xl font-semibold mb-8 text-center">
              Tecnologías que <span className="text-[#C2B280]">domino</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-[#111] p-4 rounded-xl border border-gray-800 hover:border-[#C2B280] transition text-center group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition" style={{ color: skill.color }}>
                    {skill.icon}
                  </div>
                  <p className="text-xs text-gray-400">{skill.name}</p>
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
            <p className="text-gray-400 mb-4">
              ¿Tienes un proyecto en mente o quieres saber más sobre mi trabajo?
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-[#C2B280] text-black font-semibold rounded-xl hover:opacity-80 transition"
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