/**
 * JsonLd — Datos estructurados schema.org (JSON-LD)
 * ============================================================
 * Le dice a Google EXACTAMENTE quién es Wilson, qué servicios
 * vende y a qué precios, para aparecer con rich results
 * (tarjetas enriquecidas) en las búsquedas locales.
 *
 * Server component — cero JS en el cliente, cero costo de render.
 * El buscador lo lee y listo.
 *
 * Montaje (una vez): en app/layout.tsx
 *   import JsonLd from "@/components/JsonLd";
 *   ...
 *   <JsonLd />   // junto a <MetaPixel />
 * ============================================================
 */

const SITE_URL = "https://wvalencia-dev.vercel.app";

// Servicios con los precios reales del portafolio (coherentes con
// la home y con el generador de propuestas de Alma)
const SERVICIOS = [
  {
    nombre: "Landing Page / Sitio web profesional",
    descripcion:
      "Landing page o sitio institucional responsive con SEO básico, formulario de contacto y entrega en 5-7 días.",
    precio: 1200000,
  },
  {
    nombre: "E-commerce / Tienda online",
    descripcion:
      "Tienda online con catálogo, carrito, pasarelas de pago colombianas (Wompi, PSE, Efecty) y panel de administración.",
    precio: 3200000,
  },
  {
    nombre: "Aplicación web a medida",
    descripcion:
      "Sistema de gestión, SaaS o dashboard con panel administrativo, base de datos propia y despliegue incluido.",
    precio: 6000000,
  },
];

export default function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      // ---------- El sitio web ----------
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: "Wilson Valencia Dev",
        description:
          "Portafolio de Wilson Valencia, desarrollador full-stack freelance en Colombia.",
        inLanguage: "es-CO",
        publisher: { "@id": `${SITE_URL}/#persona` },
      },
      // ---------- La persona ----------
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#persona`,
        name: "Wilson Valencia",
        url: `${SITE_URL}/`,
        image: `${SITE_URL}/profile.jpg`,
        jobTitle: "Desarrollador Full-Stack Freelance",
        description:
          "Desarrollador full-stack freelance en Colombia. Sistemas de gestión, e-commerce y aplicaciones web con Next.js, TypeScript y Supabase.",
        email: "mailto:wilson.arroyo12@gmail.com",
        sameAs: ["https://github.com/FronDeveloper"],
        knowsAbout: [
          "Next.js",
          "TypeScript",
          "React",
          "Supabase",
          "Node.js",
          "Tailwind CSS",
          "Flutter",
          "E-commerce",
          "Desarrollo de software a medida",
        ],
        worksFor: { "@id": `${SITE_URL}/#servicio` },
      },
      // ---------- El servicio / negocio ----------
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#servicio`,
        name: "Wilson Valencia Dev",
        url: `${SITE_URL}/`,
        image: `${SITE_URL}/preview.png`,
        description:
          "Desarrollo de software a medida en Colombia: landing pages, tiendas online y sistemas de gestión empresarial. Cotización en menos de 24 horas.",
        email: "wilson.arroyo12@gmail.com",
        telephone: "+57 301 2821174",
        priceRange: "COP $1.200.000 - $6.000.000+",
        areaServed: {
          "@type": "Country",
          name: "Colombia",
        },
        address: {
          "@type": "PostalAddress",
          addressCountry: "CO",
        },
        availableLanguage: ["es", "en"],
        founder: { "@id": `${SITE_URL}/#persona` },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: "+57 301 2821174",
          email: "wilson.arroyo12@gmail.com",
          availableLanguage: "Spanish",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Servicios de desarrollo web y móvil",
          itemListElement: SERVICIOS.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.nombre,
              description: s.descripcion,
            },
            priceCurrency: "COP",
            price: s.precio,
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "COP",
              price: s.precio,
              valueAddedTaxIncluded: false,
            },
          })),
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
