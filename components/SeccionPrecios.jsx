"use client";

/**
 * SeccionPrecios — "Inversión transparente"
 * ============================================================
 * Los planes y precios vienen de lib/pricing.ts (fuente única).
 * Detecta Colombia por zona horaria y muestra COP; el visitante
 * puede cambiar a USD manualmente.
 * ============================================================
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MANTENIMIENTO,
  PLANES,
  formatearCOP,
  formatearUSD,
  precioMantenimiento,
} from "@/lib/pricing";

const esColombia = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    return tz === "America/Bogota";
  } catch {
    return false;
  }
};

export default function SeccionPrecios() {
  // El primer render (servidor y cliente) muestra USD para no romper la
  // hidratación; después de hidratar cambia a COP si está en Colombia.
  const [moneda, setMoneda] = useState("USD");

  useEffect(() => {
    if (esColombia()) setMoneda("COP");
  }, []);

  const precio = (plan) =>
    moneda === "COP"
      ? `${formatearCOP(plan.desde.cop)} COP`
      : `${formatearUSD(plan.desde.usd)} USD`;

  return (
    <section
      id="precios"
      className="px-8 md:px-20 py-16 max-w-6xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-semibold mb-3">
            Inversión{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              transparente
            </span>
          </h2>
          <p className="text-gray-400 text-sm max-w-xl">
            Precios base orientativos. Cada proyecto se cotiza según
            necesidades, sin letras pequeñas.
          </p>
        </div>

        <div
          className="inline-flex self-start sm:self-auto rounded-lg border border-gray-700 overflow-hidden text-xs"
          role="group"
          aria-label="Moneda de los precios"
        >
          {["COP", "USD"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMoneda(m)}
              aria-pressed={moneda === m}
              className={`px-3 py-2 font-semibold transition ${
                moneda === m
                  ? "bg-[#C2B280] text-black"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLANES.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-xl p-6 border transition-all duration-300 flex flex-col ${
              plan.destacado
                ? "bg-gradient-to-b from-violet-600/10 to-cyan-600/5 border-violet-500/50 shadow-lg shadow-violet-500/10 relative"
                : "bg-[#111] border-gray-800 hover:border-gray-600"
            }`}
          >
            {plan.destacado && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                RECOMENDADO
              </span>
            )}
            <h3 className="font-bold text-white text-lg mb-1">{plan.nombre}</h3>
            <p className="text-gray-400 text-xs mb-4">{plan.sub}</p>
            <p className="text-3xl font-extrabold mb-1">
              <span
                className={
                  plan.destacado
                    ? "bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
                    : "text-white"
                }
              >
                desde {precio(plan)}
              </span>
            </p>
            <p className="text-gray-400 text-xs mb-5">
              {plan.plazo} · soporte {plan.soporteMeses}{" "}
              {plan.soporteMeses === 1 ? "mes" : "meses"}
            </p>
            <ul className="space-y-2 mb-6 flex-1">
              {plan.incluye.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-gray-300 text-xs"
                >
                  <span
                    className={
                      plan.destacado ? "text-violet-400" : "text-green-400"
                    }
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={`/cotizar?tipo=${plan.id}`}
              className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition ${
                plan.destacado
                  ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:opacity-90"
                  : "border border-gray-700 hover:border-violet-500 hover:text-violet-400"
              }`}
            >
              Solicitar cotización
            </Link>
          </div>
        ))}
      </div>

      {/* Mantenimiento: plan mensual opcional */}
      <div className="mt-6 bg-[#111] border border-[#C2B280]/30 rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <h3 className="font-bold text-white text-lg mb-1">
            {MANTENIMIENTO.nombre}{" "}
            <span className="text-[#C2B280] text-sm font-semibold">
              · desde {precioMantenimiento(moneda)}
            </span>
          </h3>
          <p className="text-gray-400 text-sm mb-3">{MANTENIMIENTO.sub}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
            {MANTENIMIENTO.incluye.map((f) => (
              <li key={f} className="text-gray-300 text-xs flex items-center gap-1.5">
                <span className="text-[#C2B280]" aria-hidden="true">
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/cotizar?tipo=mantenimiento"
          className="shrink-0 text-center px-6 py-3 border border-[#C2B280]/50 text-[#C2B280] rounded-xl font-semibold text-sm hover:bg-[#C2B280]/10 transition"
        >
          Consultar mantenimiento
        </Link>
      </div>

      <p className="text-gray-400 text-xs text-center mt-4">
        * Precios en pesos colombianos (COP) y en dólares (USD) para clientes
        internacionales. Plazos, complejidad e integraciones pueden modificar la
        cotización. Si necesitas factura electrónica, los impuestos se
        discriminan según corresponda.
      </p>
    </section>
  );
}
