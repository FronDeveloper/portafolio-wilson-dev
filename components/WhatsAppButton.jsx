"use client";

import { FaWhatsapp } from "react-icons/fa";
import { trackMetaEvent } from "@/lib/analytics/meta-events";

export default function WhatsAppButton() {
  const phone = "573012821174";
  const message = "Hola, vi tu portafolio y me interesa trabajar contigo";

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  const handleClick = () => {
    trackMetaEvent("Contact", {
      content_name: "Click botón WhatsApp flotante",
      content_category: "Contact",
      status: "whatsapp_clicked",
    });
  };

  return (
    <a
      href={url}
      target="_blank"
      onClick={handleClick}
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:scale-110 hover:bg-green-400 transition z-50 flex items-center justify-center group"
    >
      <FaWhatsapp className="text-2xl" />
      <span className="hidden md:inline ml-2 text-sm font-semibold pr-2">WhatsApp</span>

      <span className="md:hidden absolute right-full mr-3 bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
        ¿Hablamos?
      </span>

      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20 pointer-events-none" />
    </a>
  );
}
