import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function LegalLayout({ title, updated, children }) {
  return (
    <main className="min-h-screen bg-[#0B0B0B] text-white">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition mb-8"
        >
          <FaArrowLeft aria-hidden="true" /> Volver al portafolio
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        <p className="text-gray-400 text-sm mb-10">
          Última actualización: {updated}
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-gray-300 [&_h2]:text-white [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-3 [&_h3]:text-white [&_h3]:font-semibold [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-[#C2B280] [&_a]:underline">
          {children}
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 text-xs text-gray-400">
          <p>
            ¿Dudas sobre este documento?{" "}
            <a href="mailto:wilson.arroyo12@gmail.com" className="text-[#C2B280] underline">
              wilson.arroyo12@gmail.com
            </a>{" "}
            · WhatsApp +57 301 282 1174
          </p>
        </div>
      </div>
    </main>
  );
}
