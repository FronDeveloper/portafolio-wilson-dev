"use client";

/**
 * PropuestaForm — formulario "Solicitar propuesta personalizada"
 * ============================================================
 * Se abre desde el chat de Alma con los datos ya capturados.
 * - POST /api/propuesta → la IA redacta → el borrador va SOLO al
 *   email de Wilson para su aprobación (nunca se envía solo)
 * - Requiere consentimiento de tratamiento de datos
 * ============================================================
 */

import { useState } from "react";
import Link from "next/link";
import {
  FaTimes,
  FaFeatherAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaWhatsapp,
} from "react-icons/fa";
import {
  trackMetaCustomEvent,
  getAttribution,
} from "@/lib/analytics/meta-events";
import { PRESUPUESTOS, TIPOS_PROYECTO } from "@/lib/pricing";

const WILSON_WA = "573012821174";

function contactoInicial(contacto = "") {
  if (contacto.includes("@")) {
    return { email: contacto, whatsapp: "" };
  }
  return { email: "", whatsapp: contacto };
}

function presupuestoInicial(valor = "") {
  if (!valor) return "no-definido";
  const porId = PRESUPUESTOS.find((p) => p.id === valor);
  if (porId) return porId.id;
  const porLabel = PRESUPUESTOS.find((p) => p.label === valor);
  return porLabel?.id || "no-definido";
}

export default function PropuestaForm({ lead, historial, onClose }) {
  const inicio = contactoInicial(lead?.contacto);

  const [nombre, setNombre] = useState(lead?.nombre || "");
  const [whatsapp, setWhatsapp] = useState(inicio.whatsapp);
  const [email, setEmail] = useState(inicio.email);
  const [tipo, setTipo] = useState("otro");
  const [presupuesto, setPresupuesto] = useState(
    presupuestoInicial(lead?.presupuesto)
  );
  const [detalles, setDetalles] = useState(lead?.detalle || "");
  const [consent, setConsent] = useState(false);
  const [estado, setEstado] = useState("form"); // form | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const enviar = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    if (!whatsapp.trim() && !email.trim()) {
      setErrorMsg("Déjame al menos un WhatsApp o un correo para enviarte la propuesta 🙏");
      return;
    }
    if (!consent) {
      setErrorMsg("Necesito tu autorización para tratar los datos de tu solicitud.");
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
          consent: true,
          origen: getAttribution(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setEstado("success");
        trackMetaCustomEvent("PropuestaSolicitada", {
          content_name: "propuesta_solicitada",
          content_category: "Propuesta IA",
          source: "alma_chat",
        });
      } else {
        setErrorMsg(
          data?.error ||
            "Algo salió mal. Escríbele a Wilson por WhatsApp y te responde rápido."
        );
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="propuesta-titulo"
        className="relative w-full max-w-md bg-[#0B0B0B] border border-[#333] rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="sticky top-0 bg-[#0B0B0B]/95 backdrop-blur border-b border-[#222] px-6 pt-5 pb-4 flex items-start justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C2B280]/15 border border-[#C2B280]/40 flex items-center justify-center text-[#C2B280]">
              <FaFeatherAlt aria-hidden="true" />
            </div>
            <div>
              <h3 id="propuesta-titulo" className="text-white font-bold leading-tight">
                Solicita tu propuesta
              </h3>
              <p className="text-gray-400 text-xs">
                Wilson la prepara y te la envía por WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar formulario de propuesta"
            className="text-gray-400 hover:text-white transition p-1"
          >
            <FaTimes />
          </button>
        </div>

        <div className="px-6 py-6">
          {estado === "form" && (
            <form onSubmit={enviar} className="space-y-4">
              <div>
                <label htmlFor="prop-nombre" className="block text-gray-300 text-xs mb-1.5">
                  Tu nombre *
                </label>
                <input
                  id="prop-nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  maxLength={80}
                  autoComplete="name"
                  placeholder="Ej: Andrea Gómez"
                  className="w-full bg-[#111] border border-[#333] focus:border-[#C2B280] rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="prop-whatsapp" className="block text-gray-300 text-xs mb-1.5">
                  Tu WhatsApp{" "}
                  <span className="text-gray-400">(aquí recibirás la propuesta)</span>
                </label>
                <input
                  id="prop-whatsapp"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  maxLength={25}
                  autoComplete="tel"
                  placeholder="Ej: 301 234 5678"
                  className="w-full bg-[#111] border border-[#333] focus:border-[#C2B280] rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="prop-email" className="block text-gray-300 text-xs mb-1.5">
                  Tu correo{" "}
                  <span className="text-gray-400">(opcional, si prefieres email)</span>
                </label>
                <input
                  id="prop-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={120}
                  autoComplete="email"
                  placeholder="tu@correo.com"
                  className="w-full bg-[#111] border border-[#333] focus:border-[#C2B280] rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="prop-tipo" className="block text-gray-300 text-xs mb-1.5">
                    Tipo de proyecto
                  </label>
                  <select
                    id="prop-tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full bg-[#111] border border-[#333] focus:border-[#C2B280] rounded-lg px-3 py-3 text-sm text-white outline-none transition-colors"
                  >
                    {TIPOS_PROYECTO.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="prop-presupuesto" className="block text-gray-300 text-xs mb-1.5">
                    Presupuesto
                  </label>
                  <select
                    id="prop-presupuesto"
                    value={presupuesto}
                    onChange={(e) => setPresupuesto(e.target.value)}
                    className="w-full bg-[#111] border border-[#333] focus:border-[#C2B280] rounded-lg px-3 py-3 text-sm text-white outline-none transition-colors"
                  >
                    {PRESUPUESTOS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="prop-detalles" className="block text-gray-300 text-xs mb-1.5">
                  Cuéntame tu proyecto
                </label>
                <textarea
                  id="prop-detalles"
                  value={detalles}
                  onChange={(e) => setDetalles(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  placeholder="Ej: Tengo una marca de ropa y quiero vender por internet…"
                  className="w-full bg-[#111] border border-[#333] focus:border-[#C2B280] rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors resize-none"
                />
              </div>

              <label className="flex items-start gap-2.5 text-[11px] text-gray-300 leading-relaxed cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                  className="mt-0.5 h-4 w-4 accent-[#C2B280] shrink-0"
                />
                <span>
                  Autorizo a Wilson Valencia a tratar mis datos para responder
                  esta solicitud, conforme a la{" "}
                  <Link href="/privacidad" className="text-[#C2B280] underline">
                    política de privacidad
                  </Link>
                  . *
                </span>
              </label>

              {errorMsg && (
                <p className="text-red-400 text-xs flex items-center gap-2" role="alert">
                  <FaExclamationTriangle aria-hidden="true" /> {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={!consent}
                className="w-full bg-[#C2B280] hover:bg-[#d4c69a] text-black font-bold py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaFeatherAlt aria-hidden="true" /> Enviar mi solicitud ✨
              </button>

              <p className="text-gray-400 text-[11px] text-center leading-relaxed">
                Wilson revisa tu solicitud personalmente y te envía la propuesta
                por WhatsApp. Tus datos no se comparten con terceros para
                publicidad.
              </p>
            </form>
          )}

          {estado === "loading" && (
            <div className="text-center py-10" aria-live="polite">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full border-2 border-[#333] border-t-[#C2B280] animate-spin" />
              <p className="text-white font-semibold mb-2">Preparando tu solicitud…</p>
              <p className="text-gray-400 text-xs">
                Estoy revisando tu proyecto y los servicios de Wilson.
                <br />
                Toma entre 10 y 20 segundos 🕊
              </p>
            </div>
          )}

          {estado === "success" && (
            <div className="text-center py-8">
              <FaCheckCircle className="text-green-400 text-5xl mx-auto mb-5" aria-hidden="true" />
              <h4 className="text-white font-bold text-lg mb-2">¡Solicitud recibida!</h4>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Wilson recibió tu solicitud y está preparando tu propuesta
                personalizada.
                <br />
                <span className="text-[#C2B280]">Te escribirá muy pronto 🚀</span>
              </p>
              <button
                onClick={onClose}
                className="bg-[#C2B280] hover:bg-[#d4c69a] text-black font-semibold text-sm py-3 px-8 rounded-xl transition"
              >
                Entendido, listo ✅
              </button>
            </div>
          )}

          {estado === "error" && (
            <div className="text-center py-8">
              <FaExclamationTriangle className="text-[#C2B280] text-5xl mx-auto mb-5" aria-hidden="true" />
              <h4 className="text-white font-bold text-lg mb-2">Uy, algo salió mal</h4>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">{errorMsg}</p>
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
                  <FaWhatsapp className="text-[#25D366]" aria-hidden="true" /> Pedirla por WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
