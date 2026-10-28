"use client";

import { usePathname } from "next/navigation";

/**
 * Envuelve los widgets del sitio público (chat, WhatsApp, cookies,
 * analítica) y los oculta en las zonas privadas:
 *
 *  - /proyecto/...  portal del cliente (no debe parecer la home)
 *  - /panel/...     administración de Wilson (no se rastrea al dueño)
 */
export default function SoloSitioPublico({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  if (pathname.startsWith("/proyecto") || pathname.startsWith("/panel")) {
    return null;
  }
  return <>{children}</>;
}
