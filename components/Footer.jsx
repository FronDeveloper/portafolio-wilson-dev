import Link from "next/link";
import Wordmark from "./Wordmark";
import { BRAND } from "@/lib/brand";

export default function Footer() {
  return (
    <footer className="border-t border-borde mt-20 px-8 md:px-20 py-10 text-tinta">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-tinta">
              <Wordmark tamano={26} className="text-lg font-bold" />
            </p>
            <p className="text-xs text-tinta-suave">
              © {new Date().getFullYear()} {BRAND.founder}. Todos los derechos
              reservados.
            </p>
          </div>

          <nav
            aria-label="Enlaces del pie de página"
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm"
          >
            <Link href="/projects" className="hover:text-acento transition">
              Proyectos
            </Link>
            <Link href="/cotizar" className="hover:text-acento transition">
              Cotizar
            </Link>
            <Link href="/contact" className="hover:text-acento transition">
              Contacto
            </Link>
            <Link href="/testimonios" className="hover:text-acento transition">
              Deja tu testimonio
            </Link>
            <a
              href="https://github.com/FronDeveloper"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-acento transition"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/wilson-valencia-939069408/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-acento transition"
            >
              LinkedIn
            </a>
            <a
              href="mailto:wilson.arroyo12@gmail.com"
              className="hover:text-acento transition"
            >
              Email
            </a>
          </nav>
        </div>

        <div className="flex flex-wrap justify-center md:justify-between items-center gap-x-6 gap-y-2 text-xs text-tinta-suave border-t border-borde/70 pt-4">
          <p>
            Precios base orientativos. La cotización final depende del alcance.
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link href="/privacidad" className="hover:text-acento transition">
              Política de privacidad
            </Link>
            <Link href="/privacidad#cookies" className="hover:text-acento transition">
              Cookies
            </Link>
            <Link href="/terminos" className="hover:text-acento transition">
              Términos y condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
