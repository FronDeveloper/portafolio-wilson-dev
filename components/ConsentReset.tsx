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
    <div className="not-prose flex flex-col sm:flex-row sm:items-center gap-3 bg-superficie border border-borde rounded-xl p-4 my-4 text-sm">
      <p className="flex-1 text-tinta">
        Estado actual:{" "}
        <span className="text-tinta font-medium">{estado}</span>
      </p>
      <button
        type="button"
        onClick={openConsentSettings}
        className="shrink-0 px-4 py-2 rounded-lg bg-acento text-white font-semibold text-xs hover:bg-acento-hover transition"
      >
        Cambiar preferencia
      </button>
    </div>
  );
}
