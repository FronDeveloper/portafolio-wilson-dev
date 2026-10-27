"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  getConsent,
  onConsentChange,
  type ConsentValue,
} from "@/lib/analytics/consent";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const rutasEnviadas = new Set<string>();

/**
 * PageView de Meta en cada navegación SPA.
 * - Solo con consentimiento.
 * - Espera a que fbq exista (el script se carga después de aceptar).
 * - Deduplica por ruta para no contar el mismo pageview dos veces.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setConsent(getConsent());
    return onConsentChange(setConsent);
  }, []);

  useEffect(() => {
    if (consent !== "granted") return;

    const ruta = pathname || "/";
    let cancelado = false;
    let intentos = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const intentar = () => {
      if (cancelado) return;
      if (typeof window.fbq === "function") {
        if (!rutasEnviadas.has(ruta)) {
          rutasEnviadas.add(ruta);
          window.fbq("track", "PageView");
          if (process.env.NODE_ENV === "development") {
            console.debug("[Meta Pixel] PageView:", ruta);
          }
        }
        return;
      }
      if (intentos < 40) {
        intentos += 1;
        timer = setTimeout(intentar, 100);
      }
    };

    intentar();

    return () => {
      cancelado = true;
      if (timer) clearTimeout(timer);
    };
  }, [pathname, consent]);

  return null;
}
