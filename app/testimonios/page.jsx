"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import Link from "next/link";

/**
 * /testimonios — los clientes reales de Wilson pueden dejar su opinión.
 * NADA se publica automático: el testimonio llega por correo a Wilson,
 * él lo revisa y solo se publica con su aprobación y el permiso dado.
 */

export default function TestimoniosPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    cargo: "",
    testimonio: "",
    sitio_web: "", // honeypot anti-bots
  });
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setError("");
      }, 8000);
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
      const response = await fetch("/api/testimonios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, consent }),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ nombre: "", cargo: "", testimonio: "", sitio_web: "" });
        setConsent(false);
      } else {
        const data = await response.json().catch(() => null);
        setError(data?.error || "Hubo un error. Intenta de nuevo más tarde.");
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
          Deja tu <span className="text-acento">testimonio</span>
        </h1>

        <p className="text-tinta-suave mb-4 text-lg">
          ¿Trabajaste con Wilson y quieres compartir cómo fue? Tu experiencia
          ayuda a otros empresarios a decidir con confianza.
        </p>
        <p className="text-tinta-suave text-sm mb-8">
          Nada se publica automático: Wilson revisa cada testimonio
          personalmente y solo lo publica con tu permiso y tu nombre.
        </p>

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
              htmlFor="testimonio-nombre"
              className="block text-sm text-tinta mb-2"
            >
              Tu nombre <span className="text-tinta-suave">(obligatorio)</span>
            </label>
            <input
              id="testimonio-nombre"
              type="text"
              required
              maxLength={80}
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              disabled={loading}
              className={inputClass}
              placeholder="Ej: María Gómez"
            />
          </div>

          <div>
            <label
              htmlFor="testimonio-cargo"
              className="block text-sm text-tinta mb-2"
            >
              Cargo y empresa{" "}
              <span className="text-tinta-suave">(opcional, ej: Gerente — Tienda XYZ)</span>
            </label>
            <input
              id="testimonio-cargo"
              type="text"
              maxLength={120}
              value={formData.cargo}
              onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
              disabled={loading}
              className={inputClass}
              placeholder="Ej: Gerente — Comercio XYZ"
            />
          </div>

          <div>
            <label
              htmlFor="testimonio-texto"
              className="block text-sm text-tinta mb-2"
            >
              Tu experiencia <span className="text-tinta-suave">(obligatorio)</span>
            </label>
            <textarea
              id="testimonio-texto"
              required
              rows={5}
              maxLength={800}
              value={formData.testimonio}
              onChange={(e) =>
                setFormData({ ...formData, testimonio: e.target.value })
              }
              disabled={loading}
              className={inputClass}
              placeholder="Cuéntame qué problema resolvimos, cómo fue trabajar juntos y qué resultado obtuviste..."
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              id="testimonio-consent"
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              disabled={loading}
              className="mt-1 h-4 w-4 shrink-0 accent-acento"
            />
            <label
              htmlFor="testimonio-consent"
              className="text-tinta-suave text-xs leading-relaxed"
            >
              Autorizo que mi testimonio se publique en el portafolio junto con
              mi nombre y cargo, conforme a la{" "}
              <Link
                href="/privacidad"
                className="text-acento underline hover:opacity-80"
              >
                política de privacidad
              </Link>
              . Entiendo que Wilson lo revisará antes de publicarlo.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-acento text-white py-4 rounded-xl font-semibold hover:opacity-80 transition disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar testimonio ⭐"}
          </button>
        </form>

        {success && (
          <div className="bg-green-50 border border-green-500 p-4 rounded-lg mt-6">
            <p className="text-green-700">
              ✅ ¡Gracias! Tu testimonio llegó a Wilson y lo revisará
              personalmente. Si lo publica, aparecerá en el portafolio con tu
              nombre.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 p-4 rounded-lg mt-6">
            <p className="text-red-700">❌ {error}</p>
          </div>
        )}
      </section>
    </main>
  );
}
