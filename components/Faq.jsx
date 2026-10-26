/**
 * Faq — Preguntas frecuentes + FAQPage schema.org
 * ============================================================
 * Dos misiones:
 *  1. CONVERSIÓN: responde las objeciones (precio, plazo,
 *     soporte, pagos) justo antes del CTA final de la home.
 *  2. SEO: su markup <details> deja el texto en el HTML para
 *     el crawler, y el schema FAQPage hace elegible la página
 *     para desplegables enriquecidos en resultados de Google
 *     (búsquedas tipo "cuánto cuesta una página web en Colombia").
 *
 * Server component (sin "use client") — el acordeón es el
 * <details> nativo del navegador: cero JS, cero costo.
 *
 * Montaje: en app/page.jsx, entre la sección de precios y el
 * CTA final:
 *   import Faq from "@/components/Faq";
 *   <Faq />
 * ============================================================
 */

import { FaChevronDown, FaWhatsapp } from "react-icons/fa";

const FAQS = [
  {
    q: "¿Cuánto cuesta una página web en Colombia?",
    a: "Depende del alcance: una landing page profesional parte desde $1.200.000 COP (entrega en 5-7 días), una tienda online desde $3.200.000 COP (3-4 semanas) y una aplicación a medida desde $6.000.000 COP (6-8 semanas). Cada proyecto se cotiza según tus necesidades y recibes la propuesta en menos de 24 horas, sin compromiso.",
  },
  {
    q: "¿Cuánto tarda el desarrollo de mi proyecto?",
    a: "Una landing page está lista en 5-7 días, un e-commerce en 3-4 semanas y una aplicación a medida en 6-8 semanas. El plazo exacto va confirmado en tu propuesta escrita, y durante el desarrollo ves avances reales, no promesas.",
  },
  {
    q: "¿Qué incluye el soporte post-lanzamiento?",
    a: "Todos los planes incluyen soporte: 1 mes en landing pages, 3 meses en e-commerce y 6 meses en aplicaciones a medida. Cubre correcciones, ajustes menores y acompañamiento mientras tu proyecto arranca. Después puedes contratar mantenimiento si lo necesitas.",
  },
  {
    q: "¿Puedo recibir pagos con Wompi, PSE o Efecty?",
    a: "Sí. Integro las pasarelas colombianas que tu negocio necesite: Wompi, PSE, Efecty y también Stripe para ventas internacionales. Tu tienda queda lista para cobrar desde el primer día, con panel de administración incluido.",
  },
  {
    q: "¿Trabajas solo con clientes de Colombia?",
    a: "No. Trabajo 100% remoto con clientes de cualquier país. La comunicación es directa por WhatsApp o videollamada, y para clientes internacionales los precios se manejan en USD con el mismo estándar de calidad y entrega.",
  },
  {
    q: "¿Qué necesito para empezar?",
    a: "Solo una conversación. Cuéntame tu idea por WhatsApp o por el formulario de cotización, y en menos de 24 horas recibes una propuesta inicial con alcance, plazo e inversión claros. No necesitas tener nada técnico resuelto: de eso me encargo yo.",
  },
];

export default function Faq() {
  // Schema FAQPage — espejo exacto de las preguntas de arriba,
  // para que Google pueda mostrar los desplegables en resultados.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <section id="faq" className="px-8 md:px-20 py-16 max-w-4xl mx-auto">
      {/* Datos estructurados (no se renderiza visualmente) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold mb-3">
          Preguntas{" "}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            frecuentes
          </span>
        </h2>
        <p className="text-gray-500 text-sm">
          Lo que todos preguntan antes de arrancar un proyecto. Si te queda
          alguna duda, la resolvemos hoy mismo.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group bg-[#111] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-colors"
          >
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 text-sm md:text-base font-semibold text-gray-200 [&::-webkit-details-marker]:hidden">
              <span>{f.q}</span>
              <FaChevronDown className="text-violet-400 text-xs flex-shrink-0 transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <p className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">
              {f.a}
            </p>
          </details>
        ))}
      </div>

      {/* CTA de cierre */}
      <div className="text-center mt-8">
        <a
          href="https://wa.me/573012821174?text=Hola%20Wilson%2C%20tengo%20una%20pregunta%20sobre%20tu%20servicio%20%F0%9F%98%8A"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-violet-400 transition-colors"
        >
          <FaWhatsapp className="text-[#25D366]" />
          ¿Otra duda? Escríbeme por WhatsApp y la resuelvo hoy mismo
        </a>
      </div>
    </section>
  );
}
