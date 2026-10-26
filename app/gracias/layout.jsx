// /gracias es una página de conversión post-formulario: no debe
// aparecer en Google ni competir con la home. Por eso noindex.
export const metadata = {
  title: "¡Gracias! Tu solicitud quedó registrada",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GraciasLayout({ children }) {
  return children;
}
