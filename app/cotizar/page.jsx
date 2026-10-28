"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaPaperPlane,
  FaWhatsapp,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import {
  trackMetaEvent,
  trackGAEvent,
  captureUTMParams,
  getAttribution,
} from "@/lib/analytics/meta-events";
import AgendarLlamada from "@/components/AgendarLlamada";
import { PRESUPUESTOS, TIPOS_PROYECTO } from "@/lib/pricing";

export default function CotizarPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    projectType: "",
    budget: "",
    description: "",
  });
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    captureUTMParams();

    // Prellena el tipo de proyecto desde las tarjetas de precios.
    try {
      const tipo = new URLSearchParams(window.location.search).get("tipo");
      if (tipo && TIPOS_PROYECTO.some((t) => t.value === tipo)) {
        setFormData((prev) => ({ ...prev, projectType: tipo }));
      }
    } catch {
      /* sin query string */
    }

    trackMetaEvent("ViewContent", {
      content_name: "Página de cotización",
      content_category: "Lead Form",
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) {
      setError("Necesito tu autorización para tratar los datos del formulario.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        consent: true,
        utm: getAttribution(),
      };

      const response = await fetch("/api/cotizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Un solo evento Lead en todo el flujo (no se repite en /gracias).
        trackMetaEvent("Lead", {
          content_name: "Solicitud de cotización",
          content_category: "Portafolio Lead",
          status: "form_submitted",
        });
        trackGAEvent("generate_lead", { form: "cotizar" });

        setTimeout(() => {
          router.push("/gracias");
        }, 400);
      } else {
        const data = await response.json().catch(() => null);
        setError(
          data?.error ||
            "Hubo un error. Por favor intenta de nuevo o escríbeme por WhatsApp."
        );
      }
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-white relative">
      <header className="border-b border-gray-800/50 backdrop-blur-sm bg-[#0B0B0B]/80 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
          >
            <FaArrowLeft aria-hidden="true" /> Volver al portafolio
          </Link>
          <a
            href="https://wa.me/573012821174?text=Hola%20Wilson%2C%20vi%20tu%20portafolio%20y%20quiero%20cotizar%20un%20proyecto"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm bg-green-500/10 border border-green-500/30 text-green-300 px-3 py-1.5 rounded-lg hover:bg-green-500/20 transition"
          >
            <FaWhatsapp aria-hidden="true" /> WhatsApp directo
          </a>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 px-3 py-1 rounded-full mb-4">
            <span className="text-violet-300 text-xs font-semibold">
              ⚡ RESPUESTA EN 24 HORAS
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cotiza tu proyecto{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              sin compromiso
            </span>
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Cuéntame qué necesitas. En menos de 24 horas te envío una propuesta
            inicial con alcance, precio y tiempo de entrega.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-violet-500/30 bg-violet-500/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              ¿Prefieres hablarlo en vivo?
            </p>
            <p className="text-xs text-gray-300">
              15 minutos por videollamada, sin compromiso.
            </p>
          </div>
          <AgendarLlamada
            ubicacion="cotizar"
            variante="violeta"
            etiqueta="Agendar llamada"
            className="shrink-0"
          />
        </div>

        <div className="bg-gradient-to-br from-[#111] to-[#0F0F0F] border border-gray-800 rounded-2xl p-6 md:p-10">
          {error && (
            <div
              role="alert"
              className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="cot-nombre"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Nombre *
              </label>
              <input
                id="cot-nombre"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                maxLength={80}
                placeholder="¿Cómo te llamas?"
                className="w-full bg-[#0B0B0B] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="cot-email"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Email *
                </label>
                <input
                  id="cot-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  maxLength={120}
                  placeholder="tu@email.com"
                  className="w-full bg-[#0B0B0B] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition"
                />
              </div>
              <div>
                <label
                  htmlFor="cot-whatsapp"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  WhatsApp *
                </label>
                <input
                  id="cot-whatsapp"
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  maxLength={30}
                  placeholder="+57 300 123 4567"
                  className="w-full bg-[#0B0B0B] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="cot-tipo"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Tipo de proyecto *
              </label>
              <select
                id="cot-tipo"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                required
                className="w-full bg-[#0B0B0B] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition"
              >
                <option value="">Selecciona una opción</option>
                {TIPOS_PROYECTO.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="cot-presupuesto"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Presupuesto aproximado *
              </label>
              <select
                id="cot-presupuesto"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                className="w-full bg-[#0B0B0B] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition"
              >
                <option value="">Selecciona un rango</option>
                {PRESUPUESTOS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
              <p className="text-gray-400 text-xs mt-1.5">
                Rangos en COP con equivalente aproximado en USD. Si estás fuera
                de Colombia, elige el rango más cercano.
              </p>
            </div>

            <div>
              <label
                htmlFor="cot-descripcion"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Cuéntame del proyecto
              </label>
              <textarea
                id="cot-descripcion"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                maxLength={2000}
                placeholder="¿Qué problema quieres resolver? ¿Qué funcionalidades necesitas? Mientras más detalle, mejor."
                className="w-full bg-[#0B0B0B] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition resize-none"
              />
            </div>

            <label className="flex items-start gap-3 text-xs text-gray-300 leading-relaxed cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
                className="mt-0.5 h-4 w-4 accent-violet-500 shrink-0"
              />
              <span>
                Autorizo a Wilson Valencia a tratar mis datos para responder
                esta solicitud, conforme a la{" "}
                <Link href="/privacidad" className="text-violet-300 underline">
                  política de privacidad
                </Link>{" "}
                y los{" "}
                <Link href="/terminos" className="text-violet-300 underline">
                  términos
                </Link>
                . *
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !consent}
              className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white py-4 rounded-xl font-semibold text-sm hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Enviando..."
              ) : (
                <>
                  <FaPaperPlane aria-hidden="true" /> Enviar solicitud
                </>
              )}
            </button>

            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 pt-2">
              <span className="flex items-center gap-1">
                <FaCheckCircle className="text-green-500" aria-hidden="true" /> Sin compromiso
              </span>
              <span className="flex items-center gap-1">
                <FaCheckCircle className="text-green-500" aria-hidden="true" /> Respuesta en 24h
              </span>
              <span className="flex items-center gap-1">
                <FaCheckCircle className="text-green-500" aria-hidden="true" /> Datos protegidos
              </span>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          ¿Prefieres hablar directamente?{" "}
          <a
            href="https://wa.me/573012821174?text=Hola%20Wilson%2C%20vi%20tu%20portafolio%20y%20quiero%20cotizar%20un%20proyecto"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-300 underline underline-offset-2 hover:text-violet-200"
          >
            Escríbeme por WhatsApp
          </a>
        </p>
      </section>
    </main>
  );
}
