import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto — Cotiza tu proyecto web con Wilson Valencia",
  description:
    "¿Necesitas un sistema de gestión, e-commerce o aplicación web? Escríbeme y recibe una propuesta en menos de 24 horas. Desarrollador full-stack freelance en Colombia.",
  keywords: [
    "contratar desarrollador web colombia",
    "cotizar desarrollo de software colombia",
    "programador freelance disponible colombia",
    "desarrollo web a medida cotización",
  ],
  openGraph: {
    title: "Contacto — Cotiza tu proyecto con Wilson Valencia",
    description:
      "Cuéntame tu idea y recibe una propuesta en menos de 24 horas. Desarrollo web a medida en Colombia.",
    url: "https://wvalencia-dev.vercel.app/contact",
  },
  alternates: {
    canonical: "https://wvalencia-dev.vercel.app/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}