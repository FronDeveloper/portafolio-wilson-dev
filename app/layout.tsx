import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import ParticleBackground from "@/components/ParticleBackground";
import Script from "next/script";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"] });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Wilson Valencia — Desarrollador Full-Stack Freelance en Colombia",
    template: "%s | Wilson Valencia Dev",
  },
  description:
    "Desarrollador full-stack freelance en Colombia. Construyo sistemas de gestión empresarial, e-commerce y dashboards con Next.js, TypeScript y Supabase. Cotización en menos de 24h.",
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
  authors: [{ name: "Wilson Valencia", url: "https://wvalencia-dev.vercel.app" }],
  creator: "Wilson Valencia",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://wvalencia-dev.vercel.app/",
    siteName: "Wilson Valencia Dev",
    title: "Wilson Valencia — Desarrollador Full-Stack Freelance en Colombia",
    description:
      "Construyo sistemas de gestión, e-commerce y dashboards con Next.js y Supabase. Soluciones a medida para empresas colombianas. Disponible para proyectos.",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Wilson Valencia — Desarrollador Full-Stack Freelance en Colombia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wilson Valencia — Desarrollador Full-Stack Freelance en Colombia",
    description:
      "Construyo sistemas de gestión, e-commerce y dashboards con Next.js y Supabase. Disponible para proyectos.",
    images: ["/preview.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://wvalencia-dev.vercel.app/",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className={`${inter.className} min-h-full flex flex-col relative bg-[#0B0B0B]`}
      >
        <ParticleBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
        <WhatsAppButton />
        <ScrollToTop />
      </body>
      {/* Google Analytics 4 — Measurement ID: G-09M3XYKZ1L */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-09M3XYKZ1L`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-09M3XYKZ1L');
        `}
      </Script>
    </html>
  );
}