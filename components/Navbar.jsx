"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Wordmark from "./Wordmark";
import { BRAND } from "@/lib/brand";

const ENLACES = [
  { href: "/", label: "Inicio" },
  { href: "/about", label: "Sobre mí" },
  { href: "/projects", label: "Proyectos" },
  { href: "/ventachat", label: "VentaChat" },
  { href: "/contact", label: "Contacto" },
];

/**
 * Navbar sobre ancla navy (vidrio oscuro). Combina con el hero navy de la
 * portada y funciona también sobre las páginas claras: header oscuro +
 * cuerpo claro, como en las portadas de redes.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const ruta = usePathname();

  const esActivo = (href) =>
    href === "/" ? ruta === "/" : ruta.startsWith(href);

  return (
    <nav
      aria-label="Navegación principal"
      className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/90 backdrop-blur"
    >
      <div className="relative flex items-center justify-between px-6 py-3 md:px-20 md:py-4">
        {/* LOGO */}
        <Link
          href="/"
          aria-label={`${BRAND.name} — inicio`}
          className="absolute left-1/2 flex -translate-x-1/2 items-center md:static md:translate-x-0"
          onClick={() => setOpen(false)}
        >
          <Wordmark
            tamano={28}
            className="text-xl font-bold tracking-tight text-texto-claro md:text-[22px]"
          />
        </Link>

        {/* MENÚ DESKTOP */}
        <div className="ml-auto hidden items-center gap-7 text-sm md:flex">
          {ENLACES.map((enlace) => {
            const activo = esActivo(enlace.href);
            return (
              <Link
                key={enlace.href}
                href={enlace.href}
                aria-current={activo ? "page" : undefined}
                className={`relative transition-colors hover:text-white ${
                  activo
                    ? "font-medium text-white after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-gradient-to-r after:from-[#4c9fff] after:to-[#a78bfa] after:content-['']"
                    : "text-texto-claro-suave"
                }`}
              >
                {enlace.label}
              </Link>
            );
          })}
          <Link
            href="/cotizar"
            className="boton-gradiente rounded-full px-4 py-2 font-semibold transition hover:brightness-110"
          >
            Cotizar
          </Link>
        </div>

        {/* BOTÓN MOBILE */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-texto-claro transition-colors hover:bg-white/5 md:hidden"
        >
          <span aria-hidden="true">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* MENÚ MOBILE */}
      {open && (
        <div
          id="menu-movil"
          className="flex flex-col gap-1 border-t border-white/10 bg-navy-950 px-6 pb-6 pt-2 text-sm md:hidden"
        >
          {ENLACES.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              onClick={() => setOpen(false)}
              aria-current={esActivo(enlace.href) ? "page" : undefined}
              className={`rounded-lg px-2 py-2.5 transition-colors hover:bg-white/5 ${
                esActivo(enlace.href) ? "font-medium text-white" : "text-texto-claro-suave"
              }`}
            >
              {enlace.label}
            </Link>
          ))}
          <Link
            href="/cotizar"
            onClick={() => setOpen(false)}
            className="boton-gradiente mt-2 rounded-full px-4 py-2.5 text-center font-semibold transition hover:brightness-110"
          >
            Cotizar mi proyecto
          </Link>
        </div>
      )}
    </nav>
  );
}
