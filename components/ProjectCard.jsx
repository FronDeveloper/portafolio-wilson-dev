"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";

export default function ProjectCard({
  title,
  description,
  problem,
  solution,
  tech,
  link,
  image,
  status = "completado",
  liveUrl = null,
  metrics = [],
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden hover:border-[#C2B280] transition flex flex-col"
    >
      <Link href={link}>
        <div className="relative w-full h-48 overflow-hidden cursor-pointer">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
          {status === "proximamente" && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-yellow-400 text-sm font-semibold px-2 py-1 rounded">Próximamente</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
            <span className="text-white text-sm">Ver caso de estudio</span>
          </div>
        </div>
      </Link>

      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-xl font-semibold text-[#C2B280]">
            {title}
          </h3>

          <p className="text-gray-400 mt-3 text-sm">
            {description}
          </p>

          {/* Métricas / Resultados */}
          {metrics.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="bg-[#0B0B0B] border border-gray-800 rounded-lg p-2 text-center"
                >
                  <p className="text-[#C2B280] font-bold text-lg leading-tight">
                    {metric.value}
                  </p>
                  <p className="text-gray-500 text-[10px] leading-tight mt-1">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 text-sm text-gray-500">
            <p>
              <span className="text-white font-medium">Problema:</span> {problem}
            </p>
            <p className="mt-2">
              <span className="text-white font-medium">Solución:</span> {solution}
            </p>
          </div>

          <div className="flex flex-wrap gap-1 mt-4">
            {tech.split(" / ").map((t, idx) => (
              <span key={idx} className="text-xs text-gray-600 bg-gray-900 px-2 py-1 rounded">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#C2B280] hover:underline inline-flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              Ver en vivo <FaArrowRight className="text-[10px]" />
            </a>
          )}
          <Link href={link} className="text-sm text-white hover:text-[#C2B280] underline inline-flex items-center gap-1">
            Caso de estudio <FaArrowRight className="text-[10px]" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}