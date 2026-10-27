/**
 * Faq — Preguntas frecuentes + FAQPage schema.org
 * ============================================================
 * Los precios salen de lib/pricing.ts para no contradecir la
 * sección de precios, las propuestas ni a Alma.
 * Server component: cero JS, <details> nativo.
 * ============================================================
 */

import { FaChevronDown, FaWhatsapp } from "react-icons/fa";
import {
  CAPACIDADES_PAGO,
  HORA_EXTRA,
  PLANES_MANTENIMIENTO,
  PLAN_POR_ID,
  SOPORTE_NOTA,
  formatearCOP,
  formatearUSD,
} from "@/lib/pricing";

const LANDING = PLAN_POR_ID.landing;
const ECOMMERCE = PLAN_POR_ID.ecommerce;
const SAAS = PLAN_POR_ID.saas;

const FAQS = [
  {
    q: "¿Cuánto cuesta una página web en Colombia?",
    a: `Depende del alcance: una landing page profesional parte desde ${formatearCOP(
      LANDING.desde.cop
    )} COP (entrega en ${LANDING.plazo}), una tienda online desde ${formatearCOP(
      ECOMMERCE.desde.cop
    )} COP (${ECOMMERCE.plazo}) y un SaaS o aplicación a medida desde ${formatearCOP(
      SAAS.desde.cop
    )} COP (${SAAS.plazo}). Cada proyecto se cotiza según tus necesidades y recibes la propuesta en menos de 24 horas, sin compromiso.`,
  },
  {
    q: "¿Cuánto tarda el desarrollo de mi proyecto?",
    a: `Una landing page está lista en ${LANDING.plazo}, un e-commerce en ${ECOMMERCE.plazo} y un SaaS o app a medida en ${SAAS.plazo}. El plazo exacto se confirma en tu propuesta escrita, y durante el desarrollo ves avances reales.`,
  },
  {
    q: "¿Qué incluye el soporte post-lanzamiento?",
    a: `${SOPORTE_NOTA} Después puedes contratar uno de los tres planes de mantenimiento: ${PLANES_MANTENIMIENTO.map(
      (m) =>
        `${m.nombre} (${formatearCOP(m.desde.cop)} COP/${formatearUSD(
          m.desde.usd
        )} USD al mes, con ${m.horas} hora${m.horas === 1 ? "" : "s"} incluidas)`
    ).join(
      ", "
    )}. Hora adicional fuera de plan: ${formatearCOP(HORA_EXTRA.cop)} COP (${formatearUSD(
      HORA_EXTRA.usd
    )} USD).`,
  },
  {
    q: "¿Puedo recibir pagos con Wompi, PSE, Efecty o Stripe?",
    a: `${CAPACIDADES_PAGO.resumen} ${CAPACIDADES_PAGO.proceso} El proveedor final depende del país y de la cuenta que uses; por eso lo confirmamos antes de implementar. ${CAPACIDADES_PAGO.limite}`,
  },
  {
    q: "¿Trabajas solo con clientes de Colombia?",
    a: `No. Trabajo 100% remoto con clientes de cualquier país. La comunicación es directa por WhatsApp o videollamada, y para clientes internacionales los precios se manejan en USD (desde ${formatearUSD(
      LANDING.desde.usd
    )} USD una landing), con el mismo estándar de calidad y entrega.`,
  },
  {
    q: "¿Qué necesito para empezar?",
    a: "Solo una conversación. Cuéntame tu idea por WhatsApp o por el formulario de cotización, y en menos de 24 horas recibes una propuesta inicial con alcance, plazo e inversión claros. No necesitas tener nada técnico resuelto: de eso me encargo yo.",
  },
];

export default function Faq() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="px-8 md:px-20 py-16 max-w-4xl mx-auto">
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
        <p className="text-gray-400 text-sm">
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
            <p className="px-5 pb-5 text-gray-300 text-sm leading-relaxed">
              {f.a}
            </p>
          </details>
        ))}
      </div>

      <div className="text-center mt-8">
        <a
          href="https://wa.me/573012821174?text=Hola%20Wilson%2C%20tengo%20una%20pregunta%20sobre%20tu%20servicio%20%F0%9F%98%8A"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-violet-400 transition-colors"
        >
          <FaWhatsapp className="text-[#25D366]" />
          ¿Otra duda? Escríbeme por WhatsApp y la resuelvo hoy mismo
        </a>
      </div>
    </section>
  );
}
