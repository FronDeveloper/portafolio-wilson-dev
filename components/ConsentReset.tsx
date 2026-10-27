"use client";

import { useEffect, useState } from "react";
import {
  getConsent,
  onConsentChange,
  openConsentSettings,
  type ConsentValue,
} from "@/lib/analytics/consent";

export function ConsentReset() {
  const [consent, setConsent] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setConsent(getConsent());
    return onConsentChange(setConsent);
  }, []);

  const estado =
    consent === "granted"
      ? "Analítica aceptada"
      : consent === "denied"
      ? "Solo cookies necesarias"
      : "Sin decisión guardada";

  return (
    <div className="not-prose flex flex-col sm:flex-row sm:items-center gap-3 bg-[#111] border border-gray-800 rounded-xl p-4 my-4 text-sm">
      <p className="flex-1 text-gray-300">
        Estado actual:{" "}
        <span className="text-white font-medium">{estado}</span>
      </p>
      <button
        type="button"
        onClick={openConsentSettings}
        className="shrink-0 px-4 py-2 rounded-lg bg-[#C2B280] text-black font-semibold text-xs hover:bg-[#d4c69a] transition"
      >
        Cambiar preferencia
      </button>
    </div>
  );
}
