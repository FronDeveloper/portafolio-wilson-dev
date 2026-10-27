"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaCookieBite } from "react-icons/fa";
import {
  getConsent,
  onOpenConsentSettings,
  setConsent,
} from "@/lib/analytics/consent";

/**
 * Banner de cookies: analítica apagada por defecto.
 * "Solo necesarias" mantiene el sitio funcionando sin GA4/Meta.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Se muestra solo si aún no hay una decisión guardada.
    setVisible(getConsent() === null);
    return onOpenConsentSettings(() => setVisible(true));
  }, []);

  if (!visible) return null;

  const decidir = (value: "granted" | "denied") => {
    setConsent(value);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Preferencias de cookies"
      aria-live="polite"
      className="fixed z-[65] bottom-24 left-4 right-4 sm:left-24 sm:right-24 md:bottom-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-full md:max-w-xl"
    >
      <div className="bg-[#111] border border-[#C2B280]/40 rounded-2xl shadow-2xl shadow-black/60 p-5">
        <div className="flex items-start gap-3">
          <FaCookieBite className="text-[#C2B280] text-xl mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-white text-sm font-semibold mb-1">
              Cookies y analítica
            </p>
            <p className="text-gray-300 text-xs leading-relaxed">
              Uso cookies propias para que el sitio funcione y, si me das
              permiso, analítica (Google Analytics y Meta) para entender qué
              contenido sirve. Puedes cambiar tu elección cuando quieras.{" "}
              <Link
                href="/privacidad#cookies"
                className="text-[#C2B280] underline hover:text-[#d4c69a]"
              >
                Ver política
              </Link>
            </p>

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                type="button"
                onClick={() => decidir("granted")}
                className="flex-1 bg-[#C2B280] hover:bg-[#d4c69a] text-black font-semibold text-xs py-2.5 px-4 rounded-lg transition"
              >
                Aceptar analítica
              </button>
              <button
                type="button"
                onClick={() => decidir("denied")}
                className="flex-1 border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold text-xs py-2.5 px-4 rounded-lg transition"
              >
                Solo necesarias
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
