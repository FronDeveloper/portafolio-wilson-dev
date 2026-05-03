"use client";

export default function WhatsAppButton() {
  const phone = "573012821174"; // 🔁 
  const message = "Hola, vi tu portafolio y me interesa trabajar contigo";

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 text-sm rounded-full shadow-lg hover:scale-110 transition z-50"
      
    >
      WhatsApp
    </a>
  );
}