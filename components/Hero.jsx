"use client";

import { motion } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Background from "@/components/Background";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row justify-between items-center px-8 md:px-20 h-[80vh]">
      
      {/* IZQUIERDA */}
      <div className="max-w-xl">

        {/* NOMBRE */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg md:text-xl font-semibold text-[#C2B280] mb-3 tracking-wide"
        >
          Wilson Valencia — Web Developer
        </motion.p>

        {/* TITULO */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`${playfair.className} text-4xl md:text-6xl font-bold leading-tight`}
        >
          Desarrollador Web <br />
          <span className="text-[#C2B280]">
            que convierte ideas en productos reales
          </span>
        </motion.h1>

        {/* DESCRIPCIÓN */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-gray-400"
        >
          Creo sitios web modernos, ecommerce y aplicaciones móviles
          optimizadas para rendimiento, diseño y resultados reales.
        </motion.p>

        {/* BOTONES */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 flex gap-4"
        >
          <a
            href="/projects"
            className="px-6 py-3 bg-[#C2B280] text-black font-semibold rounded-xl hover:opacity-80 transition"
          >
            Ver proyectos
          </a>

          <a
            href="/contact"
            className="px-6 py-3 border border-gray-600 rounded-xl hover:bg-white hover:text-black transition"
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
        className="flex md:flex-col gap-6 mt-10 md:mt-0 text-2xl md:items-end"
      >
        <a
          href="https://www.linkedin.com/in/wilson-valencia-939069408/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#C2B280] transition"
        >
          <FaLinkedin />
        </a>

        <a
          href="https://github.com/FronDeveloper"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#C2B280] transition"
        >
          <FaGithub />
        </a>

        <a
          href="mailto:wilson.arroyo12@gmail.com"
          className="hover:text-[#C2B280] transition"
        >
          <MdEmail />
        </a>
      </motion.div>

    </section>
  );
}