"use client";

/**
 * ============================================================
 *  Alma v2.2 — ChatWidget con generador de propuestas (FASE 2)
 *  Wilson Valencia Dev
 * ============================================================
 *  v2.0: chat con IA (Groq) + captura de leads (@@LEAD@@)
 *  v2.1: estados saved/pending de entrega + WhatsApp directo
 *  v2.2: NUEVO — botón "Generar mi propuesta" que abre el
 *        formulario prellenado; el borrador va al email de
 *        Wilson para su aprobación (nunca se envía solo)
 * ============================================================
 */

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaFeatherAlt,
  FaTimes,
  FaPaperPlane,
  FaWhatsapp,
} from "react-icons/fa";
import PropuestaForm from "./PropuestaForm";
import { trackMetaEvent } from "@/lib/analytics/meta-events";

const WHATSAPP_PHONE = "573012821174";
const STORAGE_KEY = "alma_chat_v1";

const SUGERENCIAS = [
  "Quiero una landing page",
  "¿Precio de una tienda online?",
  "Necesito una app a medida",
  "Hablar con Wilson",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [leadState, setLeadState] = useState(null); // "saved" | "pending" | null
  const [leadNombre, setLeadNombre] = useState("");
  const [showPropuesta, setShowPropuesta] = useState(false);
  const finMensajesRef = useRef(null);

  /* ---------------- Persistencia (sessionStorage) ---------------- */

  const loadHistory = () => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.mensajes) && parsed.mensajes.length) {
        setMensajes(parsed.mensajes);
      }
      // Compat hacia atrás con la v2.1 (leadSaved booleano)
      setLeadState(parsed.leadState || (parsed.leadSaved ? "saved" : null));
      if (parsed?.lead?.nombre) setLeadNombre(parsed.lead.nombre);
    } catch {
      /* historial corrupto: se ignora y arranca limpio */
    }
  };

  useEffect(() => {
    if (open) loadHistory();
  }, [open]);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          mensajes: mensajes.slice(-50),
          leadState,
          lead: { nombre: leadNombre },
          ts: Date.now(),
        })
      );
    } catch {
      /* modo privado / sin espacio: silencio */
    }
  }, [mensajes, leadState, leadNombre]);

  useEffect(() => {
    if (finMensajesRef.current) {
      finMensajesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensajes, enviando, open]);

  /* ---------------- Envío de mensajes ---------------- */

  const enviarMensaje = async (texto) => {
    const contenido = (texto || input).trim();
    if (!contenido || enviando) return;

    const nuevos = [...mensajes, { role: "user", content: contenido }];
    setMensajes(nuevos);
    setInput("");
    setEnviando(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: contenido,
          history: nuevos.slice(-12),
        }),
      });
      const data = await res.json();

      const respuesta =
        data?.reply ||
        "Uy, tuve un problemita técnico. ¿Me lo repites? O escríbele directo a Wilson por WhatsApp 👇";
      setMensajes([...nuevos, { role: "assistant", content: respuesta }]);

      if (data?.leadCaptured) {
        setLeadState(data.leadSaved ? "saved" : "pending");
        if (data.leadName) setLeadNombre(data.leadName);
        trackMetaEvent("Lead", {
          content_name: "alma_chat",
          content_category: "Chatbot",
          status: data.leadSaved ? "lead_captured" : "lead_pending_delivery",
        });
      }
    } catch {
      setMensajes([
        ...nuevos,
        {
          role: "assistant",
          content:
            "No pude conectarme 😕. Intenta de nuevo o escríbele a Wilson por WhatsApp, él responde rapidísimo.",
        },
      ]);
    } finally {
      setEnviando(false);
    }
  };

  const whatsappDirecto = () => {
    const saludo = leadNombre
      ? `Hola Wilson! Soy ${leadNombre}, acabo de hablar con Alma en tu portafolio 👋`
      : "Hola Wilson! Vi tu portafolio y quiero hablar de mi proyecto 👋";
    window.open(
      `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(saludo)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // Últimos mensajes del cliente para prellenar el detalle del formulario
  const detallePrefill = mensajes
    .filter((m) => m.role === "user")
    .slice(-2)
    .map((m) => m.content)
    .join("\n");

  /* ---------------- UI ---------------- */

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar chat" : "Abrir chat con Alma"}
        className="fixed bottom-6 right-6 z-[70] w-14 h-14 rounded-full bg-gradient-to-br from-[#C2B280] to-[#9a8a5e] text-black shadow-xl shadow-black/40 flex items-center justify-center hover:scale-110 active:scale-95 transition"
      >
        {open ? <FaTimes className="text-xl" /> : <FaFeatherAlt className="text-xl" />}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[#C2B280] animate-ping opacity-20 pointer-events-none" />
        )}
      </button>

      {/* Panel del chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed z-[70] bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] max-w-[380px] h-[min(600px,calc(100vh-9rem))] bg-[#0B0B0B] border border-[#333] rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
          >
            {/* Encabezado */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#222] bg-[#111]/60">
              <div className="w-10 h-10 rounded-full bg-[#C2B280]/15 border border-[#C2B280]/40 flex items-center justify-center text-[#C2B280]">
                <FaFeatherAlt />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm leading-tight">Alma</p>
                <p className="text-gray-500 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  tu asistente virtual
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="text-gray-500 hover:text-white transition p-1"
              >
                <FaTimes />
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {mensajes.length === 0 && (
                <div className="text-center py-8 px-4">
                  <FaFeatherAlt className="text-3xl text-[#C2B280]/50 mx-auto mb-3" />
                  <p className="text-gray-300 text-sm font-medium mb-1">
                    ¡Hola! Soy Alma 🕊
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Cuéntame qué necesitas para tu proyecto y te orientaré con los
                    precios y servicios de Wilson.
                  </p>
                </div>
              )}

              {mensajes.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-[#C2B280] text-black rounded-br-md"
                        : "bg-[#1a1a1a] text-gray-200 rounded-bl-md border border-[#262626]"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {enviando && (
                <div className="flex justify-start">
                  <div className="bg-[#1a1a1a] border border-[#262626] px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-[#C2B280]/70 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-[#C2B280]/70 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-[#C2B280]/70 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Tarjeta verde: lead entregado a Wilson */}
              {leadState === "saved" && (
                <div className="bg-[#0d2013] border border-green-500/40 rounded-xl p-4 text-center">
                  <p className="text-green-300 text-sm font-semibold mb-1">
                    ✅ Wilson ya recibió tu mensaje
                  </p>
                  <p className="text-gray-400 text-xs mb-3">
                    Te escribirá a tu correo o WhatsApp muy pronto.
                  </p>
                  <button
                    onClick={() => setShowPropuesta(true)}
                    className="w-full bg-[#C2B280] hover:bg-[#d4c69a] text-black font-bold text-xs py-2.5 rounded-lg transition flex items-center justify-center gap-1.5"
                  >
                    📝 Generar mi propuesta con IA
                  </button>
                </div>
              )}

              {/* Tarjeta ámbar: lead registrado, entrega sin confirmar */}
              {leadState === "pending" && (
                <div className="bg-[#231d0d] border border-[#C2B280]/40 rounded-xl p-4 text-center">
                  <p className="text-[#C2B280] text-sm font-semibold mb-1">
                    📩 Tu mensaje quedó registrado
                  </p>
                  <p className="text-gray-400 text-xs mb-3">
                    Para respuesta inmediata, escríbele directo:
                  </p>
                  <button
                    onClick={whatsappDirecto}
                    className="w-full bg-[#25D366] hover:bg-[#1fb857] text-black font-bold text-xs py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 mb-2"
                  >
                    <FaWhatsapp /> WhatsApp directo
                  </button>
                  <button
                    onClick={() => setShowPropuesta(true)}
                    className="w-full bg-[#C2B280] hover:bg-[#d4c69a] text-black font-bold text-xs py-2.5 rounded-lg transition flex items-center justify-center gap-1.5"
                  >
                    📝 Generar mi propuesta con IA
                  </button>
                </div>
              )}

              {/* Chips de sugerencias (solo si aún no hay lead) */}
              {!leadState && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGERENCIAS.map((s) => (
                    <button
                      key={s}
                      onClick={() => enviarMensaje(s)}
                      disabled={enviando}
                      className="text-[11px] text-[#C2B280] border border-[#C2B280]/40 hover:bg-[#C2B280]/10 rounded-full px-3 py-1.5 transition disabled:opacity-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={finMensajesRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[#222] bg-[#111]/60">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
                  placeholder="Escribe tu mensaje…"
                  maxLength={600}
                  className="flex-1 bg-[#0B0B0B] border border-[#333] focus:border-[#C2B280] rounded-full px-4 py-2.5 text-sm text-white outline-none transition-colors"
                />
                <button
                  onClick={() => enviarMensaje()}
                  disabled={enviando || !input.trim()}
                  aria-label="Enviar mensaje"
                  className="w-10 h-10 rounded-full bg-[#C2B280] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition disabled:opacity-40 disabled:hover:scale-100"
                >
                  <FaPaperPlane className="text-sm" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulario de propuesta (FASE 2) */}
      {showPropuesta && (
        <PropuestaForm
          lead={{ nombre: leadNombre, detalle: detallePrefill }}
          historial={mensajes}
          onClose={() => setShowPropuesta(false)}
        />
      )}
    </>
  );
}
