"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaDownload, FaCheckCircle } from "react-icons/fa";

export default function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(false);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-8 md:px-20 py-20 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative bg-gradient-to-br from-[#C2B280]/8 to-[#C2B280]/2 border border-[#C2B280]/20 rounded-2xl p-8 md:p-12 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C2B280]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          {/* Izquierda */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#C2B280]/10 border border-[#C2B280]/30 px-3 py-1 rounded-full mb-4">
              <FaDownload className="text-[#C2B280] text-xs" />
              <span className="text-[#C2B280] text-xs font-semibold">GRATIS</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Guía: Cómo construir un{" "}
              <span className="text-[#C2B280]">SaaS multi-tenant</span>
            </h2>

            <p className="text-gray-400 text-sm mb-4">
              Te enseño la misma arquitectura que uso en mis proyectos:
              autenticación, base de datos multi-tenant, billing y deployment.
              Sin teoría, solo código real.
            </p>

            <ul className="text-gray-500 text-sm space-y-1 mb-6">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-[#C2B280] text-xs" />
                Schema multi-tenant con Supabase
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-[#C2B280] text-xs" />
                Auth con roles y permisos
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-[#C2B280] text-xs" />
                Estructura de proyecto lista para producción
              </li>
            </ul>
          </div>

          {/* Derecha — Formulario */}
          <div>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-gray-400 text-sm mb-2">
                  Descarga gratis. Sin spam.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  disabled={loading}
                  className="w-full bg-[#0B0B0B] border border-gray-800 p-3 rounded-xl text-white text-sm outline-none focus:border-[#C2B280] transition disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C2B280] text-black py-3 rounded-xl font-semibold text-sm hover:opacity-80 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Enviando..." : (
                    <>
                      <FaDownload /> Descargar guía
                    </>
                  )}
                </button>
                {error && (
                  <p className="text-red-400 text-xs text-center">
                    Error al enviar. Intenta de nuevo o escríbeme a wilson.arroyo12@gmail.com
                  </p>
                )}
                <p className="text-gray-600 text-[10px] text-center">
                  Te enviaré la guía + 1 email con tips. Puedes darte de baja cuando quieras.
                </p>
              </form>
            ) : (
              <div className="text-center py-8">
                <FaCheckCircle className="text-[#C2B280] text-4xl mb-3 mx-auto" />
                <p className="text-white font-semibold mb-2">¡Revisa tu email!</p>
                <p className="text-gray-400 text-sm">
                  Te enviamos la guía a <span className="text-[#C2B280]">{email}</span>.<br />
                  Si no la encuentras, revisa spam.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}