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
    <section className="relative flex flex-col md:flex-row justify-between items-center px-8 md:px-20 min-h-screen pt-16 md:pt-24 lg:pt-20 xl:pt-0">

      {/* IZQUIERDA */}
      <div className="max-w-xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center md:text-left"
        >
          <p className="text-xl md:text-2xl font-bold text-white">
            Wilson Valencia
          </p>
          {/* CAMBIO 2: especialización más específica */}
          <p className="text-sm md:text-base text-gray-400 mt-1 tracking-wide">
            Desarrollador Full-Stack · Next.js · TypeScript · Supabase
          </p>
        </motion.div>

        {/* CAMBIO 2: headline más específico */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`${playfair.className} text-4xl md:text-6xl font-bold leading-tight`}
        >
          Aplicaciones web <br />
          <span className="text-[#C2B280] relative inline-block">
            a medida para tu negocio
            <motion.span
              className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C2B280]"
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
          Desarrollo sistemas de gestión, e-commerce y dashboards
          con Next.js y Supabase — no plantillas, soluciones reales.
        </motion.p>

        {/* CAMBIO 1: contador actualizado a 7 proyectos */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 flex gap-6 text-sm"
        >
          <div>
            <p className="text-2xl font-bold text-[#C2B280]">7+</p>
            <p className="text-gray-500">Proyectos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#C2B280]">100%</p>
            <p className="text-gray-500">Compromiso</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#C2B280]">24h</p>
            <p className="text-gray-500">Respuesta</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 flex gap-4 flex-wrap"
        >
          <a
            href="/projects"
            className="px-6 py-3 bg-[#C2B280] text-black font-semibold rounded-xl hover:opacity-80 transition hover:scale-105 transform"
          >
            Ver proyectos
          </a>
          <a
            href="/contact"
            className="px-6 py-3 border border-gray-600 rounded-xl hover:bg-white hover:text-black transition hover:scale-105 transform"
          >
            Contáctame
          </a>
        </motion.div>
      </div>

      {/* DERECHA (REDES) */}
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
          className="hover:text-[#C2B280] transition hover:scale-110 transform"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://github.com/FronDeveloper"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#C2B280] transition hover:scale-110 transform"
        >
          <FaGithub />
        </a>
        <a
          href="mailto:wilson.arroyo12@gmail.com"
          className="hover:text-[#C2B280] transition hover:scale-110 transform"
        >
          <MdEmail />
        </a>
      </motion.div>

    </section>
  );
}