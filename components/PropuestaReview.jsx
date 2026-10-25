"use client";

/**
 * PropuestaReview — panel privado de aprobación (solo Wilson)
 * ============================================================
 * - Muestra el borrador firmado, EDITABLE (textarea)
 * - "Enviar por WhatsApp": abre wa.me al cliente con el texto
 *   actual y deja constancia vía /api/propuesta/aprobada
 * - "Copiar texto": respaldo por si prefiere otro canal
 * - "Descartar": con confirmación, llama a /api/propuesta/descartar
 * ============================================================
 */

import { useMemo, useState } from "react";
import { FaWhatsapp, FaCopy, FaCheck, FaTrash, FaExternalLinkAlt } from "react-icons/fa";
import {
  PROYECTO_LABELS,
  PRESUPUESTO_LABELS,
  fechaBogota,
} from "@/lib/catalogo";

const WILSON_WA = "573012821174";

export default function PropuestaReview({ payload, token }) {
  const [texto, setTexto] = useState(payload.p);
  const [copiado, setCopiado] = useState(false);
  const [aprobada, setAprobada] = useState(false);
  const [descartando, setDescartando] = useState(false);

  const clienteWa = payload.w || "";
  const tieneWa = clienteWa.length >= 10;

  const expiracion = useMemo(() => fechaBogota(payload.exp), [payload.exp]);

  const notificarAprobada = () => {
    // Fire-and-forget: deja el registro en el email de Wilson
    fetch("/api/propuesta/aprobada", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ t: token }),
    }).catch(() => {});
  };

  const abrirWhatsApp = () => {
    const mensajeFinal = texto.trim();
    const url = tieneWa
      ? `https://wa.me/${clienteWa}?text=${encodeURIComponent(mensajeFinal)}`
      : `https://wa.me/${WILSON_WA}?text=${encodeURIComponent(
          "Wilson, necesito enviar una propuesta pero al cliente le falta el número de WhatsApp:\n\n" + mensajeFinal
        )}`;
    notificarAprobada();
    setAprobada(true);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const copiarTexto = async () => {
    try {
      await navigator.clipboard.writeText(texto.trim());
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Fallback para navegadores sin Clipboard API
      const ta = document.createElement("textarea");
      ta.value = texto.trim();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  const descartar = () => {
    if (
      window.confirm(
        "¿Descartar esta propuesta? No se enviará nada al cliente y el enlace dejará de funcionar."
      )
    ) {
      setDescartando(true);
      window.location.href = `/api/propuesta/descartar?t=${token}`;
    }
  };

  const contactoCliente = payload.e ? payload.e : null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-[#111] border border-[#333] rounded-full px-4 py-1.5 text-xs text-gray-400 mb-4">
          🔒 Panel privado — solo tú tienes este enlace
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Revisa tu <span className="text-[#C2B280]">propuesta</span>
        </h1>
        <p className="text-gray-400 text-sm">
          Generada por Alma el {fechaBogota(payload.ts)} · expira el {expiracion}
        </p>
      </div>

      {/* Datos del cliente */}
      <div className="bg-[#111] border border-[#333] rounded-xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
          👤 Cliente
        </h2>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <span className="text-gray-500">Nombre:</span>{" "}
            <span className="text-white font-medium">{payload.n}</span>
          </div>
          <div>
            <span className="text-gray-500">Proyecto:</span>{" "}
            <span className="text-white">{PROYECTO_LABELS[payload.t] || payload.t || "—"}</span>
          </div>
          <div>
            <span className="text-gray-500">Presupuesto:</span>{" "}
            <span className="text-white">{PRESUPUESTO_LABELS[payload.b] || payload.b || "—"}</span>
          </div>
          <div>
            <span className="text-gray-500">Origen del borrador:</span>{" "}
            <span className="text-[#C2B280]">{payload.m === "ia" ? "IA (Groq)" : "Plantilla"}</span>
          </div>
          {clienteWa ? (
            <div>
              <span className="text-gray-500">WhatsApp:</span>{" "}
              <a
                href={`https://wa.me/${clienteWa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:underline"
              >
                +{clienteWa} <FaExternalLinkAlt className="inline text-[10px]" />
              </a>
            </div>
          ) : null}
          {contactoCliente ? (
            <div>
              <span className="text-gray-500">Email:</span>{" "}
              <a href={`mailto:${contactoCliente}`} className="text-[#C2B280] hover:underline">
                {contactoCliente}
              </a>
            </div>
          ) : null}
        </div>
        {payload.d ? (
          <p className="text-gray-400 text-sm leading-relaxed mt-4 pt-4 border-t border-[#222] whitespace-pre-wrap">
            <span className="text-[#C2B280] font-semibold">Necesidad: </span>
            {payload.d}
          </p>
        ) : null}
      </div>

      {/* Editor del borrador */}
      <div className="bg-[#111] border border-[#333] rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">
            📄 Borrador (editable)
          </h2>
          <span className="text-gray-500 text-xs">{texto.length} caracteres</span>
        </div>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={16}
          className="w-full bg-[#0B0B0B] border border-[#222] focus:border-[#C2B280] rounded-lg p-4 text-gray-200 text-sm leading-relaxed resize-y outline-none transition-colors"
          placeholder="Escribe o ajusta la propuesta…"
        />
        <p className="text-gray-500 text-xs mt-2">
          💡 Ajusta precios, plazos o cualquier frase antes de enviar. Este texto exacto es el que
          verá tu cliente.
        </p>
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={abrirWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fb857] text-black font-bold py-4 px-6 rounded-xl transition text-sm md:text-base"
        >
          <FaWhatsapp className="text-xl" />
          {tieneWa ? "Enviar por WhatsApp" : "Abrir WhatsApp (falta número)"}
        </button>
        <button
          onClick={copiarTexto}
          className="flex items-center justify-center gap-2 border border-[#444] hover:border-[#C2B280] text-gray-300 hover:text-[#C2B280] font-semibold py-4 px-6 rounded-xl transition text-sm"
        >
          {copiado ? <FaCheck className="text-green-400" /> : <FaCopy />}
          {copiado ? "¡Copiado!" : "Copiar texto"}
        </button>
        <button
          onClick={descartar}
          disabled={descartando}
          className="flex items-center justify-center gap-2 border border-[#444] hover:border-red-500 text-gray-500 hover:text-red-400 font-semibold py-4 px-6 rounded-xl transition text-sm disabled:opacity-50"
        >
          <FaTrash />
          Descartar
        </button>
      </div>

      {aprobada && (
        <div className="bg-[#0d2013] border border-[#25D366]/40 rounded-xl p-5 mb-6 text-center">
          <p className="text-green-300 text-sm font-semibold mb-1">
            ✅ WhatsApp abierto — ¡propuesta aprobada!
          </p>
          <p className="text-gray-400 text-xs leading-relaxed">
            Recuerda pulsar <b className="text-white">Enviar</b> en la app de WhatsApp para que el
            cliente la reciba. Te enviamos un correo con el archivo de esta propuesta.
          </p>
        </div>
      )}

      {!tieneWa && (
        <div className="bg-[#231d0d] border border-[#C2B280]/30 rounded-xl p-5 mb-6">
          <p className="text-[#C2B280] text-xs leading-relaxed">
            ⚠️ El cliente no dejó número de WhatsApp. El botón abrirá tu chat con el texto listo
            para que tú lo reenvíes por el canal de tu preferencia (usa "Copiar texto" para pegarlo
            donde quieras).
          </p>
        </div>
      )}

      {/* Pie */}
      <p className="text-center text-gray-600 text-xs mt-8">
        Wilson Valencia Dev · Fase 2 — Propuestas con aprobación ·{" "}
        <a
          href="https://wvalencia-dev.vercel.app"
          className="text-[#C2B280]/60 hover:text-[#C2B280]"
        >
          wvalencia-dev.vercel.app
        </a>
      </p>
    </div>
  );
}
