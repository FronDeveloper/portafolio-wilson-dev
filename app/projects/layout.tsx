import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proyectos — Portafolio de desarrollo web | Wilson Valencia",
  description:
    "Explora mis proyectos: sistemas de gestión empresarial, e-commerce con pasarelas colombianas, dashboards con IA y apps móviles. Todos construidos con Next.js, TypeScript y Supabase.",
  keywords: [
    "portafolio desarrollador web colombia",
    "proyectos next.js supabase",
    "ejemplos desarrollo software colombia",
    "sistema de gestión next.js",
    "ecommerce next.js colombia",
  ],
  openGraph: {
    title: "Proyectos — Wilson Valencia Dev",
    description:
      "Sistemas de gestión, e-commerce, dashboards con IA y apps móviles. Proyectos reales con Next.js, TypeScript y Supabase.",
    url: "https://wvalencia-dev.vercel.app/projects",
  },
  alternates: {
    canonical: "https://wvalencia-dev.vercel.app/projects",
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}