"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="flex flex-col justify-center items-start px-8 md:px-20 h-[80vh]">
      
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold leading-tight"
      >
        Desarrollador Web <br />
        <span className="text-[#C2B280]">que convierte ideas en productos reales</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-6 text-gray-400 max-w-xl"
      >
        Creo sitios web modernos, ecommerce y aplicaciones móviles
        optimizadas para rendimiento, diseño y resultados reales.
      </motion.p>

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
    </section>
  );
}