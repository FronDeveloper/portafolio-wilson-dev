"use client";

/**
 * ============================================================
 *  Alma v2.3 — ChatWidget
 * ============================================================
 *  - Historial en localStorage v2 con expiración de 7 días
 *  - Hidratación antes de volver a guardar (no se sobrescribe)
 *  - Botón para borrar la conversación
 *  - Prellena la propuesta con nombre, contacto y presupuesto
 *  - Envía UTM + página de origen al capturar el lead
 * ============================================================
 */

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaFeatherAlt,
  FaTimes,
  FaPaperPlane,
  FaWhatsapp,
  FaTrash,
  FaLock,
} from "react-icons/fa";
import PropuestaForm from "./PropuestaForm";
import AgendarLlamada from "./AgendarLlamada";
import {
  trackMetaEvent,
  trackGAEvent,
  getAttribution,
} from "@/lib/analytics/meta-events";

const WHATSAPP_PHONE = "573012821174";
const STORAGE_KEY = "alma_chat_v2";
const STORAGE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 días
const MAX_MENSAJES = 40;

const SUGERENCIAS = [
  "Quiero una landing page",
  "¿Precio de una tienda online?",
  "Necesito una app a medida",
  "Hablar con Wilson",
];

/** @typedef {{ role: "user" | "assistant", content: string }} Mensaje */
/** @typedef {{ nombre: string, contacto: string, presupuesto: string, necesidad: string }} LeadGuardado */

/** @type {LeadGuardado} */
const LEAD_VACIO = {
  nombre: "",
  contacto: "",
  presupuesto: "",
  necesidad: "",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [leadState, setLeadState] = useState(null);
  const [lead, setLead] = useState(LEAD_VACIO);
  const [showPropuesta, setShowPropuesta] = useState(false);
  const [hidratado, setHidratado] = useState(false);
  const finMensajesRef = useRef(null);
  const leadTrackedRef = useRef(false);

  /* ---------------- Hidratación (una sola vez) ---------------- */

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const vigente =
          parsed?.v === 2 &&
          typeof parsed.ts === "number" &&
          Date.now() - parsed.ts < STORAGE_TTL;

        if (vigente) {
          if (Array.isArray(parsed.mensajes)) {
            setMensajes(
              parsed.mensajes
                .filter(
                  (m) =>
                    !!m &&
                    typeof m === "object" &&
                    (m.role === "user" || m.role === "assistant") &&
                    typeof m.content === "string"
                )
                .slice(-MAX_MENSAJES)
            );
          }
          if (parsed.leadState === "saved" || parsed.leadState === "pending") {
            setLeadState(parsed.leadState);
            leadTrackedRef.current = true;
          }
          if (parsed.lead && typeof parsed.lead === "object") {
            setLead({
              nombre: String(parsed.lead.nombre || "").slice(0, 80),
              contacto: String(parsed.lead.contacto || "").slice(0, 120),
              presupuesto: String(parsed.lead.presupuesto || "").slice(0, 80),
              necesidad: String(parsed.lead.necesidad || "").slice(0, 500),
            });
          }
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      /* historial corrupto o modo privado: arranca limpio */
    } finally {
      setHidratado(true);
    }
  }, []);

  /* ---------------- Persistencia (solo después de hidratar) ---------------- */

  useEffect(() => {
    if (!hidratado) return;
    try {
      if (mensajes.length === 0 && !leadState) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          v: 2,
          ts: Date.now(),
          mensajes: mensajes.slice(-MAX_MENSAJES),
          leadState,
          lead,
        })
      );
    } catch {
      /* modo privado / sin espacio: silencio */
    }
  }, [mensajes, leadState, lead, hidratado]);

  useEffect(() => {
    if (finMensajesRef.current) {
      finMensajesRef.current.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
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
          messages: nuevos.slice(-12),
          origin: {
            ...getAttribution(),
            page: window.location.pathname,
          },
        }),
      });
      const data = await res.json();

      const respuesta =
        data?.reply ||
        "Uy, tuve un problemita técnico. ¿Me lo repites? O escríbele directo a Wilson por WhatsApp 👇";
      setMensajes([...nuevos, { role: "assistant", content: respuesta }]);

      if (data?.leadCaptured) {
        setLeadState(data.leadSaved ? "saved" : "pending");
        setLead({
          nombre: data.leadName || lead.nombre,
          contacto: data.leadContact || lead.contacto,
          presupuesto: data.leadBudget || lead.presupuesto,
          necesidad: data.leadNeed || lead.necesidad,
        });

        if (!leadTrackedRef.current) {
          leadTrackedRef.current = true;
          trackMetaEvent("Lead", {
            content_name: "alma_chat",
            content_category: "Chatbot",
            status: data.leadSaved ? "lead_captured" : "lead_pending_delivery",
          });
          trackGAEvent("generate_lead", { form: "chat_alma" });
        }
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
    const saludo = lead.nombre
      ? `Hola Wilson! Soy ${lead.nombre}, acabo de hablar con Alma en tu portafolio 👋`
      : "Hola Wilson! Vi tu portafolio y quiero hablar de mi proyecto 👋";
    window.open(
      `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(saludo)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const limpiarConversacion = () => {
    const ok = window.confirm(
      "¿Borrar la conversación guardada en este navegador? Esta acción no se puede deshacer."
    );
    if (!ok) return;
    setMensajes([]);
    setLeadState(null);
    setLead(LEAD_VACIO);
    leadTrackedRef.current = false;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* silencio */
    }
  };

  // Detalle para prellenar el formulario de propuesta
  const detallePrefill =
    lead.necesidad ||
    mensajes
      .filter((m) => m.role === "user")
      .slice(-2)
      .map((m) => m.content)
      .join("\n");

  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(timer);
    }
  }, [open]);

  /* ---------------- UI ---------------- */

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar chat con Alma" : "Abrir chat con Alma"}
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-[70] w-14 h-14 rounded-full bg-gradient-to-br from-[#C2B280] to-[#9a8a5e] text-black shadow-xl shadow-black/40 flex items-center justify-center hover:scale-110 active:scale-95 transition motion-reduce:transform-none"
      >
        {open ? <FaTimes className="text-xl" /> : <FaFeatherAlt className="text-xl" />}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[#C2B280] animate-ping opacity-20 pointer-events-none motion-reduce:animate-none" />
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
            className="fixed z-[70] bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] max-w-[400px] h-[min(620px,calc(100vh-8rem))] bg-[#0B0B0B] border border-[#333] rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
            role="dialog"
            aria-label="Chat con Alma, asistente virtual"
          >
            {/* Encabezado */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#222] bg-[#111]/60">
              <div className="w-10 h-10 rounded-full bg-[#C2B280]/15 border border-[#C2B280]/40 flex items-center justify-center text-[#C2B280]">
                <FaFeatherAlt aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">Alma</p>
                <p className="text-gray-400 text-xs flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"
                    aria-hidden="true"
                  />
                  asistente virtual · IA
                </p>
              </div>
              {mensajes.length > 0 && (
                <button
                  onClick={limpiarConversacion}
                  aria-label="Borrar conversación"
                  title="Borrar conversación"
                  className="text-gray-400 hover:text-red-400 transition p-1.5"
                >
                  <FaTrash className="text-sm" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar chat"
                className="text-gray-400 hover:text-white transition p-1.5"
              >
                <FaTimes />
              </button>
            </div>

            {/* Mensajes */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              role="log"
              aria-live="polite"
              aria-relevant="additions"
            >
              {mensajes.length === 0 && (
                <div className="text-center py-8 px-4">
                  <FaFeatherAlt
                    className="text-3xl text-[#C2B280]/50 mx-auto mb-3"
                    aria-hidden="true"
                  />
                  <p className="text-gray-200 text-sm font-medium mb-1">
                    ¡Hola! Soy Alma 🕊
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Cuéntame qué necesitas para tu proyecto y te orientaré con
                    los precios y servicios de Wilson.
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
                    <span className="sr-only">Alma está escribiendo</span>
                    <div className="flex gap-1.5" aria-hidden="true">
                      <span className="w-2 h-2 bg-[#C2B280]/70 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-[#C2B280]/70 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-[#C2B280]/70 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Lead entregado a Wilson */}
              {leadState === "saved" && (
                <div className="bg-[#0d2013] border border-green-500/40 rounded-xl p-4 text-center">
                  <p className="text-green-300 text-sm font-semibold mb-1">
                    ✅ Wilson ya recibió tu mensaje
                  </p>
                  <p className="text-gray-300 text-xs mb-3">
                    Te escribirá al contacto que dejaste.
                  </p>
                  <button
                    onClick={() => setShowPropuesta(true)}
                    className="w-full bg-[#C2B280] hover:bg-[#d4c69a] text-black font-bold text-xs py-2.5 rounded-lg transition mb-2"
                  >
                    📝 Solicitar mi propuesta
                  </button>
                  <AgendarLlamada
                    ubicacion="chat_lead"
                    variante="chat"
                    etiqueta="Agendar llamada de 15 min"
                    className="mb-2"
                  />
                  <button
                    onClick={whatsappDirecto}
                    className="w-full border border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/10 font-semibold text-xs py-2.5 rounded-lg transition flex items-center justify-center gap-1.5"
                  >
                    <FaWhatsapp aria-hidden="true" /> Hablar con Wilson ahora
                  </button>
                </div>
              )}

              {/* Lead registrado, entrega sin confirmar */}
              {leadState === "pending" && (
                <div className="bg-[#231d0d] border border-[#C2B280]/40 rounded-xl p-4 text-center">
                  <p className="text-[#C2B280] text-sm font-semibold mb-1">
                    📩 Tu mensaje quedó registrado
                  </p>
                  <p className="text-gray-300 text-xs mb-3">
                    Para respuesta inmediata, escríbele directo:
                  </p>
                  <button
                    onClick={whatsappDirecto}
                    className="w-full bg-[#25D366] hover:bg-[#1fb857] text-black font-bold text-xs py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 mb-2"
                  >
                    <FaWhatsapp aria-hidden="true" /> WhatsApp directo
                  </button>
                  <button
                    onClick={() => setShowPropuesta(true)}
                    className="w-full bg-[#C2B280] hover:bg-[#d4c69a] text-black font-bold text-xs py-2.5 rounded-lg transition"
                  >
                    📝 Solicitar mi propuesta
                  </button>
                </div>
              )}

              {/* Chips de sugerencias */}
              {!leadState && mensajes.length === 0 && (
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
              {/* Handoff: en cualquier momento el visitante puede saltar a WhatsApp */}
              <button
                onClick={whatsappDirecto}
                className="w-full mb-2 flex items-center justify-center gap-2 text-[11px] text-gray-300 hover:text-white border border-[#2a2a2a] hover:border-[#25D366]/50 rounded-lg py-2 transition"
              >
                <FaWhatsapp className="text-[#25D366]" aria-hidden="true" />
                ¿Prefieres hablar con Wilson? Escríbele por WhatsApp
              </button>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      enviarMensaje();
                    }
                  }}
                  placeholder="Escribe tu mensaje…"
                  maxLength={600}
                  aria-label="Escribe tu mensaje a Alma"
                  className="flex-1 min-w-0 bg-[#0B0B0B] border border-[#333] focus:border-[#C2B280] rounded-full px-4 py-2.5 text-sm text-white outline-none transition-colors"
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

              <p className="text-[10px] text-gray-400 leading-snug mt-2 flex items-start gap-1.5">
                <FaLock className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>
                  Si dejas tu contacto, la conversación se envía por correo a
                  Wilson para responderte.{" "}
                  <Link href="/privacidad" className="underline hover:text-[#C2B280]">
                    Privacidad
                  </Link>
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulario de propuesta */}
      {showPropuesta && (
        <PropuestaForm
          lead={{
            nombre: lead.nombre,
            contacto: lead.contacto,
            presupuesto: lead.presupuesto,
            detalle: detallePrefill,
          }}
          historial={mensajes}
          onClose={() => setShowPropuesta(false)}
        />
      )}
    </>
  );
}
