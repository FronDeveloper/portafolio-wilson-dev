"use client";

import Navbar from "@/components/Navbar";
import AgendarLlamada from "@/components/AgendarLlamada";
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
    sitio_web: "", // honeypot anti-bots
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
    "bg-superficie border border-borde p-4 rounded-xl outline-none focus:border-acento transition w-full";

  return (
    <main className="text-tinta min-h-screen">
      <Navbar />

      <section className="px-8 md:px-20 py-20 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Contáctame
        </h1>

        <p className="text-tinta-suave mb-6 text-lg">
          ¿Tienes una idea o proyecto? Escríbeme y trabajemos juntos.
        </p>

        <div className="bg-superficie p-4 rounded-lg mb-8 border border-borde">
          <p className="text-tinta">
            📩 <strong>Respuesta garantizada en menos de 24 horas</strong>
          </p>
          <p className="text-tinta-suave text-sm mt-1">
            Cuéntame sobre tu proyecto y te daré una cotización inicial sin compromiso.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Honeypot anti-bots (P0-4): los humanos no lo ven. Si un bot lo
              llena, el servidor descarta el envío en silencio. */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="sitio_web">No llenes este campo</label>
            <input
              id="sitio_web"
              name="sitio_web"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={formData.sitio_web}
              onChange={(e) => setFormData({ ...formData, sitio_web: e.target.value })}
            />
          </div>

          <div>
            <label
              htmlFor="contacto-nombre"
              className="block text-sm text-tinta mb-2"
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
              className="block text-sm text-tinta mb-2"
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
              className="block text-sm text-tinta mb-2"
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
              className="mt-1 h-4 w-4 shrink-0 accent-acento"
            />
            <label
              htmlFor="contacto-consent"
              className="text-tinta-suave text-xs leading-relaxed"
            >
              Acepto la{" "}
              <Link
                href="/privacidad"
                className="text-acento underline hover:opacity-80"
              >
                política de privacidad
              </Link>{" "}
              y el tratamiento de mis datos para responder a esta solicitud.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-acento text-white py-4 rounded-xl font-semibold hover:opacity-80 transition disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar mensaje 🚀"}
          </button>
        </form>

        {success && (
          <div className="bg-green-50 border border-green-500 p-4 rounded-lg mt-6">
            <p className="text-green-700">
              ✅ ¡Mensaje enviado correctamente! Te responderé en menos de 24 horas.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 p-4 rounded-lg mt-6">
            <p className="text-red-700">
              ❌ {error} Si prefieres, escríbeme directamente a wilson.arroyo12@gmail.com
            </p>
          </div>
        )}

        <div className="mt-10 bg-superficie p-6 rounded-xl border border-acento/30">
          <h2 className="text-lg font-semibold mb-2">
            ¿Prefieres hablarlo en vivo?
          </h2>
          <p className="text-tinta text-sm mb-4">
            Agenda una llamada de 15 minutos: revisamos qué necesitas, si te
            puedo ayudar y qué sigue. Sin compromiso.
          </p>
          <AgendarLlamada ubicacion="contacto" />
        </div>

        <div className="mt-10 pt-6 border-t border-borde">
          <h3 className="text-lg font-semibold mb-3">También puedes contactarme directamente:</h3>
          <p className="text-tinta-suave">📧 wilson.arroyo12@gmail.com</p>
          <p className="text-tinta-suave">💬 WhatsApp: +57 301 2821174</p>
        </div>
      </section>
    </main>
  );
}
