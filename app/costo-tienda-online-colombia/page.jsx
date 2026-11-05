import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  PLANES,
  PLANES_MANTENIMIENTO,
  formatearCOP,
  WHATSAPP_PHONE,
} from "@/lib/pricing";

/* ============================================================
 *  Página SEO comercial: "cuánto cuesta una tienda online en Colombia"
 *  Los precios salen de lib/pricing.ts — si cambian ahí, cambian aquí.
 * ============================================================ */

const CTA_COTIZAR =
  "/cotizar?utm_source=seo-tienda-online&utm_medium=pagina&utm_campaign=tienda-online-precio";

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
  "Hola Wilson, vi la guía de precios y quiero cotizar una tienda online"
)}`;

const FACTORES = [
  "Cantidad de productos y categorías que vas a manejar",
  "Pasarela de pago (Wompi, PSE, Efecty, tarjetas) y si requiere cuenta de producción",
  "Panel de administración para gestionar pedidos e inventario tú mismo",
  "Diseño personalizado o plantilla base adaptada",
  "Envíos, notificaciones por WhatsApp/email y demás automatizaciones",
];

const FAQS = [
  {
    q: "¿Por qué unas agencias cobran $500.000 y otras $10.000.000?",
    a: "Porque no venden lo mismo. Por $500.000 normalmente obtienes una plantilla básica sin pasarela de pago real ni panel de administración. Una tienda que sí cobra en línea, gestiona inventario y recibe pedidos es otro producto: requiere desarrollo, pruebas de pago y soporte. Compara siempre qué incluye el precio, no solo el número.",
  },
  {
    q: "¿El dominio y el hosting están incluidos?",
    a: "El desarrollo incluye la preparación y despliegue de tu tienda. El dominio (que se compra aparte, suele costar entre $30.000 y $60.000 COP al año) queda a tu nombre y es tuyo. El hosting moderno en plataformas como Vercel arranca gratuito para este tipo de proyectos.",
  },
  {
    q: "¿Cuánto se demora una tienda online?",
    a: "Una tienda completa, entre 3 y 4 semanas según el alcance: catálogo, pasarela, panel de administración y pruebas de pago. Una landing para validar el negocio puede estar lista en una semana.",
  },
  {
    q: "¿Puedo empezar con algo más económico y crecer después?",
    a: "Sí. Una estrategia común es arrancar con una landing que reciba pedidos por WhatsApp para validar demanda, y migrar a la tienda completa cuando las ventas lo justifiquen. Lo importante es que la estructura no se pierda al escalar.",
  },
  {
    q: "¿Qué pasarelas de pago puedo integrar?",
    a: "Las colombianas: Wompi, PSE y Efecty, además de tarjetas de débito y crédito. Si vendes al exterior, Stripe, PayPal o Mercado Pago. La pasarela se elige según tu cuenta bancaria y tu tipo de cliente.",
  },
  {
    q: "¿Qué pasa después del lanzamiento?",
    a: "Los planes incluyen soporte gratuito post-lanzamiento (1 a 3 meses según el proyecto). Después puedes contratar mantenimiento mensual desde " +
      formatearCOP(PLANES_MANTENIMIENTO[0].desde.cop) +
      " COP/mes para actualizaciones, copias de seguridad y cambios de contenido.",
  },
];

export const metadata = {
  title: "¿Cuánto cuesta una tienda online en Colombia? Precios reales",
  description:
    "Guía de precios para crear una tienda online en Colombia: qué incluye cada nivel, pasarelas Wompi/PSE/Efecty, plazos reales y cómo cotizar en menos de 24 horas.",
  keywords: [
    "cuanto cuesta una tienda online en colombia",
    "precio tienda online colombia",
    "crear tienda online colombia",
    "tienda virtual precio colombia",
    "ecommerce colombia precio",
    "desarrollo tienda online wompi pse",
  ],
  alternates: { canonical: "/costo-tienda-online-colombia" },
  openGraph: {
    title: "¿Cuánto cuesta una tienda online en Colombia?",
    description:
      "Precios reales, qué incluye cada nivel y qué hace variar el costo. Cotización en menos de 24 horas.",
    url: "/costo-tienda-online-colombia",
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

export default function CostoTiendaOnline() {
  const [landing, ecommerce, saas] = PLANES;

  return (
    <>
      <Navbar />
      <main className="text-[#0F294E] min-h-screen pb-24">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* HERO */}
        <section className="px-8 md:px-20 pt-16 md:pt-24 pb-12 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            ¿Cuánto cuesta una{" "}
            <span className="bg-gradient-to-r from-[#1D4ED8] to-[#60A5FA] bg-clip-text text-transparent">
              tienda online en Colombia?
            </span>
          </h1>
          <p className="mt-6 text-[#52657E] text-lg">
            Respuesta corta: una tienda que realmente cobra en línea con
            pasarela, panel de pedidos e inventario arranca en{" "}
            <strong className="text-[#0F294E]">
              {formatearCOP(ecommerce.desde.cop)} COP
            </strong>{" "}
            (≈ ${ecommerce.desde.usd} USD) y queda lista en 3–4 semanas. Por
            debajo de eso, lo que se ofrece suele ser una plantilla sin
            pasarela de pago real. Aquí tienes el desglose completo.
          </p>
        </section>

        {/* NIVELES DE PRECIO */}
        <section className="px-8 md:px-20 py-12 max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-10 text-center">
            Qué puedes construir{" "}
            <span className="bg-gradient-to-r from-[#1D4ED8] to-[#60A5FA] bg-clip-text text-transparent">
              según tu presupuesto
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {PLANES.map((p) => (
              <div
                key={p.id}
                className={`bg-white p-6 rounded-xl border ${
                  p.destacado
                    ? "border-[#1D4ED8] shadow-lg shadow-blue-500/10"
                    : "border-[#D8E1EC]"
                }`}
              >
                {p.destacado && (
                  <p className="text-[10px] font-bold uppercase tracking-wide text-white bg-[#1D4ED8] inline-block px-2 py-0.5 rounded-full mb-3">
                    La tienda completa
                  </p>
                )}
                <h3 className="font-semibold text-[#0F294E]">{p.nombre}</h3>
                <p className="text-2xl font-bold text-[#1D4ED8] mt-2">
                  desde {formatearCOP(p.desde.cop)}
                  <span className="text-sm font-semibold text-[#52657E]">
                    {" "}
                    COP
                  </span>
                </p>
                <p className="text-xs text-[#52657E] mt-1">
                  ≈ ${p.desde.usd} USD · entrega en {p.plazo}
                </p>
                <ul className="text-sm text-[#52657E] mt-4 space-y-1.5">
                  {p.incluye.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[#1D4ED8] font-bold">✓</span> {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#52657E] mt-6">
            Son precios base ("desde"): el valor final depende del alcance que
            definamos juntos. {landing.nombre} y {saas.nombre} cubren otros
            momentos del negocio.
          </p>
        </section>

        {/* QUÉ HACE VARIAR EL PRECIO */}
        <section className="px-8 md:px-20 py-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Qué hace variar{" "}
            <span className="bg-gradient-to-r from-[#1D4ED8] to-[#60A5FA] bg-clip-text text-transparent">
              el precio final
            </span>
          </h2>
          <div className="bg-white border border-[#D8E1EC] rounded-xl p-8">
            <ul className="space-y-3 text-[#52657E] text-sm">
              {FACTORES.map((f) => (
                <li key={f} className="flex gap-3">
                  <span className="text-[#1D4ED8] font-bold">→</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* PASARELAS */}
        <section className="px-8 md:px-20 py-12 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Pasarelas de pago{" "}
            <span className="bg-gradient-to-r from-[#1D4ED8] to-[#60A5FA] bg-clip-text text-transparent">
              colombianas
            </span>
          </h2>
          <p className="text-[#52657E] max-w-2xl mx-auto mb-6">
            Tu tienda puede cobrar con las pasarelas que tus clientes ya usan.
            La integración se hace en entorno de pruebas primero y se acompaña
            la puesta en producción con tu cuenta.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Wompi", "PSE", "Efecty", "Tarjetas débito/crédito", "Stripe", "Mercado Pago"].map(
              (p) => (
                <span
                  key={p}
                  className="bg-[#E8EFFD] text-[#1D4ED8] text-sm font-semibold px-4 py-2 rounded-full border border-[#D8E1EC]"
                >
                  {p}
                </span>
              )
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="px-8 md:px-20 py-12 max-w-3xl mx-auto">
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
              ¿Hablamos de tu tienda?
            </h2>
            <p className="text-[#52657E] mb-3 max-w-md mx-auto text-sm">
              Cuéntame qué vendes y te doy una cotización clara en menos de 24
              horas, sin compromiso.
            </p>
            <p className="text-[#0F294E] text-sm font-semibold mb-8">
              💡 Y si ya tienes un sitio: te grabo un video de 5 minutos con 3
              mejoras concretas — gratis.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href={CTA_COTIZAR}
                className="px-8 py-3 bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] text-white rounded-xl font-semibold hover:bg-[#1E40AF] transition shadow-lg shadow-blue-500/20"
              >
                Cotizar mi tienda →
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
