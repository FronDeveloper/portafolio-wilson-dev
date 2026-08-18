"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Componente que dispara PageView automáticamente en cada navegación SPA.
 *
 * VERSIÓN SIMPLIFICADA: solo usa usePathname (no useSearchParams)
 * para evitar conflictos con prerender estático de Next.js.
 */
export function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window.fbq === "function") {
        window.fbq("track", "PageView");
      }

      if (process.env.NODE_ENV === "development") {
        console.debug("[Meta Pixel] PageView:", pathname);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
