import type { Metadata } from "next";

// Panel privado: fuera de índices y buscadores
export const metadata: Metadata = {
  title: "Panel privado — Propuestas",
  robots: { index: false, follow: false, nocache: true },
};

export default function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
