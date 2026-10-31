"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { BRAND } from "@/lib/brand";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-black/60 border-b border-gray-800">
      
      <div className="relative flex justify-between items-center px-6 md:px-20 py-4">

        {/* LOGO */}
        <Link
          href="/"
          aria-label={`${BRAND.name} — inicio`}
          className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none flex items-center gap-2.5"
        >
          <Logo size={38} />
          <span className="hidden sm:inline text-lg font-bold tracking-tight text-white">
            {BRAND.name}
          </span>
        </Link>

        {/* MENÚ DESKTOP */}
        <div className="hidden md:flex gap-8 text-sm ml-auto">
          <Link href="/">Inicio</Link>
          <Link href="/about">Sobre mí</Link>
          <Link href="/projects">Proyectos</Link>
          <Link href="/contact">Contacto</Link>
        </div>

        {/* BOTÓN MOBILE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white text-2xl ml-auto"
        >
          {open ? "✕" : "☰"}
        </button>

      </div>

      {/* MENU MOBILE */}
      {open && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4 text-sm bg-black/90">
          <Link href="/" onClick={() => setOpen(false)}>Inicio</Link>
          <Link href="/about" onClick={() => setOpen(false)}>Sobre mí</Link>
          <Link href="/projects" onClick={() => setOpen(false)}>Proyectos</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>Contacto</Link>
        </div>
      )}

    </nav>
  );
}