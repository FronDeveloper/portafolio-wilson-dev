"use client";

/**
 * AgendarLlamada — botón hacia la agenda pública de Cal.com
 * ============================================================
 * Abre el enlace en una pestaña nueva (nunca en la misma: el
 * visitante no debe perder el sitio) y registra el evento GA4
 * `schedule_call` con la ubicación donde se hizo clic.
 *
 * La URL vive en lib/pricing.ts (CAL_URL) para cambiarla en un
 * solo lugar cuando cambie el dominio o el slug del evento.
 * ============================================================
 */

import { FaCalendarAlt } from "react-icons/fa";
import { CAL_URL } from "@/lib/pricing";
import { trackGAEvent } from "@/lib/analytics/meta-events";

const VARIANTES = {
  primario: "bg-acento hover:bg-acento-hover text-white font-bold px-6 py-3",
  secundario:
    "border border-acento/50 text-acento hover:bg-acento/10 font-semibold px-6 py-3",
  violeta:
    "border border-acento/40 text-acento hover:bg-acento/10 font-semibold px-6 py-3",
  chat: "w-full bg-acento hover:bg-acento-hover text-white font-bold text-xs py-2.5 px-4",
};

export default function AgendarLlamada({
  ubicacion = "sitio",
  variante = "primario",
  etiqueta = "Agendar llamada de 15 min",
  className = "",
}) {
  const clases = VARIANTES[variante] || VARIANTES.primario;

  return (
    <a
      href={CAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackGAEvent("schedule_call", { ubicacion })}
      className={`inline-flex items-center justify-center gap-2 rounded-xl text-sm transition ${clases} ${className}`}
    >
      <FaCalendarAlt aria-hidden="true" />
      {etiqueta}
    </a>
  );
}
