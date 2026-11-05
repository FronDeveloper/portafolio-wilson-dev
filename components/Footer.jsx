import Link from "next/link";
import Wordmark from "./Wordmark";
import { BRAND } from "@/lib/brand";

/**
 * Footer sobre ancla navy: cierra la página con el mismo lenguaje del hero
 * (portadas de redes). La línea superior lleva el gradiente de marca.
 */
export default function Footer() {
  return (
    <footer className="superficie-navy mt-20 text-texto-claro">
      <div className="linea-gradiente" aria-hidden="true" />
      <div className="px-8 md:px-20 py-10">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className="text-texto-claro">
                <Wordmark tamano={26} className="text-lg font-bold" />
              </p>
              <p className="text-xs text-texto-claro-suave">
                © {new Date().getFullYear()} {BRAND.founder}. Todos los derechos
                reservados.
              </p>
            </div>

            <nav
              aria-label="Enlaces del pie de página"
              className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm"
            >
              <Link href="/projects" className="text-texto-claro-suave hover:text-white transition">
                Proyectos
              </Link>
              <Link href="/cotizar" className="text-texto-claro-suave hover:text-white transition">
                Cotizar
              </Link>
              <Link href="/ventachat" className="text-texto-claro-suave hover:text-white transition">
                VentaChat
              </Link>
              <Link href="/costo-tienda-online-colombia" className="text-texto-claro-suave hover:text-white transition">
                Guía de precios
              </Link>
              <Link href="/contact" className="text-texto-claro-suave hover:text-white transition">
                Contacto
              </Link>
              <Link href="/testimonios" className="text-texto-claro-suave hover:text-white transition">
                Deja tu testimonio
              </Link>
              <a
                href="https://github.com/FronDeveloper"
                target="_blank"
                rel="noopener noreferrer"
                className="text-texto-claro-suave hover:text-white transition"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/wilson-valencia-939069408/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-texto-claro-suave hover:text-white transition"
              >
                LinkedIn
              </a>
              <a
                href="mailto:wilson.arroyo12@gmail.com"
                className="text-texto-claro-suave hover:text-white transition"
              >
                Email
              </a>
            </nav>
          </div>

          <div className="flex flex-wrap justify-center md:justify-between items-center gap-x-6 gap-y-2 text-xs text-texto-claro-suave/80 border-t border-white/10 pt-4">
            <p>
              Precios base orientativos. La cotización final depende del alcance.
            </p>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              <Link href="/privacidad" className="hover:text-white transition">
                Política de privacidad
              </Link>
              <Link href="/privacidad#cookies" className="hover:text-white transition">
                Cookies
              </Link>
              <Link href="/terminos" className="hover:text-white transition">
                Términos y condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
