"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiButterfly } from "react-icons/gi";
import { FaTimes, FaPaperPlane, FaWhatsapp, FaCheckCircle } from "react-icons/fa";
import { trackMetaEvent } from "@/lib/analytics/meta-events";

/**
 * ChatWidget — Asistente virtual "Alma" del portafolio.
 *
 * - Flotante abajo-DERECHA (posición estándar de los chats; el botón verde
 *   de WhatsApp vive abajo-izquierda y ScrollToTop se apila encima).
 * - Guarda la conversación en sessionStorage (sobrevive a cambios de página).
 * - Cuando la IA captura un lead, muestra confirmación + acceso directo a
 *   WhatsApp con mensaje prellenado (solo en ese momento, el header no
 *   duplica el acceso a WhatsApp porque ya existe el botón flotante).
 * - Estados del lead: "saved" (llegó a Wilson por algún canal) o "pending"
 *   (quedó registrado en el servidor pero falló la entrega — se guía al
 *   visitante a WhatsApp directo para no perder el contacto).
 *
 * Personalización rápida:
 *   - SALUDO, SUGERENCIAS y textos → constantes aquí abajo.
 *   - Identidad, proyectos, precios y reglas → lib/assistant.ts
 */

const STORAGE_KEY = "alma_chat_v1";
const WHATSAPP_PHONE = "573012821174";

const SALUDO_INICIAL =
  "¡Hola! 👋 Soy Alma, tu asistente virtual. ¿Buscas una página web, una tienda online, una app o un sistema a medida? Cuéntame qué tienes en mente.";

const SUGERENCIAS = [
  "Quiero una página web para mi negocio",
  "Me interesa una app o sistema a medida",
  "¿Cuánto cuesta un proyecto?",
];

function loadHistory() {
  if (typeof window === "undefined") return { messages: [], leadState: null };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
        return {
          messages: parsed.messages,
          // Compatibilidad con sesiones v1/v2 que guardaban leadSaved booleano
          leadState: parsed.leadState || (parsed.leadSaved ? "saved" : null),
        };
      }
    }
  } catch {
    // storage corrupto: empezar de cero
  }
  return { messages: [], leadState: null };
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  // "saved" → lead entregado a Wilson · "pending" → capturado pero falló la entrega
  const [leadState, setLeadState] = useState(null);
  const [leadName, setLeadName] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [unreadBadge, setUnreadBadge] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const scrollRef = useRef(null);
  const openedOnceRef = useRef(false);

  // Cargar historial guardado (solo cliente)
  useEffect(() => {
    const saved = loadHistory();
    setMessages(
      saved.messages.length > 0
        ? saved.messages
        : [{ role: "assistant", content: SALUDO_INICIAL }]
    );
    setLeadState(saved.leadState);
    setHydrated(true);
  }, []);

  // Persistir conversación
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, leadState }));
    } catch {
      // storage lleno: ignorar
    }
  }, [messages, leadState, hydrated]);

  // Burbuja teaser (una vez por sesión)
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem("alma_bubble_dismissed") === "1";
    } catch {}
    if (dismissed) return;
    const timer = setTimeout(() => setShowBubble(true), 2500);
    const autoHide = setTimeout(() => setShowBubble(false), 11000);
    return () => {
      clearTimeout(timer);
      clearTimeout(autoHide);
    };
  }, []);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  const handleOpen = useCallback(() => {
    setOpen((v) => {
      const next = !v;
      if (next && !openedOnceRef.current) {
        openedOnceRef.current = true;
        setUnreadBadge(false);
        setShowBubble(false);
        try {
          sessionStorage.setItem("alma_bubble_dismissed", "1");
        } catch {}
        trackMetaEvent("Contact", {
          content_name: "Chat Alma abierto",
          content_category: "ChatWidget",
          status: "chat_opened",
        });
      }
      return next;
    });
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text ?? input).trim();
      if (!trimmed || loading) return;

      const userMsg = { role: "user", content: trimmed };
      const history = [...messages, userMsg];
      setMessages(history);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history.filter((m) => m.role === "user" || m.role === "assistant"),
          }),
        });

        const data = await res.json().catch(() => null);
        const reply =
          data?.reply ||
          "⚠️ No se pudo contactar al servidor. Intenta de nuevo en unos segundos.";

        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

        // leadCaptured = la IA obtuvo nombre+contacto+necesidad del visitante.
        // leadSaved = además logró entregarlo (email y/o aviso push).
        if (data?.leadCaptured) {
          setLeadState(data.leadSaved ? "saved" : "pending");
          if (data.leadName) setLeadName(data.leadName);
          trackMetaEvent("Lead", {
            content_name: "Lead chatbot Alma",
            content_category: "ChatWidget",
            status: data.leadSaved ? "lead_captured" : "lead_pending_delivery",
          });
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "⚠️ No se pudo contactar al servidor. Intenta de nuevo en unos segundos.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const whatsappDirecto = () => {
    const texto = encodeURIComponent(
      `Hola Wilson, soy ${leadName || "un visitante"} — hablé con Alma, tu asistente virtual, y me interesa un proyecto`
    );
    return `https://wa.me/${WHATSAPP_PHONE}?text=${texto}`;
  };

  return (
    <>
      {/* Burbuja teaser */}
      <AnimatePresence>
        {showBubble && !open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-24 right-4 sm:right-6 z-40 max-w-[240px] bg-[#111] border border-[#C2B280]/40 rounded-2xl rounded-br-sm px-4 py-3 shadow-xl"
          >
            <button
              onClick={() => setShowBubble(false)}
              aria-label="Cerrar sugerencia"
              className="absolute -top-2 -left-2 bg-[#333] text-gray-300 rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-[#444]"
            >
              <FaTimes className="text-[9px]" />
            </button>
            <p className="text-xs text-gray-200 leading-relaxed">
              ¿Buscas un desarrollo a medida? <span className="text-[#C2B280] font-semibold">Pregúntame lo que quieras</span> ✨
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel del chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="fixed z-50 bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-24 sm:w-[380px] h-[min(560px,70dvh)] flex flex-col bg-[#0B0B0B] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-label="Chat con Alma, asistente virtual de Wilson Valencia"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#111] border-b border-gray-800 shrink-0">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C2B280] to-[#a08b5f] flex items-center justify-center">
                  <GiButterfly className="text-black text-xl" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold text-sm">Alma</p>
                  <span className="text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-full">
                    En línea
                  </span>
                </div>
                <p className="text-gray-500 text-[11px] truncate">Tu asistente virtual</p>
              </div>
              <button
                onClick={handleOpen}
                aria-label="Cerrar chat"
                className="text-gray-400 hover:text-white transition p-1"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Mensajes */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              role="log"
              aria-live="polite"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-[#C2B280] text-black rounded-2xl rounded-tr-sm"
                        : "bg-[#1a1a1a] text-gray-100 border border-gray-800 rounded-2xl rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="w-2 h-2 bg-[#C2B280]/70 rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Confirmación de lead capturado */}
              {leadState && (
                <div
                  className={`rounded-xl px-4 py-3 border ${
                    leadState === "saved"
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-amber-500/10 border-amber-500/30"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <FaCheckCircle
                      className={`mt-0.5 shrink-0 ${
                        leadState === "saved" ? "text-green-400" : "text-amber-400"
                      }`}
                    />
                    <div>
                      {leadState === "saved" ? (
                        <>
                          <p className="text-green-300 text-xs font-semibold">
                            ¡Listo! Wilson ya recibió tu mensaje
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Te responderá personalmente muy pronto. ¿Prefieres ir más rápido?
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-amber-300 text-xs font-semibold">
                            Tu mensaje quedó registrado ✅
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Para una respuesta más rápida, escríbele directo a Wilson:
                          </p>
                        </>
                      )}
                      <a
                        href={whatsappDirecto()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2.5 inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black text-xs font-semibold px-3.5 py-2 rounded-lg transition"
                      >
                        <FaWhatsapp /> Hablar ahora por WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Chips de sugerencias */}
              {!leadState && messages.length <= 1 && !loading && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGERENCIAS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-[11px] text-[#C2B280] border border-[#C2B280]/40 hover:bg-[#C2B280] hover:text-black rounded-full px-3 py-1.5 transition text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-3 py-3 bg-[#111] border-t border-gray-800 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                maxLength={800}
                aria-label="Escribe tu mensaje"
                className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-xl px-3.5 py-2.5 text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#C2B280]/60 min-w-0"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Enviar mensaje"
                className="bg-[#C2B280] hover:bg-[#d4c493] disabled:opacity-40 disabled:cursor-not-allowed text-black p-2.5 rounded-xl transition shrink-0"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante (abajo-derecha, posición estándar de chat) */}
      <motion.button
        onClick={handleOpen}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        aria-label={open ? "Cerrar chat" : "Abrir chat con Alma"}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#C2B280] to-[#a08b5f] text-black rounded-full shadow-lg shadow-[#C2B280]/20 flex items-center justify-center"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <FaTimes className="text-xl" />
            </motion.span>
          ) : (
            <motion.span
              key="alma"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <GiButterfly className="text-2xl" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Badge de notificación */}
        {unreadBadge && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            1
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-40" />
          </span>
        )}
      </motion.button>
    </>
  );
}
