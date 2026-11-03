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
  etiquetaPresupuesto,
  fechaBogota,
} from "@/lib/catalogo";
import { BRAND } from "@/lib/brand";
import { SITE_HOST, SITE_URL } from "@/lib/pricing";

const WILSON_WA = "573012821174";

export default function PropuestaReview({ payload, token }) {
  const [texto, setTexto] = useState(payload.p);
  const [copiado, setCopiado] = useState(false);
  const [aprobada, setAprobada] = useState(false);
  const [descartando, setDescartando] = useState(false);
  const [descartada, setDescartada] = useState(false);
  const [errorDescarte, setErrorDescarte] = useState("");

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

  const descartar = async () => {
    if (
      !window.confirm(
        "¿Descartar esta propuesta? No se enviará nada al cliente."
      )
    ) {
      return;
    }

    setDescartando(true);
    setErrorDescarte("");

    try {
      const res = await fetch("/api/propuesta/descartar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ t: token }),
      });

      if (!res.ok) throw new Error("No se pudo registrar el descarte");

      setDescartada(true);
    } catch {
      setErrorDescarte(
        "No se pudo registrar el descarte. Revisa tu conexión e intenta de nuevo."
      );
    } finally {
      setDescartando(false);
    }
  };

  const contactoCliente = payload.e ? payload.e : null;

  if (descartada) {
    return (
      <div className="max-w-xl mx-auto text-center">
        <div className="text-5xl mb-4" aria-hidden="true">
          🗑️
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-tinta mb-3">
          Propuesta descartada
        </h1>
        <p className="text-tinta text-sm leading-relaxed mb-6">
          No se envió nada a {payload.n || "el cliente"}. Puedes cerrar esta
          pestaña.
        </p>
        <p className="text-tinta-suave text-xs leading-relaxed mb-8">
          Las propuestas no se almacenan en una base de datos: el borrador vive
          dentro del enlace firmado, así que este enlace seguirá abriéndolo hasta
          que expire. Simplemente no lo compartas.
        </p>
        <a
          href={SITE_URL}
          className="inline-block bg-acento hover:bg-acento-hover text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
        >
          Volver al portafolio
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-superficie border border-borde rounded-full px-4 py-1.5 text-xs text-tinta-suave mb-4">
          🔒 Panel privado — solo tú tienes este enlace
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-tinta mb-2">
          Revisa tu <span className="text-acento">propuesta</span>
        </h1>
        <p className="text-tinta-suave text-sm">
          Generada por Alma el {fechaBogota(payload.ts)} · expira el {expiracion}
        </p>
      </div>

      {/* Datos del cliente */}
      <div className="bg-superficie border border-borde rounded-xl p-6 mb-6">
        <h2 className="text-tinta font-semibold mb-4 text-sm uppercase tracking-wider">
          👤 Cliente
        </h2>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <span className="text-tinta-suave">Nombre:</span>{" "}
            <span className="text-tinta font-medium">{payload.n}</span>
          </div>
          <div>
            <span className="text-tinta-suave">Proyecto:</span>{" "}
            <span className="text-tinta">{PROYECTO_LABELS[payload.t] || payload.t || "—"}</span>
          </div>
          <div>
            <span className="text-tinta-suave">Presupuesto:</span>{" "}
            <span className="text-tinta">{etiquetaPresupuesto(payload.b)}</span>
          </div>
          <div>
            <span className="text-tinta-suave">Origen del borrador:</span>{" "}
            <span className="text-acento">{payload.m === "ia" ? "IA" : "Plantilla"}</span>
          </div>
          {clienteWa ? (
            <div>
              <span className="text-tinta-suave">WhatsApp:</span>{" "}
              <a
                href={`https://wa.me/${clienteWa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 hover:underline"
              >
                +{clienteWa} <FaExternalLinkAlt className="inline text-[10px]" />
              </a>
            </div>
          ) : null}
          {contactoCliente ? (
            <div>
              <span className="text-tinta-suave">Email:</span>{" "}
              <a href={`mailto:${contactoCliente}`} className="text-acento hover:underline">
                {contactoCliente}
              </a>
            </div>
          ) : null}
        </div>
        {payload.d ? (
          <p className="text-tinta-suave text-sm leading-relaxed mt-4 pt-4 border-t border-borde whitespace-pre-wrap">
            <span className="text-acento font-semibold">Necesidad: </span>
            {payload.d}
          </p>
        ) : null}
      </div>

      {/* Editor del borrador */}
      <div className="bg-superficie border border-borde rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-tinta font-semibold text-sm uppercase tracking-wider">
            📄 Borrador (editable)
          </h2>
          <span className="text-tinta-suave text-xs">{texto.length} caracteres</span>
        </div>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={16}
          aria-label="Borrador de la propuesta (editable)"
          className="w-full bg-fondo border border-borde focus:border-acento rounded-lg p-4 text-tinta text-sm leading-relaxed resize-y outline-none transition-colors"
          placeholder="Escribe o ajusta la propuesta…"
        />
        <p className="text-tinta-suave text-xs mt-2">
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
          className="flex items-center justify-center gap-2 border border-borde-fuerte hover:border-acento text-tinta hover:text-acento font-semibold py-4 px-6 rounded-xl transition text-sm"
        >
          {copiado ? <FaCheck className="text-green-700" /> : <FaCopy />}
          {copiado ? "¡Copiado!" : "Copiar texto"}
        </button>
        <button
          onClick={descartar}
          disabled={descartando}
          className="flex items-center justify-center gap-2 border border-borde-fuerte hover:border-red-500 text-tinta-suave hover:text-red-700 font-semibold py-4 px-6 rounded-xl transition text-sm disabled:opacity-50"
        >
          <FaTrash />
          Descartar
        </button>
      </div>

      {aprobada && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 text-center">
          <p className="text-green-700 text-sm font-semibold mb-1">
            ✅ WhatsApp abierto — ¡propuesta aprobada!
          </p>
          <p className="text-tinta-suave text-xs leading-relaxed">
            Recuerda pulsar <b className="text-tinta">Enviar</b> en la app de WhatsApp para que el
            cliente la reciba. Te enviamos un correo con el archivo de esta propuesta.
          </p>
        </div>
      )}

      {!tieneWa && (
        <div className="bg-acento-suave border border-acento/25 rounded-xl p-5 mb-6">
          <p className="text-acento text-xs leading-relaxed">
            ⚠️ El cliente no dejó número de WhatsApp. El botón abrirá tu chat con el texto listo
            para que tú lo reenvíes por el canal de tu preferencia (usa "Copiar texto" para pegarlo
            donde quieras).
          </p>
        </div>
      )}

      {/* Pie */}
      {errorDescarte && (
        <p className="text-red-700 text-xs text-center mb-6" role="alert">
          {errorDescarte}
        </p>
      )}

      <p className="text-center text-tinta-suave text-xs mt-8">
        {BRAND.name} · Fase 2 — Propuestas con aprobación ·{" "}
        <a
          href={SITE_URL}
          className="text-acento/60 hover:text-acento"
        >
          {SITE_HOST}
        </a>
      </p>
    </div>
  );
}
