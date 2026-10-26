"use client";

/**
 * SeccionPrecios — "Inversión transparente" con moneda automática
 * ============================================================
 * Detecta si el visitante está en Colombia por su zona horaria
 * (America/Bogota) y muestra:
 *   - Colombia        → precios en COP ($1.200.000 / $3.2M / $6M)
 *   - Resto del mundo → precios en USD ($300 / $800 / $1.500)
 *
 * ¿Por qué zona horaria y no geo-IP? Es instantánea, funciona
 * offline, sin servicios externos ni límites, y acierta el caso
 * real (Colombia vs internacional) prácticamente siempre.
 *
 * Sin hydration mismatch: el primer render (servidor y cliente)
 * muestra USD, y para visitantes colombianos cambia a COP justo
 * después de hidratar — imperceptible.
 *
 * Montaje: en app/page.jsx, reemplaza TODO el <section> de
 * "Inversión transparente" (el bloque {/* PRECIOS *\/}) por:
 *   import SeccionPrecios from "@/components/SeccionPrecios";
 *   <SeccionPrecios />
 * ============================================================
 */

import { useEffect, useState } from "react";
import Link from "next/link";

const PLANES = [
  {
    title: "Landing Page",
    sub: "Ideal para empezar tu presencia online",
    usd: 300,
    cop: 1200000,
    features: [
      "Diseño responsive",
      "Hasta 5 secciones",
      "Formulario de contacto",
      "SEO básico",
      "Entrega 5-7 días",
      "1 mes de soporte",
    ],
    highlight: false,
  },
  {
    title: "Ecommerce",
    sub: "Vende tus productos sin complicaciones",
    usd: 800,
    cop: 3200000,
    features: [
      "Catálogo de productos",
      "Carrito de compras",
      "Pasarela de pagos",
      "Panel de administración",
      "Optimización conversiones",
      "3 meses de soporte",
    ],
    highlight: true,
  },
  {
    title: "App a Medida",
    sub: "Soluciones personalizadas para tu negocio",
    usd: 1500,
    cop: 6000000,
    features: [
      "Desarrollo a medida",
      "Panel de administración",
      "Base de datos propia",
      "Integraciones personalizadas",
      "Despliegue incluido",
      "6 meses de soporte",
    ],
    highlight: false,
  },
];

// Formateo COP determinista (sin depender del ICU del navegador):
// 1200000 → "$1.200.000"
const formatCOP = (n) => "$" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const esColombia = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    return tz === "America/Bogota";
  } catch {
    return false;
  }
};

export default function SeccionPrecios() {
  const [colombia, setColombia] = useState(false);

  useEffect(() => {
    setColombia(esColombia());
  }, []);

  const precio = (plan) =>
    colombia ? formatCOP(plan.cop) : `$${plan.usd} USD`;

  return (
    <section className="px-8 md:px-20 py-16 max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold mb-3 text-center">
        Inversión{" "}
        <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          transparente
        </span>
      </h2>
      <p className="text-gray-500 text-center text-sm mb-10">
        Precios base orientativos. Cada proyecto se cotiza según necesidades.
        Sin letras pequeñas.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {PLANES.map((plan) => (
          <div
            key={plan.title}
            className={`rounded-xl p-6 border transition-all duration-300 ${
              plan.highlight
                ? "bg-gradient-to-b from-violet-600/10 to-cyan-600/5 border-violet-500/50 shadow-lg shadow-violet-500/10 relative"
                : "bg-[#111] border-gray-800 hover:border-gray-600"
            }`}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                RECOMENDADO
              </span>
            )}
            <h3 className="font-bold text-white text-lg mb-1">{plan.title}</h3>
            <p className="text-gray-500 text-xs mb-4">{plan.sub}</p>
            <p className="text-3xl font-extrabold mb-1">
              <span
                className={
                  plan.highlight
                    ? "bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
                    : "text-white"
                }
              >
                desde {precio(plan)}
              </span>
            </p>
            <p className="text-gray-600 text-xs mb-5">
              {colombia ? "COP · + IVA" : "USD · + IVA"}
            </p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-gray-400 text-xs"
                >
                  <span
                    className={plan.highlight ? "text-violet-400" : "text-green-400"}
                  >
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/cotizar"
              className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition ${
                plan.highlight
                  ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:opacity-90"
                  : "border border-gray-700 hover:border-violet-500 hover:text-violet-400"
              }`}
            >
              Solicitar cotización
            </Link>
          </div>
        ))}
      </div>
      <p className="text-gray-600 text-xs text-center mt-4">
        * Precios en pesos colombianos para Colombia (COP) y en USD para otros
        países. Plazos, complejidad e integraciones pueden modificar la
        cotización.
      </p>
    </section>
  );
}
