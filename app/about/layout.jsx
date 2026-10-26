import type { Metadata } from "next";

// Metadata de /about — el page.jsx de esta ruta es client component,
// por eso vive aquí (los layouts server sí pueden exportar metadata).
export const metadata: Metadata = {
  title: "Sobre mí — Desarrollador Full-Stack Freelance en Colombia",
  description:
    "Conoce a Wilson Valencia: desarrollador full-stack freelance en Colombia. Next.js, TypeScript, Supabase y Flutter. Código propio, comunicación directa y entrega puntual.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Sobre mí — Desarrollador Full-Stack Freelance en Colombia",
    description:
      "Conoce a Wilson Valencia: desarrollador full-stack freelance en Colombia. Código propio, comunicación directa y entrega puntual.",
    url: "/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
