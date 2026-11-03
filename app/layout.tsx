import type { Metadata, Viewport } from "next";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatWidget from "@/components/ChatWidget";
import ScrollToTop from "@/components/ScrollToTop";
import JsonLd from "@/components/JsonLd";
import { MetaPixel } from "@/components/MetaPixel";
import { Analytics } from "@/components/Analytics";
import { ConsentBanner } from "@/components/ConsentBanner";
import SoloSitioPublico from "@/components/SoloSitioPublico";
import { inter, playfair } from "@/lib/fonts";
import { SITE_URL } from "@/lib/pricing";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} — Desarrollo de software a la medida en Colombia`,
    template: `%s | ${BRAND.name}`,
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
    siteName: BRAND.name,
    title: `${BRAND.name} — Desarrollo de software a la medida en Colombia`,
    description:
      "Construyo sistemas de gestión, SaaS, e-commerce y dashboards con Next.js y Supabase. Soluciones a medida para empresas colombianas. Disponible para proyectos.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — Desarrollo de software a la medida en Colombia`,
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
  manifest: "/site.webmanifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0F294E",
  colorScheme: "light",
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
        className={`${inter.className} min-h-full flex flex-col relative bg-fondo text-tinta`}
      >
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-acento focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold"
        >
          Saltar al contenido
        </a>

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
