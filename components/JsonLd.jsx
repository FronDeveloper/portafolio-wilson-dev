/**
 * JsonLd — Datos estructurados schema.org (JSON-LD)
 * ============================================================
 * Server component. Se monta una vez en app/layout.tsx.
 * Precios y servicios salen de lib/pricing.ts.
 * ============================================================
 */

import {
  CONTACT_EMAIL,
  MANTENIMIENTO,
  PLANES,
  SITE_URL,
  WHATSAPP_PHONE,
  formatearCOP,
  formatearUSD,
} from "@/lib/pricing";

const DESCRIPCIONES = {
  landing:
    "Landing page o sitio institucional responsive con SEO básico, formulario de contacto y entrega en 5-7 días.",
  ecommerce:
    "Tienda online con catálogo, carrito, panel de administración e integración de pasarelas de pago según el país y la cuenta del cliente.",
  saas: "Sistema de gestión, SaaS, dashboard o app a medida con panel administrativo, base de datos propia, roles y despliegue incluido.",
};

const TELEFONO = `+${WHATSAPP_PHONE}`;

export default function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
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
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#persona`,
        name: "Wilson Valencia",
        url: `${SITE_URL}/`,
        image: `${SITE_URL}/profile.jpg`,
        jobTitle: "Desarrollador Full-Stack Freelance",
        description:
          "Desarrollador full-stack freelance en Colombia. Sistemas de gestión, SaaS, e-commerce y aplicaciones web con Next.js, TypeScript y Supabase.",
        email: `mailto:${CONTACT_EMAIL}`,
        sameAs: [
          "https://github.com/FronDeveloper",
          "https://www.linkedin.com/in/wilson-valencia-939069408/",
        ],
        knowsAbout: [
          "Next.js",
          "React",
          "TypeScript",
          "Node.js",
          "Supabase",
          "PostgreSQL",
          "Flutter",
          "E-commerce",
          "Integración de pasarelas de pago",
          "WordPress",
          "Desarrollo de software a medida",
        ],
        worksFor: { "@id": `${SITE_URL}/#servicio` },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#servicio`,
        name: "Wilson Valencia Dev",
        url: `${SITE_URL}/`,
        image: `${SITE_URL}/preview.png`,
        description:
          "Desarrollo de software a medida en Colombia: landing pages, tiendas online, SaaS y sistemas de gestión. Cotización en menos de 24 horas.",
        email: CONTACT_EMAIL,
        telephone: TELEFONO,
        priceRange: `${formatearCOP(PLANES[0].desde.cop)} - ${formatearCOP(
          PLANES[2].desde.cop
        )} COP · ${formatearUSD(PLANES[0].desde.usd)} - ${formatearUSD(
          PLANES[2].desde.usd
        )} USD`,
        areaServed: [
          { "@type": "Country", name: "Colombia" },
          { "@type": "Place", name: "Clientes internacionales (remoto)" },
        ],
        address: { "@type": "PostalAddress", addressCountry: "CO" },
        availableLanguage: ["es", "en"],
        founder: { "@id": `${SITE_URL}/#persona` },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: TELEFONO,
          email: CONTACT_EMAIL,
          availableLanguage: ["Spanish", "English"],
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Servicios de desarrollo web y móvil",
          itemListElement: [
            ...PLANES.flatMap((plan) => [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: plan.nombre,
                  description: DESCRIPCIONES[plan.id],
                },
                priceCurrency: "COP",
                price: plan.desde.cop,
                description: `Precio base desde ${formatearCOP(
                  plan.desde.cop
                )} COP. El valor final depende del alcance.`,
                priceSpecification: {
                  "@type": "PriceSpecification",
                  priceCurrency: "COP",
                  minPrice: plan.desde.cop,
                  valueAddedTaxIncluded: false,
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: plan.nombre,
                  description: DESCRIPCIONES[plan.id],
                },
                priceCurrency: "USD",
                price: plan.desde.usd,
                description: `Precio base desde ${formatearUSD(
                  plan.desde.usd
                )} USD. El valor final depende del alcance.`,
                priceSpecification: {
                  "@type": "PriceSpecification",
                  priceCurrency: "USD",
                  minPrice: plan.desde.usd,
                  valueAddedTaxIncluded: false,
                },
              },
            ]),
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: MANTENIMIENTO.nombre,
                description:
                  "Mantenimiento mensual: actualizaciones, copias de seguridad, monitoreo, corrección de errores y soporte prioritario.",
              },
              priceCurrency: "COP",
              price: MANTENIMIENTO.desde.cop,
              description: `Desde ${formatearCOP(
                MANTENIMIENTO.desde.cop
              )} COP por mes.`,
              priceSpecification: {
                "@type": "PriceSpecification",
                priceCurrency: "COP",
                minPrice: MANTENIMIENTO.desde.cop,
                unitText: "mes",
              },
            },
          ],
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
