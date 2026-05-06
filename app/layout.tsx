import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import AnimatedCSSBackground from "@/components/AnimatedCSSBackground"; // 👈 Importar
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

export const metadata = {
  title: "Wilson | Desarrollador Web",
  description:
    "Desarrollo sitios web modernos, ecommerce y aplicaciones enfocadas en resultados",
  openGraph: {
    title: "Wilson Dev",
    description: "Portafolio profesional de desarrollo web",
    url: "https://tudominio.com",
    siteName: "Wilson Dev",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <AnimatedCSSBackground /> {/* 👈 AGREGAR AQUÍ */}
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}