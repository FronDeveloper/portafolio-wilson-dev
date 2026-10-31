import type { Metadata } from "next";

// Página de utilidad (formulario): fuera de buscadores
export const metadata: Metadata = {
  title: "Deja tu testimonio",
  description:
    "¿Trabajaste con Wilson Valencia? Deja tu testimonio sobre tu experiencia con su servicio de desarrollo web y software a medida.",
  robots: { index: false, follow: true },
};

export default function TestimoniosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
