"use client";

/**
 * PropuestaForm — formulario "Solicitar propuesta personalizada"
 * ============================================================
 * Se abre desde el chat de Alma cuando el lead ya fue capturado.
 * - Prellenado con lo que el cliente ya contó (nombre + detalle)
 * - POST /api/propuesta → Groq redacta → el borrador va SOLO al
 *   email de Wilson para su aprobación (nunca se envía solo)
 * - El cliente solo ve: "Wilson está preparando tu propuesta"
 * ============================================================
 */

import { useState } from "react";
import { FaTimes, FaFeatherAlt, FaCheckCircle, FaExclamationTriangle, FaWhatsapp } from "react-icons/fa";
import { trackMetaEvent } from "@/lib/analytics/meta-events";
import { PROYECTO_LABELS, PRESUPUESTO_LABELS } from "@/lib/catalogo";

const WILSON_WA = "573012821174";

export default function PropuestaForm({ lead, historial, onClose }) {
  const [nombre, setNombre] = useState(lead?.nombre || "");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("otro");
  const [presupuesto, setPresupuesto] = useState("no-definido");
  const [detalles, setDetalles] = useState(lead?.detalle || "");
  const [estado, setEstado] = useState("form"); // form | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const enviar = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    if (!whatsapp.trim() && !email.trim()) {
      setErrorMsg("Déjame al menos un WhatsApp o un correo para enviarte la propuesta 🙏");
      return;
    }

    setEstado("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/propuesta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          whatsapp: whatsapp.trim(),
          email: email.trim(),
          tipo,
          presupuesto,
          detalles: detalles.trim(),
          historial: (historial || []).slice(-10),
        }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setEstado("success");
        trackMetaEvent("Lead", {
          content_name: "propuesta_solicitada",
          content_category: "Propuesta IA",
          status: "propuesta_generada",
          source: "alma_chat",
        });
      } else {
        setErrorMsg(data?.error || "Algo salió mal. Escríbele a Wilson por WhatsApp y te responde rápido.");
        setEstado("error");
      }
    } catch {
      setErrorMsg("No pude conectar con el servidor. Verifica tu internet e intenta de nuevo.");
      setEstado("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0B0B0B] border border-[#333] rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="sticky top-0 bg-[#0B0B0B]/95 backdrop-blur border-b border-[#222] px-6 pt-5 pb-4 flex items-start justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C2B280]/15 border border-[#C2B280]/40 flex items-center justify-center text-[#C2B280]">
              <FaFeatherAlt />
            </div>
            <div>
              <h3 className="text-white font-bold leading-tight">Solicita tu propuesta</h3>
              <p className="text-gray-500 text-xs">Wilson la prepara con sus precios reales y la envía por WhatsApp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-gray-500 hover:text-white transition p-1"
          >
            <FaTimes />
          </button>
        </div>

        <div className="px-6 py-6">
          {/* ---------- ESTADO: FORMULARIO ---------- */}
          {estado === "form" && (
            <form onSubmit={enviar} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs mb-1.5">Tu nombre *</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  maxLength={80}
                  placeholder="Ej: Andrea Gómez"
                  className="w-full bg-[#111] border border-[#333] focus:border-[#C2B280] rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs mb-1.5">
                  Tu WhatsApp * <span className="text-gray-600">(aquí recibirás la propuesta)</span>
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  maxLength={25}
                  placeholder="Ej: 301 234 5678"
                  className="w-full bg-[#111] border border-[#333] focus:border-[#C2B280] rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs mb-1.5">
                  Tu correo <span className="text-gray-600">(opcional, si prefieres email)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={120}
                  placeholder="tu@correo.com"
                  className="w-full bg-[#111] border border-[#333] focus:border-[#C2B280] rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs mb-1.5">Tipo de proyecto</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full bg-[#111] border border-[#333] focus:border-[#C2B280] rounded-lg px-3 py-3 text-sm text-white outline-none transition-colors"
                  >
                    {Object.entries(PROYECTO_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1.5">Presupuesto</label>
                  <select
                    value={presupuesto}
                    onChange={(e) => setPresupuesto(e.target.value)}
                    className="w-full bg-[#111] border border-[#333] focus:border-[#C2B280] rounded-lg px-3 py-3 text-sm text-white outline-none transition-colors"
                  >
                    {Object.entries(PRESUPUESTO_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs mb-1.5">
                  Cuéntame tu proyecto
                </label>
                <textarea
                  value={detalles}
                  onChange={(e) => setDetalles(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  placeholder="Ej: Tengo una marca de ropa y quiero vender por internet…"
                  className="w-full bg-[#111] border border-[#333] focus:border-[#C2B280] rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors resize-none"
                />
              </div>

              {errorMsg && (
                <p className="text-red-400 text-xs flex items-center gap-2">
                  <FaExclamationTriangle /> {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-[#C2B280] hover:bg-[#d4c69a] text-black font-bold py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-2"
              >
                <FaFeatherAlt /> Enviar mi solicitud ✨
              </button>

              <p className="text-gray-600 text-[11px] text-center leading-relaxed">
                Wilson revisa tu solicitud personalmente y te envía la propuesta
                por WhatsApp. Tu información solo se usa para cotizar, nunca se
                comparte.
              </p>
            </form>
          )}

          {/* ---------- ESTADO: CARGANDO ---------- */}
          {estado === "loading" && (
            <div className="text-center py-10">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full border-2 border-[#333] border-t-[#C2B280] animate-spin" />
              <p className="text-white font-semibold mb-2">Alma está preparando tu solicitud…</p>
              <p className="text-gray-500 text-xs">
                Está revisando tu proyecto y los servicios de Wilson.
                <br />
                Toma entre 10 y 20 segundos 🕊
              </p>
            </div>
          )}

          {/* ---------- ESTADO: ÉXITO ---------- */}
          {estado === "success" && (
            <div className="text-center py-8">
              <FaCheckCircle className="text-green-400 text-5xl mx-auto mb-5" />
              <h4 className="text-white font-bold text-lg mb-2">¡Propuesta en camino!</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Wilson recibió tu solicitud y está preparando tu propuesta personalizada.
                <br />
                <span className="text-[#C2B280]">
                  Te escribirá por WhatsApp muy pronto 🚀
                </span>
              </p>
              <button
                onClick={onClose}
                className="bg-[#C2B280] hover:bg-[#d4c69a] text-black font-semibold text-sm py-3 px-8 rounded-xl transition"
              >
                Entendido, listo ✅
              </button>
            </div>
          )}

          {/* ---------- ESTADO: ERROR ---------- */}
          {estado === "error" && (
            <div className="text-center py-8">
              <FaExclamationTriangle className="text-[#C2B280] text-5xl mx-auto mb-5" />
              <h4 className="text-white font-bold text-lg mb-2">Uy, algo salió mal</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{errorMsg}</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setEstado("form")}
                  className="bg-[#C2B280] hover:bg-[#d4c69a] text-black font-bold py-3 rounded-xl transition text-sm"
                >
                  Intentar de nuevo
                </button>
                <a
                  href={`https://wa.me/${WILSON_WA}?text=${encodeURIComponent(
                    "Hola Wilson! Quiero una propuesta para mi proyecto 😊"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-[#333] hover:border-[#25D366] text-gray-300 font-semibold py-3 rounded-xl transition text-sm"
                >
                  <FaWhatsapp className="text-[#25D366]" /> Pedirla por WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
