import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatearCOP, WHATSAPP_PHONE } from "@/lib/pricing";

/* ============================================================
 *  VentaChat — landing del producto (paso 2 del plan de crecimiento)
 *
 *  ⚠️ AJUSTA AQUÍ el precio mensual de VentaChat antes de publicar.
 *    Se muestra en la tarjeta de precio; todo lo demás sale solo.
 * ============================================================ */
const PRECIO_MENSUAL = { cop: 149_000, usd: 39 };

const CTA_COTIZAR =
  "/cotizar?utm_source=landing-ventachat&utm_medium=cta&utm_campaign=ventachat";

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
  "Hola Wilson, vi VentaChat y quiero probarlo con mi negocio"
)}`;

const FAQS = [
  {
    q: "¿La IA reemplaza a una persona?",
    a: "No: se encarga de las preguntas repetitivas (precios, horarios, disponibilidad, cómo comprar) y deriva la conversación a un humano cuando el caso lo necesita. Tu equipo pierde menos tiempo y ninguno de los dos pierde al cliente.",
  },
  {
    q: "¿Qué pasa si la IA no sabe responder algo?",
    a: "Tiene instrucciones claras para no inventar: si la respuesta no está en la información de tu negocio, lo dice y deriva la conversación a una persona. Además, cada conversación queda guardada para que la revises.",
  },
  {
    q: "¿Necesito WhatsApp Business o una cuenta especial?",
    a: "La configuración inicial la hago yo. Me cuentas qué información debe manejar (productos, precios, horarios, políticas) y en pocos días queda respondiendo con tus reglas.",
  },
  {
    q: "¿Cuánto tarda la configuración?",
    a: "En general queda funcionando en pocos días, según qué tan organizada esté la información de tu negocio. Antes de activarlo con tus clientes, pruebas las respuestas tú mismo.",
  },
  {
    q: "¿Cómo funciona el piloto gratis de 4 semanas?",
    a: "Lo dejo instalado y respondiendo con la información de tu negocio, sin costo. Al final me cuentas qué tal te fue: si te sirve lo mantenemos con el plan mensual, y si no, lo desactivamos sin problema.",
  },
];

export const metadata = {
  title: "VentaChat — Chatbot de WhatsApp con IA para tu negocio",
  description:
    "Tu WhatsApp responde en ~2 segundos, 24/7, con la información de tu negocio: precios, horarios y pedidos. Piloto gratis de 4 semanas y demo en vivo.",
  keywords: [
    "chatbot whatsapp para negocios",
    "bot de whatsapp con ia",
    "automatizar whatsapp pyme",
    "chatbot atención al cliente 24/7",
    "agente ia whatsapp colombia",
  ],
  alternates: { canonical: "/ventachat" },
  openGraph: {
    title: "VentaChat — Tu vendedor 24/7 en WhatsApp",
    description:
      "La IA responde a tus clientes en ~2 segundos con la información de tu negocio. Piloto gratis de 4 semanas.",
    url: "/ventachat",
    images: ["/opengraph-image"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function VentaChatLanding() {
  return (
    <>
      <Navbar />
      <main className="text-[#0F294E] min-h-screen pb-24">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* HERO */}
        <section className="px-8 md:px-20 pt-16 md:pt-24 pb-12 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#E8EFFD] border border-[#D8E1EC] px-3 py-1 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-[#1D4ED8] animate-pulse" />
            <span className="text-[#1D4ED8] text-xs font-semibold">
              Producto propio · IA aplicada a WhatsApp
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Tu WhatsApp se convierte en un vendedor que{" "}
            <span className="bg-gradient-to-r from-[#1D4ED8] to-[#60A5FA] bg-clip-text text-transparent">
              responde en ~2 segundos
            </span>
          </h1>
          <p className="mt-6 text-[#52657E] text-lg max-w-2xl mx-auto">
            VentaChat es un bot con inteligencia artificial entrenado con la
            información de tu negocio: responde precios, horarios y pedidos las
            24 horas. Y cuando el caso lo necesita, deriva la conversación a un
            humano.
          </p>

          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <Link
              href={CTA_COTIZAR}
              className="px-8 py-3 bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] text-white rounded-xl font-semibold hover:bg-[#1E40AF] transition shadow-lg shadow-blue-500/20"
            >
              Probalo con tu negocio →
            </Link>
            <Link
              href="/projects/ventachat-ai"
              className="px-8 py-3 border border-[#D8E1EC] rounded-xl font-semibold text-[#0F294E] hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition"
            >
              Ver demo en vivo
            </Link>
          </div>

          <div className="mt-10 flex gap-8 justify-center text-sm">
            {[
              { v: "~2 s", l: "Tiempo de respuesta" },
              { v: "24/7", l: "Siempre activo" },
              { v: "≈ $0", l: "Costo de la IA" },
            ].map((k) => (
              <div key={k.l}>
                <p className="text-2xl font-bold text-[#1D4ED8]">{k.v}</p>
                <p className="text-[#52657E] text-xs">{k.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="px-8 md:px-20 py-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-10 text-center">
            Cómo funciona en{" "}
            <span className="bg-gradient-to-r from-[#1D4ED8] to-[#60A5FA] bg-clip-text text-transparent">
              3 pasos
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                n: "1",
                t: "Entrenamos la IA con tu información",
                d: "Productos, precios, horarios, políticas de envío: la IA aprende de TU negocio, no responde con textos genéricos.",
              },
              {
                n: "2",
                t: "Tu WhatsApp responde solo",
                d: "Cada cliente recibe respuesta en segundos, a cualquier hora. Las conversaciones quedan guardadas para que las revises cuando quieras.",
              },
              {
                n: "3",
                t: "Cuando hace falta, deriva a un humano",
                d: "Si la pregunta es compleja o el cliente pide una persona, la conversación pasa a tu equipo con todo el contexto.",
              },
            ].map((p) => (
              <div
                key={p.n}
                className="bg-white p-6 rounded-xl border border-[#D8E1EC] hover:border-[#1D4ED8]/40 transition"
              >
                <p className="text-3xl font-bold text-[#1D4ED8] mb-3">{p.n}</p>
                <h3 className="font-semibold mb-2 text-[#0F294E]">{p.t}</h3>
                <p className="text-[#52657E] text-sm leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PARA QUIÉN */}
        <section className="px-8 md:px-20 py-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-10 text-center">
            Para negocios que{" "}
            <span className="bg-gradient-to-r from-[#1D4ED8] to-[#60A5FA] bg-clip-text text-transparent">
              viven del WhatsApp
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                t: "Tiendas y catálogos",
                d: "Responden precios y disponibilidad, y guían el pedido sin que tú estés pegado al celular.",
              },
              {
                t: "Clínicas, academias y citas",
                d: "Explican servicios y horarios, y dejan la agenda lista para confirmar.",
              },
              {
                t: "Domicilios y servicios",
                d: "Toman el pedido o la solicitud inicial y te pasan el caso listo para despachar.",
              },
            ].map((x) => (
              <div
                key={x.t}
                className="bg-[#E8EFFD]/60 p-6 rounded-xl border border-[#D8E1EC]"
              >
                <h3 className="font-semibold mb-2 text-[#0F294E]">{x.t}</h3>
                <p className="text-[#52657E] text-sm leading-relaxed">{x.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PRECIO */}
        <section className="px-8 md:px-20 py-16 max-w-5xl mx-auto">
          <div className="bg-white border border-[#D8E1EC] rounded-2xl p-10 text-center max-w-xl mx-auto shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-[#52657E] mb-3">
              Plan mensual · sin permanencia
            </p>
            <p className="text-4xl font-black text-[#0F294E]">
              {formatearCOP(PRECIO_MENSUAL.cop)}
              <span className="text-base font-semibold text-[#52657E]">
                {" "}
                COP/mes
              </span>
            </p>
            <p className="text-sm text-[#52657E] mt-1">
              ≈ ${PRECIO_MENSUAL.usd} USD/mes · configuración inicial incluida
            </p>
            <ul className="text-left text-sm text-[#52657E] mt-6 space-y-2">
              {[
                "IA entrenada con la información de tu negocio",
                "Derivación a humano con contexto de la conversación",
                "Conversaciones guardadas en base de datos",
                "Ajustes y soporte incluidos",
              ].map((i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#1D4ED8] font-bold">✓</span> {i}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href={CTA_COTIZAR}
                className="inline-block px-8 py-3 bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] text-white rounded-xl font-semibold hover:bg-[#1E40AF] transition shadow-lg shadow-blue-500/20"
              >
                Empezar con el piloto gratis →
              </Link>
              <p className="text-xs text-[#52657E] mt-3">
                4 semanas de prueba sin costo · sin tarjeta · sin permanencia
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-8 md:px-20 py-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Preguntas{" "}
            <span className="bg-gradient-to-r from-[#1D4ED8] to-[#60A5FA] bg-clip-text text-transparent">
              frecuentes
            </span>
          </h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="bg-white border border-[#D8E1EC] rounded-xl p-5"
              >
                <summary className="font-semibold text-[#0F294E] cursor-pointer">
                  {f.q}
                </summary>
                <p className="text-[#52657E] text-sm mt-3 leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="px-8 md:px-20 py-16 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#1D4ED8]/10 via-white to-[#60A5FA]/10 border border-[#D8E1EC] rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-bold mb-3 text-[#0F294E]">
              Cada cliente sin respuesta es una venta perdida
            </h2>
            <p className="text-[#52657E] mb-8 max-w-md mx-auto text-sm">
              Déjalo respondiendo esta misma semana. Cuéntame de tu negocio y
              arrancamos con el piloto gratis.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href={CTA_COTIZAR}
                className="px-8 py-3 bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] text-white rounded-xl font-semibold hover:bg-[#1E40AF] transition shadow-lg shadow-blue-500/20"
              >
                Probalo con tu negocio →
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border border-[#D8E1EC] rounded-xl font-semibold text-[#0F294E] hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition"
              >
                💬 WhatsApp directo
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
