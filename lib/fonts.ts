import { Inter, Playfair_Display } from "next/font/google";

/** Fuente base del sitio. */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/** Fuente de titulares (hero y acentos editoriales). */
export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-playfair",
});
