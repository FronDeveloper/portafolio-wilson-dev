"use client";

import { motion } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

/**
 * Hero sobre ancla navy: replica el lenguaje de las portadas de redes
 * (fondo marino con rejilla y halos, titular con gradiente azul → violeta).
 * El resto del sitio sigue en claro; este tramo oscuro es la primera ancla.
 */
export default function Hero() {
  return (
    <section className="superficie-navy relative flex flex-col md:flex-row justify-between items-center px-8 md:px-20 min-h-screen pt-16 md:pt-24 lg:pt-20 xl:pt-0 overflow-hidden text-texto-claro">

      {/* Rejilla tenue, como la de las portadas */}
      <div className="rejilla-navy pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Halos flotantes extra (muy tenues, dan profundidad) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-[#4c9fff]/[0.07] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/5 h-80 w-80 rounded-full bg-[#a78bfa]/[0.07] blur-3xl" />
      </div>

      {/* IZQUIERDA */}
      <div className="max-w-2xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center md:text-left"
        >
          {/* Badge de disponibilidad (vidrio sobre navy) */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/15 px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 text-xs font-semibold">Disponible para nuevos proyectos</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-center md:text-left"
        >
          Convierto ideas en{" "}
          <span className="relative inline-block">
            <span className="texto-gradiente">sistemas que venden</span>
            <motion.span
              className="linea-gradiente absolute bottom-0 left-0 hidden h-0.5 w-full origin-left md:block"
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
          className="mt-6 text-texto-claro-suave text-lg text-center md:text-left"
        >
          No solo programo — construyo plataformas que{" "}
          <span className="text-texto-claro font-medium">automatizan tu operación, generan ventas y eliminan el trabajo manual.</span>{" "}
          E-commerce, SaaS y dashboards a medida con Next.js y Supabase.
        </motion.p>

        {/* KPIs */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 flex gap-8 text-sm justify-center md:justify-start"
        >
          {[
            { value: "9", label: "Casos de estudio" },
            { value: "<24h", label: "Tiempo de respuesta" },
            { value: "100%", label: "Trabajo remoto" },
          ].map((k) => (
            <div key={k.label}>
              <p className="texto-gradiente text-2xl font-bold">{k.value}</p>
              <p className="text-texto-claro-suave text-xs">{k.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Botones — el primario replica el de la portada: gradiente con texto oscuro */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 flex gap-4 flex-wrap justify-center md:justify-start"
        >
          <Link
            href="/cotizar"
            className="boton-gradiente px-6 py-3 font-semibold rounded-xl transition hover:scale-105 transform shadow-lg shadow-[#6366f1]/25"
          >
            Hablemos de tu proyecto →
          </Link>
          <Link
            href="/projects"
            className="px-6 py-3 border border-white/20 rounded-xl hover:border-white/50 hover:bg-white/5 transition hover:scale-105 transform"
          >
            Ver casos de estudio
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8 text-xs text-texto-claro-suave text-center md:text-left"
        >
          {BRAND.founder} · {BRAND.founderRole} · Colombia
        </motion.p>
      </div>

      {/* REDES */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex md:flex-col gap-6 mt-10 md:mt-0 text-2xl md:items-end z-10 text-texto-claro-suave"
      >
        <a
          href="https://www.linkedin.com/in/wilson-valencia-939069408/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Perfil de LinkedIn de Wilson Valencia"
          className="hover:text-white transition hover:scale-110 transform"
        >
          <FaLinkedin aria-hidden="true" />
        </a>
        <a
          href="https://github.com/FronDeveloper"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Perfil de GitHub de Wilson Valencia"
          className="hover:text-white transition hover:scale-110 transform"
        >
          <FaGithub aria-hidden="true" />
        </a>
        <a
          href="mailto:wilson.arroyo12@gmail.com"
          aria-label="Escribir un correo a Wilson Valencia"
          className="hover:text-white transition hover:scale-110 transform"
        >
          <MdEmail aria-hidden="true" />
        </a>
      </motion.div>

    </section>
  );
}
