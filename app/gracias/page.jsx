"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FaCheckCircle, FaWhatsapp, FaArrowRight } from "react-icons/fa";
import { trackMetaEvent } from "@/lib/analytics/meta-events";

export default function GraciasPage() {
  useEffect(() => {
    trackMetaEvent("Lead", {
      content_name: "Solicitud de cotización completada",
      content_category: "Portafolio Lead",
      value: 500,
      currency: "USD",
      status: "completed",
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 mb-6">
            <FaCheckCircle className="text-green-400 text-5xl" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          ¡Gracias por tu{" "}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            solicitud!
          </span>
        </h1>

        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Recibí tu mensaje y te voy a responder en menos de{" "}
          <span className="text-white font-semibold">24 horas hábiles</span> con una propuesta inicial.
        </p>

        <div className="bg-gradient-to-br from-[#111] to-[#0F0F0F] border border-gray-800 rounded-2xl p-8 mb-8 text-left">
          <h2 className="text-white font-semibold mb-4 text-center">¿Qué sigue ahora?</h2>
          <ol className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold">1</span>
              <span>Reviso tu solicitud y te respondo por email con una propuesta inicial (precio + alcance + tiempo).</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold">2</span>
              <span>Si te interesa, agendamos una llamada de 30 min para detallar el proyecto.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold">3</span>
              <span>Firmamos contrato y arrancamos. Pago por hitos: 50% inicio, 50% entrega.</span>
            </li>
          </ol>
        </div>

        <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 mb-6">
          <p className="text-sm text-gray-400 mb-3">
            ¿Necesitas una respuesta más rápida?
          </p>
          <a
            href="https://wa.me/573012821174?text=Hola%20Wilson%2C%20acabo%20de%20enviar%20mi%20solicitud%20de%20cotizaci%C3%B3n%20desde%20tu%20portafolio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-black px-6 py-3 rounded-xl font-semibold text-sm hover:bg-green-400 transition"
          >
            <FaWhatsapp className="text-lg" /> Escríbeme por WhatsApp ahora
          </a>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition"
        >
          Volver al portafolio <FaArrowRight />
        </Link>
      </div>
    </main>
  );
}
