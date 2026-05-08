import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import ParticleBackground from "@/components/ParticleBackground";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wilson | Desarrollador Web",
  description:
    "Desarrollo sitios web modernos, ecommerce y aplicaciones enfocadas en resultados",
  openGraph: {
    title: "Wilson Dev",
    description: "Portafolio profesional de desarrollo web",
    url: "https://portafolio-wilson-dev.vercel.app",
    siteName: "Wilson Dev",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  keywords: [
    "desarrollador web freelancer",
    "crear página web",
    "ecommerce colombia",
    "desarrollador next.js",
    "programador freelance bogotá",
    "tienda online profesional"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://portafolio-wilson-dev.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className={`${inter.className} min-h-full flex flex-col relative bg-[#0B0B0B]`}>
        {/* Fondo animado con partículas */}
        <ParticleBackground />
        
        {/* Contenido principal */}
        {children}
        
        {/* Botones flotantes */}
        <WhatsAppButton />
        <ScrollToTop />
      </body>
    </html>
  );
}