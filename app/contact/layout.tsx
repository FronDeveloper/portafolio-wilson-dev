import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto — Cotiza tu proyecto web",
  description:
    "¿Necesitas un sistema de gestión, e-commerce o aplicación web? Escríbeme y recibe una propuesta en menos de 24 horas. Desarrollador full-stack freelance en Colombia.",
  keywords: [
    "contratar desarrollador web colombia",
    "cotizar desarrollo de software colombia",
    "programador freelance disponible colombia",
    "desarrollo web a medida cotización",
  ],
  openGraph: {
    images: ["/opengraph-image"],
    title: "Contacto — Cotiza tu proyecto web",
    description:
      "Cuéntame tu idea y recibe una propuesta en menos de 24 horas. Desarrollo web a medida en Colombia.",
    url: "/contact",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}