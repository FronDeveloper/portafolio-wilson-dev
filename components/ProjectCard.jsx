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
  headingLevel = "h3",
}) {
  const CardTitle = headingLevel;
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="bg-superficie border border-borde rounded-2xl overflow-hidden hover:border-acento transition flex flex-col"
    >
      <Link href={link}>
        <div className="relative w-full h-48 overflow-hidden cursor-pointer">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
          {status === "proximamente" && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-amber-700 text-sm font-semibold px-2 py-1 rounded">Próximamente</span>
            </div>
          )}
          <div className="absolute inset-0 bg-tinta/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
            <span className="text-tinta text-sm">Ver caso de estudio</span>
          </div>
        </div>
      </Link>

      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <CardTitle className="text-xl font-semibold text-acento">
            {title}
          </CardTitle>

          <p className="text-tinta-suave mt-3 text-sm">
            {description}
          </p>

          {/* Métricas / Resultados */}
          {metrics.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-1.5 sm:gap-2">
              {metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="min-w-0 bg-fondo border border-borde rounded-lg p-2 text-center"
                >
                  <p className="text-acento font-bold text-base sm:text-lg leading-tight break-words">
                    {metric.value}
                  </p>
                  <p className="text-tinta-suave text-[10px] leading-tight mt-1 break-words">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 text-sm text-tinta-suave">
            <p>
              <span className="text-tinta font-medium">Problema:</span> {problem}
            </p>
            <p className="mt-2">
              <span className="text-tinta font-medium">Solución:</span> {solution}
            </p>
          </div>

          <div className="flex flex-wrap gap-1 mt-4">
            {tech.split(" / ").map((t, idx) => (
              <span key={idx} className="text-xs text-tinta bg-fondo px-2 py-1 rounded">
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
              className="text-sm text-acento hover:underline inline-flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              Ver en vivo <FaArrowRight className="text-[10px]" />
            </a>
          )}
          <Link href={link} className="text-sm text-tinta hover:text-acento underline inline-flex items-center gap-1">
            Caso de estudio <FaArrowRight className="text-[10px]" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
