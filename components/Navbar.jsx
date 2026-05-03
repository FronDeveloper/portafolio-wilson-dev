"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-black/60 border-b border-gray-800">
  
  <div className="flex justify-between items-center px-8 md:px-20 py-4">
    
    {/* LOGO */}
    <Link href="/" className="flex items-center">
      <Image
        src="/logo.png"
        alt="Wilson logo"
        width={55}
        height={55}
        className="object-contain"
      />
    </Link>

    {/* MENÚ */}
    <div className="flex gap-6 text-sm">
      <Link href="/" className="hover:text-[#C2B280]">Inicio</Link>
      <Link href="/about" className="hover:text-[#C2B280]">Sobre mí</Link>
      <Link href="/projects" className="hover:text-[#C2B280]">Proyectos</Link>
      <Link href="/contact" className="hover:text-[#C2B280]">Contacto</Link>
    </div>

  </div>

</nav>
  );
}