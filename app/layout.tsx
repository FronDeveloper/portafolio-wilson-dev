import type { Metadata } from "next";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatWidget from "@/components/ChatWidget";
import ScrollToTop from "@/components/ScrollToTop";
import ParticleBackground from "@/components/ParticleBackground";
import JsonLd from "@/components/JsonLd";
import { MetaPixel } from "@/components/MetaPixel";
import { Analytics } from "@/components/Analytics";
import { ConsentBanner } from "@/components/ConsentBanner";
import SoloSitioPublico from "@/components/SoloSitioPublico";
import { inter, playfair } from "@/lib/fonts";
import { SITE_URL } from "@/lib/pricing";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pixescript — Desarrollo de software a la medida en Colombia",
    template: "%s | Pixescript",
  },
  description:
    "Desarrollo de software a la medida en Colombia: sistemas de gestión, SaaS, e-commerce y dashboards con Next.js, TypeScript y Supabase. Cotización en menos de 24h.",
  keywords: [
    "desarrollador full-stack freelance colombia",
    "programador next.js colombia",
    "desarrollo de software a medida colombia",
    "desarrollador web freelancer medellín",
    "sistemas de gestión empresarial",
    "ecommerce colombia next.js",
    "dashboard supabase colombia",
    "programador freelance colombia",
    "desarrollo web profesional colombia",
    "aplicaciones web next.js typescript",
    "software a medida para empresas colombia",
    "wilson valencia desarrollador",
  ],
  authors: [{ name: "Wilson Valencia", url: SITE_URL }],
  creator: "Wilson Valencia",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: `${SITE_URL}/`,
    siteName: "Pixescript",
    title: "Pixescript — Desarrollo de software a la medida en Colombia",
    description:
      "Construyo sistemas de gestión, SaaS, e-commerce y dashboards con Next.js y Supabase. Soluciones a medida para empresas colombianas. Disponible para proyectos.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixescript — Desarrollo de software a la medida en Colombia",
    description:
      "Construyo sistemas de gestión, SaaS, e-commerce y dashboards con Next.js y Supabase. Disponible para proyectos.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "J2D9fhF-07xUjupnLJnm7QjZMsDwrmSORoJmaVK91cA",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body
        className={`${inter.className} min-h-full flex flex-col relative bg-[#0B0B0B]`}
      >
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-[#C2B280] focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold"
        >
          Saltar al contenido
        </a>

        <ParticleBackground />

        <div id="contenido" className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>

        {/* Widgets solo para el sitio público: se ocultan en /panel y /proyecto */}
        <SoloSitioPublico>
          <WhatsAppButton />
          <ChatWidget />
          <MetaPixel />
          <Analytics />
          <ConsentBanner />
        </SoloSitioPublico>

        <ScrollToTop />

        <JsonLd />
      </body>
    </html>
  );
}
