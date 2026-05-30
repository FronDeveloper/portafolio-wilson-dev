import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre mí — Wilson Valencia | Desarrollador Full-Stack",
  description:
    "Soy Wilson Valencia, desarrollador full-stack freelance en Medellín, Colombia. Especializado en Next.js, TypeScript y Supabase. Disponible para proyectos de software a medida.",
  keywords: [
    "wilson valencia desarrollador",
    "desarrollador freelance medellín",
    "programador full-stack colombia",
    "next.js typescript supabase colombia",
    "desarrollo software freelance",
  ],
  openGraph: {
    title: "Sobre mí — Wilson Valencia | Desarrollador Full-Stack",
    description:
      "Desarrollador full-stack en Medellín. Construyo aplicaciones web a medida con Next.js, TypeScript y Supabase. Disponible para proyectos.",
    url: "https://wvalencia-dev.vercel.app/about",
  },
  alternates: {
    canonical: "https://wvalencia-dev.vercel.app/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}