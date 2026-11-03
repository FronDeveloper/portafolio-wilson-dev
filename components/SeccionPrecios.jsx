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
  HORA_EXTRA,
  PLANES,
  PLANES_MANTENIMIENTO,
  formatearCOP,
  formatearUSD,
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
            <span className="bg-gradient-to-r from-acento to-acento bg-clip-text text-transparent">
              transparente
            </span>
          </h2>
          <p className="text-tinta-suave text-sm max-w-xl">
            Precios base orientativos. Cada proyecto se cotiza según
            necesidades, sin letras pequeñas.
          </p>
        </div>

        <div
          className="inline-flex self-start sm:self-auto rounded-lg border border-borde overflow-hidden text-xs"
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
                  ? "bg-acento text-white"
                  : "text-tinta hover:bg-fondo"
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
                ? "bg-gradient-to-b from-acento-hover/10 to-acento-hover/5 border-acento/50 shadow-lg shadow-acento/20 relative"
                : "bg-superficie border-borde hover:border-borde-fuerte"
            }`}
          >
            {plan.destacado && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-acento-hover to-acento-hover text-white text-[10px] font-bold px-3 py-1 rounded-full">
                RECOMENDADO
              </span>
            )}
            <h3 className="font-bold text-tinta text-lg mb-1">{plan.nombre}</h3>
            <p className="text-tinta-suave text-xs mb-4">{plan.sub}</p>
            <p className="text-3xl font-extrabold mb-1">
              <span
                className={
                  plan.destacado
                    ? "bg-gradient-to-r from-acento to-acento bg-clip-text text-transparent"
                    : "text-tinta"
                }
              >
                desde {precio(plan)}
              </span>
            </p>
            <p className="text-tinta-suave text-xs mb-5">
              {plan.plazo} · soporte {plan.soporteMeses}{" "}
              {plan.soporteMeses === 1 ? "mes" : "meses"}
            </p>
            <ul className="space-y-2 mb-6 flex-1">
              {plan.incluye.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-tinta text-xs"
                >
                  <span
                    className={
                      plan.destacado ? "text-acento" : "text-green-700"
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
                  ? "bg-gradient-to-r from-acento-hover to-acento-hover text-white hover:opacity-90"
                  : "border border-borde hover:border-acento hover:text-acento"
              }`}
            >
              Solicitar cotización
            </Link>
          </div>
        ))}
      </div>

      {/* Mantenimiento: 3 planes mensuales aprobados */}
      <div className="mt-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
          <h3 className="text-xl font-semibold text-tinta">
            Mantenimiento{" "}
            <span className="text-acento">mensual</span>
          </h3>
          <p className="text-tinta-suave text-xs">
            Hora adicional fuera de plan: {formatearCOP(HORA_EXTRA.cop)} COP /{" "}
            {formatearUSD(HORA_EXTRA.usd)} USD
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANES_MANTENIMIENTO.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl p-6 border flex flex-col ${
                plan.destacado
                  ? "border-acento/50 bg-gradient-to-b from-acento/10 to-transparent shadow-lg shadow-acento/20"
                  : "bg-superficie border-borde hover:border-borde-fuerte"
              }`}
            >
              {plan.destacado && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-acento text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  MÁS ELEGIDO
                </span>
              )}
              <h4 className="font-bold text-tinta text-base mb-1">
                {plan.nombre}
              </h4>
              <p className="text-tinta-suave text-xs mb-4">{plan.sub}</p>
              <p className="text-2xl font-extrabold text-tinta mb-1">
                {precio(plan)}
                <span className="text-sm text-tinta-suave font-normal">/mes</span>
              </p>
              <p className="text-tinta-suave text-[11px] mb-4">
                Incluye {plan.horas} h/mes · respuesta en {plan.respuesta}
              </p>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.incluye.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-tinta text-xs"
                  >
                    <span
                      className="text-acento mt-0.5"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/cotizar?tipo=mantenimiento"
                className="block text-center py-2.5 rounded-xl font-semibold text-sm border border-acento/50 text-acento hover:bg-acento/10 transition"
              >
                Consultar mantenimiento
              </Link>
            </div>
          ))}
        </div>
      </div>

      <p className="text-tinta-suave text-xs text-center mt-4">
        * Precios en pesos colombianos (COP) y en dólares (USD) para clientes
        internacionales. Plazos, complejidad e integraciones pueden modificar la
        cotización. Si necesitas factura electrónica, los impuestos se
        discriminan según corresponda.
      </p>
    </section>
  );
}
