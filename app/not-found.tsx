import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaArrowRight, FaCompass } from "react-icons/fa";

export const metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="text-white min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-xl text-center">
          <FaCompass className="text-[#C2B280] text-5xl mx-auto mb-6" aria-hidden="true" />
          <p className="text-sm font-semibold tracking-widest text-[#C2B280] mb-2">
            ERROR 404
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Esta página no existe o cambió de lugar
          </h1>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Puede que el enlace esté incompleto. Vuelve al inicio, revisa los
            casos de estudio o cuéntame tu proyecto y te respondo en menos de 24
            horas.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition"
            >
              Ir al inicio <FaArrowRight aria-hidden="true" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-700 text-gray-200 font-semibold hover:border-violet-500 hover:text-violet-300 transition"
            >
              Ver proyectos
            </Link>
            <Link
              href="/cotizar"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-700 text-gray-200 font-semibold hover:border-violet-500 hover:text-violet-300 transition"
            >
              Cotizar
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
