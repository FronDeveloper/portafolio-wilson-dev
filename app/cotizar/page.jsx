"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPaperPlane, FaWhatsapp, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { trackMetaEvent, captureUTMParams } from "@/lib/analytics/meta-events";

const PROJECT_TYPES = [
  { value: "landing", label: "Landing Page / Sitio institucional" },
  { value: "ecommerce", label: "E-commerce / Tienda online" },
  { value: "saas", label: "SaaS / Sistema a medida" },
  { value: "app", label: "App móvil" },
  { value: "dashboard", label: "Dashboard / Panel administrativo" },
  { value: "otro", label: "Otro / No estoy seguro" },
];

const BUDGET_RANGES = [
  { value: "300-800", label: "$300 - $800 USD" },
  { value: "800-1500", label: "$800 - $1.500 USD" },
  { value: "1500-3000", label: "$1.500 - $3.000 USD" },
  { value: "3000+", label: "Más de $3.000 USD" },
  { value: "undefined", label: "No estoy seguro / Necesito asesoría" },
];

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [utmData, setUtmData] = useState({});

  useEffect(() => {
    setUtmData(captureUTMParams());
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
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        utm: utmData,
      };

      const response = await fetch("/api/cotizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        trackMetaEvent("Lead", {
          content_name: "Solicitud de cotización",
          content_category: "Portafolio Lead",
          value: 500,
          currency: "USD",
          status: "form_submitted",
        });

        setTimeout(() => {
          router.push("/gracias");
        }, 500);
      } else {
        setError("Hubo un error. Por favor intenta de nuevo o escríbeme por WhatsApp.");
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
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
            <FaArrowLeft /> Volver al portafolio
          </Link>
          <a
            href="https://wa.me/573012821174?text=Hola%20Wilson%2C%20vi%20tu%20portafolio%20y%20quiero%20cotizar%20un%20proyecto"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-lg hover:bg-green-500/20 transition"
          >
            <FaWhatsapp /> WhatsApp directo
          </a>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 px-3 py-1 rounded-full mb-4">
            <span className="text-violet-400 text-xs font-semibold">⚡ RESPUESTA EN 24 HORAS</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cotiza tu proyecto{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              sin compromiso
            </span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Cuéntame qué necesitas. En menos de 24 horas te envío una propuesta inicial con alcance, precio y tiempo de entrega.
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#111] to-[#0F0F0F] border border-gray-800 rounded-2xl p-6 md:p-10">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="¿Cómo te llamas?"
                className="w-full bg-[#0B0B0B] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                  className="w-full bg-[#0B0B0B] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  required
                  placeholder="+57 300 123 4567"
                  className="w-full bg-[#0B0B0B] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de proyecto *
              </label>
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                required
                className="w-full bg-[#0B0B0B] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition"
              >
                <option value="">Selecciona una opción</option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Presupuesto aproximado *
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                className="w-full bg-[#0B0B0B] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition"
              >
                <option value="">Selecciona un rango</option>
                {BUDGET_RANGES.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cuéntame del proyecto
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="¿Qué problema quieres resolver? ¿Qué funcionalidades necesitas? Mientras más detalle, mejor."
                className="w-full bg-[#0B0B0B] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500 transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white py-4 rounded-xl font-semibold text-sm hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Enviando..."
              ) : (
                <>
                  <FaPaperPlane /> Enviar solicitud
                </>
              )}
            </button>

            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 pt-2">
              <span className="flex items-center gap-1">
                <FaCheckCircle className="text-green-500" /> Sin compromiso
              </span>
              <span className="flex items-center gap-1">
                <FaCheckCircle className="text-green-500" /> Respuesta en 24h
              </span>
              <span className="flex items-center gap-1">
                <FaCheckCircle className="text-green-500" /> 100% confidencial
              </span>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-8">
          ¿Prefieres hablar directamente?{" "}
          <a
            href="https://wa.me/573012821174?text=Hola%20Wilson%2C%20vi%20tu%20portafolio%20y%20quiero%20cotizar%20un%20proyecto"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:underline"
          >
            Escríbeme por WhatsApp
          </a>
        </p>
      </section>
    </main>
  );
}
