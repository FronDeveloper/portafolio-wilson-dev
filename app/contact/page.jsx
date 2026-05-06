"use client";

import Navbar from "@/components/Navbar";
import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // Auto-cerrar mensajes después de 5 segundos
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(false);

    emailjs
      .sendForm(
        "service_u8ctv7s",
        "template_1cjn64d",
        form.current,
        "0wAS9_LUxKjlO7Yst"
      )
      .then(() => {
        setLoading(false);
        setSuccess(true);
        form.current.reset();
      })
      .catch((error) => {
        console.error("Error al enviar:", error);
        setLoading(false);
        setError(true);
      });
  };

  return (
    <main className="bg-[#0B0B0B] text-white min-h-screen">
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

        <form ref={form} onSubmit={sendEmail} className="flex flex-col gap-6">
          <input
            type="text"
            name="user_name"
            placeholder="Tu nombre"
            required
            disabled={loading}
            className="bg-[#111] border border-gray-800 p-4 rounded-xl outline-none focus:border-[#C2B280] transition"
          />

          <input
            type="email"
            name="user_email"
            placeholder="Tu email"
            required
            disabled={loading}
            className="bg-[#111] border border-gray-800 p-4 rounded-xl outline-none focus:border-[#C2B280] transition"
          />

          <textarea
            name="message"
            placeholder="Cuéntame sobre tu proyecto..."
            rows="5"
            required
            disabled={loading}
            className="bg-[#111] border border-gray-800 p-4 rounded-xl outline-none focus:border-[#C2B280] transition"
          />

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
              ❌ Error al enviar el mensaje. Por favor, escríbeme directamente a wilson.arroyo12@gmail.com
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