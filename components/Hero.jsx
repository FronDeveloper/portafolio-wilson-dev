"use client";

import { motion } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default function Hero() {
  return (
    <section className="relative flex flex-col md:flex-row justify-between items-center px-8 md:px-20 min-h-screen pt-16 md:pt-24 lg:pt-20 xl:pt-0 overflow-hidden">

      {/* Fondo con glow gradiente */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl" />
      </div>

      {/* IZQUIERDA */}
      <div className="max-w-xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center md:text-left"
        >
          {/* Badge de disponibilidad */}
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold">Disponible para nuevos proyectos</span>
          </div>

          <p className="text-xl md:text-2xl font-bold text-white block">
            Wilson Valencia
          </p>
          <p className="text-sm md:text-base text-gray-400 mt-1 tracking-wide">
            Desarrollador Full-Stack · Next.js · TypeScript · Supabase
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`${playfair.className} text-4xl md:text-6xl font-bold leading-tight`}
        >
          Convierto ideas en{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              sistemas que venden
            </span>
            <motion.span
              className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-violet-400 to-cyan-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-gray-400 text-lg"
        >
          No solo programo — construyo plataformas que{" "}
          <span className="text-white font-medium">automatizan tu operación, generan ventas y eliminan el trabajo manual.</span>{" "}
          E-commerce, SaaS y dashboards a medida con Next.js y Supabase.
        </motion.p>

        {/* KPIs — más específicos y orientados a resultados */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 flex gap-8 text-sm"
        >
          {[
            { value: "7+", label: "Proyectos en producción" },
            { value: "500+", label: "Usuarios activos" },
            { value: "<24h", label: "Tiempo de respuesta" },
          ].map((k) => (
            <div key={k.label}>
              <p className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                {k.value}
              </p>
              <p className="text-gray-500 text-xs">{k.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Botones — más orientados a acción */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 flex gap-4 flex-wrap"
        >
          <a
            href="/projects"
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold rounded-xl hover:opacity-90 transition hover:scale-105 transform shadow-lg shadow-violet-500/25"
          >
            Ver casos de estudio
          </a>
          <a
            href="/contact"
            className="px-6 py-3 border border-gray-600 rounded-xl hover:border-violet-500 hover:text-violet-400 transition hover:scale-105 transform"
          >
            Cotizar mi proyecto
          </a>
        </motion.div>
      </div>

      {/* REDES */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex md:flex-col gap-6 mt-10 md:mt-0 text-2xl md:items-end z-10"
      >
        <a
          href="https://www.linkedin.com/in/wilson-valencia-939069408/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-violet-400 transition hover:scale-110 transform"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://github.com/FronDeveloper"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-violet-400 transition hover:scale-110 transform"
        >
          <FaGithub />
        </a>
        <a
          href="mailto:wilson.arroyo12@gmail.com"
          className="hover:text-cyan-400 transition hover:scale-110 transform"
        >
          <MdEmail />
        </a>
      </motion.div>

    </section>
  );
}