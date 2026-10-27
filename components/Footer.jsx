import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-20 px-8 md:px-20 py-10 text-gray-300">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Wilson Valencia. Todos los derechos
            reservados.
          </p>

          <nav
            aria-label="Enlaces del pie de página"
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm"
          >
            <Link href="/projects" className="hover:text-[#C2B280] transition">
              Proyectos
            </Link>
            <Link href="/cotizar" className="hover:text-[#C2B280] transition">
              Cotizar
            </Link>
            <Link href="/contact" className="hover:text-[#C2B280] transition">
              Contacto
            </Link>
            <Link href="/testimonios" className="hover:text-[#C2B280] transition">
              Deja tu testimonio
            </Link>
            <a
              href="https://github.com/FronDeveloper"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C2B280] transition"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/wilson-valencia-939069408/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C2B280] transition"
            >
              LinkedIn
            </a>
            <a
              href="mailto:wilson.arroyo12@gmail.com"
              className="hover:text-[#C2B280] transition"
            >
              Email
            </a>
          </nav>
        </div>

        <div className="flex flex-wrap justify-center md:justify-between items-center gap-x-6 gap-y-2 text-xs text-gray-400 border-t border-gray-800/70 pt-4">
          <p>
            Precios base orientativos. La cotización final depende del alcance.
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link href="/privacidad" className="hover:text-[#C2B280] transition">
              Política de privacidad
            </Link>
            <Link href="/privacidad#cookies" className="hover:text-[#C2B280] transition">
              Cookies
            </Link>
            <Link href="/terminos" className="hover:text-[#C2B280] transition">
              Términos y condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
