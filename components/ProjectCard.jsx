"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({
  title,
  description,
  problem,
  solution,
  tech,
  link,
  image,
}) {
  return (
    <Link href={link}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        }}
        whileHover={{ 
        scale: 1.04,
        y: -5
        }}
        transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 15
        }}
        whileTap={{ scale: 0.98 }}
        className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden hover:border-[#C2B280] transition flex flex-col cursor-pointer"
      >
        {/* Imagen */}
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
            <span className="text-white text-sm">Ver proyecto</span>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 flex flex-col justify-between flex-1">
          <div>
            <h3 className="text-xl font-semibold text-[#C2B280]">
              {title}
            </h3>

            <p className="text-gray-400 mt-3">
              {description}
            </p>

            <div className="mt-4 text-sm text-gray-500">
              <p>
                <span className="text-white">Problema:</span> {problem}
              </p>
              <p className="mt-2">
                <span className="text-white">Solución:</span> {solution}
              </p>
            </div>

            <p className="text-xs text-gray-600 mt-4">
              {tech}
            </p>
          </div>

          <span className="mt-6 text-sm text-white underline hover:text-[#C2B280]">
            Ver proyecto →
          </span>
        </div>
      </motion.div>
    </Link>
  );
}