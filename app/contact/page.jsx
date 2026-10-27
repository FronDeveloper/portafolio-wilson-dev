"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  trackMetaEvent,
  trackGAEvent,
  getAttribution,
} from "@/lib/analytics/meta-events";

/**
 * /contact — formulario de contacto en el MISMO pipeline que el chat y
 * /cotizar: API propia (/api/contacto) + Resend + copia en /panel/leads.
 */

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Auto-cerrar mensajes después de 6 segundos
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setError("");
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          consent,
          utm: getAttribution(),
        }),
      });

      if (response.ok) {
        // Un solo evento de lead por conversión (Meta + GA4)
        trackMetaEvent("Lead", {
          content_name: "Mensaje de contacto",
          content_category: "Portafolio Lead",
          status: "form_submitted",
        });
        trackGAEvent("generate_lead", { form: "contacto" });

        setSuccess(true);
        setFormData({ nombre: "", email: "", mensaje: "" });
        setConsent(false);
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

  const inputClass =
    "bg-[#111] border border-gray-800 p-4 rounded-xl outline-none focus:border-[#C2B280] transition w-full";

  return (
    <main className="text-white min-h-screen">
      <Navbar />

      <section className="px-8 md:px-20 py-20 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#C2B280]">
          Contáctame
        </h1>

        <p className="text-gray-400 mb-6 text-lg">
          ¿Tienes una idea o proyecto? Escríbeme y trabajemos juntos.
        </p>

        <div className="bg-[#111] p-4 rounded-lg mb-8 border border-gray-800">
          <p className="text-gray-300">
            📩 <strong>Respuesta garantizada en menos de 24 horas</strong>
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Cuéntame sobre tu proyecto y te daré una cotización inicial sin compromiso.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="contacto-nombre"
              className="block text-sm text-gray-300 mb-2"
            >
              Tu nombre
            </label>
            <input
              id="contacto-nombre"
              type="text"
              name="nombre"
              autoComplete="name"
              required
              maxLength={80}
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              disabled={loading}
              className={inputClass}
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label
              htmlFor="contacto-email"
              className="block text-sm text-gray-300 mb-2"
            >
              Tu email
            </label>
            <input
              id="contacto-email"
              type="email"
              name="email"
              autoComplete="email"
              required
              maxLength={120}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
              className={inputClass}
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label
              htmlFor="contacto-mensaje"
              className="block text-sm text-gray-300 mb-2"
            >
              Tu proyecto
            </label>
            <textarea
              id="contacto-mensaje"
              name="mensaje"
              required
              rows={5}
              maxLength={2000}
              value={formData.mensaje}
              onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
              disabled={loading}
              className={inputClass}
              placeholder="Cuéntame sobre tu proyecto..."
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              id="contacto-consent"
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              disabled={loading}
              className="mt-1 h-4 w-4 shrink-0 accent-[#C2B280]"
            />
            <label
              htmlFor="contacto-consent"
              className="text-gray-400 text-xs leading-relaxed"
            >
              Acepto la{" "}
              <Link
                href="/privacidad"
                className="text-[#C2B280] underline hover:opacity-80"
              >
                política de privacidad
              </Link>{" "}
              y el tratamiento de mis datos para responder a esta solicitud.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#C2B280] text-black py-4 rounded-xl font-semibold hover:opacity-80 transition disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar mensaje 🚀"}
          </button>
        </form>

        {success && (
          <div className="bg-green-500/10 border border-green-500 p-4 rounded-lg mt-6">
            <p className="text-green-400">
              ✅ ¡Mensaje enviado correctamente! Te responderé en menos de 24 horas.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 p-4 rounded-lg mt-6">
            <p className="text-red-400">
              ❌ {error} Si prefieres, escríbeme directamente a wilson.arroyo12@gmail.com
            </p>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-gray-800">
          <h3 className="text-lg font-semibold mb-3">También puedes contactarme directamente:</h3>
          <p className="text-gray-400">📧 wilson.arroyo12@gmail.com</p>
          <p className="text-gray-400">💬 WhatsApp: +57 301 2821174</p>
        </div>
      </section>
    </main>
  );
}
