"use client";

import Navbar from "@/components/Navbar";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const form = useRef();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    emailjs
      .sendForm(
        "service_u8ctv7s",     // 🔁 REEMPLAZA
        "template_1cjn64d",    // 🔁 REEMPLAZA
        form.current,
        "0wAS9_LUxKjlO7Yst"      // 🔁 REEMPLAZA
      )
      .then(() => {
        setLoading(false);
        setSuccess(true);
        form.current.reset();
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        alert("Error al enviar ❌");
      });
  };

  return (
    <main className="bg-[#0B0B0B] text-white min-h-screen">
      <Navbar />

      <section className="px-8 md:px-20 py-20 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-10">
          Contáctame
        </h1>

        <p className="text-gray-400 mb-10">
          ¿Tienes una idea o proyecto? Escríbeme y trabajemos juntos.
        </p>

        <p className="text-gray-400 mb-6">
          Respondo en menos de 24 horas. Cuéntame sobre tu proyecto.
        </p>

        <form
          ref={form}
          onSubmit={sendEmail}
          className="flex flex-col gap-6"
        >
          <input
            type="text"
            name="user_name"
            placeholder="Tu nombre"
            required
            disabled={loading}
            className="bg-[#111] border border-gray-800 p-4 rounded-xl outline-none"
          />

          <input
            type="email"
            name="user_email"
            placeholder="Tu email"
            required
            disabled={loading}
            className="bg-[#111] border border-gray-800 p-4 rounded-xl outline-none"
          />

          <textarea
            name="message"
            placeholder="Cuéntame sobre tu proyecto..."
            rows="5"
            required
            disabled={loading}
            className="bg-[#111] border border-gray-800 p-4 rounded-xl outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-[#C2B280] text-black py-3 rounded-xl font-semibold hover:opacity-80 transition disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar mensaje 🚀"}
          </button>
        </form>

        {/* ✅ Mensaje de éxito */}
        {success && (
          <p className="text-green-400 mt-6">
            ✅ Mensaje enviado correctamente. Te responderé pronto.
          </p>
        )}

        {/* 📩 Info adicional */}
        <div className="mt-10 text-gray-400">
          <p>Email: wilson.arroyo12@gmail.com</p>
          <p>WhatsApp: +57 301 2821174</p>
        </div>
      </section>
    </main>
  );
}