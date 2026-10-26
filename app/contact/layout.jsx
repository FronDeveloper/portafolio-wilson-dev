// Metadata de /contact — el page.jsx de esta ruta es client component,
// por eso vive aquí (los layouts server sí pueden exportar metadata).
export const metadata = {
  title: "Contacto — Respuesta en menos de 24 horas",
  description:
    "Escríbele a Wilson Valencia sobre tu proyecto: formulario directo, WhatsApp o correo. Respuesta garantizada en menos de 24 horas hábiles.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contacto — Respuesta en menos de 24 horas",
    description:
      "Cuéntale a Wilson Valencia tu proyecto: formulario directo, WhatsApp o correo. Respuesta en menos de 24h.",
    url: "/contact",
  },
};

export default function ContactLayout({ children }) {
  return children;
}
