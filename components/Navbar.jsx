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
  { href: "/contact", label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const ruta = usePathname();

  const esActivo = (href) =>
    href === "/" ? ruta === "/" : ruta.startsWith(href);

  return (
    <nav
      aria-label="Navegación principal"
      className="sticky top-0 z-50 border-b border-borde bg-superficie/85 backdrop-blur"
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
            className="text-xl font-bold tracking-tight text-tinta md:text-[22px]"
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
                className={`transition-colors hover:text-acento ${
                  activo ? "font-medium text-acento" : "text-tinta"
                }`}
              >
                {enlace.label}
              </Link>
            );
          })}
          <Link
            href="/cotizar"
            className="rounded-full bg-acento px-4 py-2 font-semibold text-white transition-colors hover:bg-acento-hover"
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
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-tinta transition-colors hover:bg-tinta/5 md:hidden"
        >
          <span aria-hidden="true">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* MENÚ MOBILE */}
      {open && (
        <div
          id="menu-movil"
          className="flex flex-col gap-1 border-t border-borde bg-superficie px-6 pb-6 pt-2 text-sm md:hidden"
        >
          {ENLACES.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              onClick={() => setOpen(false)}
              aria-current={esActivo(enlace.href) ? "page" : undefined}
              className={`rounded-lg px-2 py-2.5 transition-colors hover:bg-tinta/5 ${
                esActivo(enlace.href) ? "font-medium text-acento" : "text-tinta"
              }`}
            >
              {enlace.label}
            </Link>
          ))}
          <Link
            href="/cotizar"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-acento px-4 py-2.5 text-center font-semibold text-white transition-colors hover:bg-acento-hover"
          >
            Cotizar mi proyecto
          </Link>
        </div>
      )}
    </nav>
  );
}
