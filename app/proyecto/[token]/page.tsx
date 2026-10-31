import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ETIQUETA_HITO,
  ETIQUETA_PROYECTO,
  obtenerConfigPagos,
  obtenerProyectoPorToken,
  type EstadoHito,
  type EstadoProyecto,
} from "@/lib/proyectos-db";
import { CONTACT_EMAIL, SITE_HOST, WHATSAPP_PHONE } from "@/lib/pricing";

/**
 * /proyecto/[token] — Portal privado del cliente.
 *
 * Wilson crea el proyecto en /panel/proyectos y comparte el enlace.
 * El cliente ve avances, hitos y el estado de sus pagos. El token es
 * la única credencial: por eso la página es noindex y no se enlaza
 * desde el sitio público.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Seguimiento de tu proyecto",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

const COLOR_ESTADO: Record<EstadoProyecto, string> = {
  en_progreso: "bg-[#C2B280]/15 text-[#C2B280] border-[#C2B280]/40",
  en_revision: "bg-blue-500/15 text-blue-300 border-blue-500/40",
  pausado: "bg-yellow-500/15 text-yellow-300 border-yellow-500/40",
  entregado: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
};

const ICONO_HITO: Record<EstadoHito, string> = {
  completado: "✓",
  en_curso: "◐",
  pendiente: "○",
};

const COLOR_HITO: Record<EstadoHito, string> = {
  completado: "text-emerald-400 border-emerald-500/60 bg-emerald-500/10",
  en_curso: "text-[#C2B280] border-[#C2B280]/60 bg-[#C2B280]/10",
  pendiente: "text-gray-400 border-gray-700 bg-[#151515]",
};

function dinero(monto: number, moneda: string): string {
  try {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: moneda || "COP",
      maximumFractionDigits: 0,
    }).format(monto);
  } catch {
    return `${moneda} ${monto.toLocaleString("es-CO")}`;
  }
}

function fechaLegible(valor: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return "";
  const d = new Date(`${valor}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!token || token.length < 10 || token.length > 80) notFound();

  const proyecto = await obtenerProyectoPorToken(token);
  if (!proyecto) notFound();

  const config = await obtenerConfigPagos();

  const totalHitos = proyecto.hitos.length;
  const completados = proyecto.hitos.filter((h) => h.estado === "completado").length;
  const progreso =
    totalHitos > 0 ? Math.round((completados / totalHitos) * 100) : 0;

  const pagado = proyecto.pagos
    .filter((p) => p.estado === "pagado")
    .reduce((acc, p) => acc + p.monto, 0);
  const pendiente = proyecto.pagos
    .filter((p) => p.estado === "pendiente")
    .reduce((acc, p) => acc + p.monto, 0);
  const saldo =
    proyecto.valorTotal > 0 ? Math.max(0, proyecto.valorTotal - pagado) : pendiente;

  const hayTransferencia = Boolean(
    config.banco || config.numeroCuenta || config.titular
  );
  const whatsapp = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    `Hola Wilson, te escribo por el proyecto "${proyecto.nombre}" 👋`
  )}`;

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-white">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        {/* Marca */}
        <div className="flex items-center justify-between gap-3 mb-10">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            title="Wilson Valencia — inicio"
          >
            <span className="w-9 h-9 rounded-lg bg-[#C2B280] text-black font-extrabold text-sm flex items-center justify-center">
              WV
            </span>
            <span className="text-sm font-semibold text-white group-hover:text-[#C2B280] transition">
              Wilson Valencia
            </span>
          </Link>
          <span className="text-[11px] text-gray-400 border border-gray-800 rounded-full px-3 py-1">
            Portal del cliente
          </span>
        </div>

        {/* Encabezado del proyecto */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${
                COLOR_ESTADO[proyecto.estado]
              }`}
            >
              {ETIQUETA_PROYECTO[proyecto.estado]}
            </span>
            {proyecto.tipo ? (
              <span className="text-[11px] text-gray-400 border border-gray-800 rounded-full px-3 py-1">
                {proyecto.tipo}
              </span>
            ) : null}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-2">
            {proyecto.nombre}
          </h1>
          <p className="text-gray-400 text-sm">
            Preparado para{" "}
            <span className="text-gray-200 font-medium">{proyecto.cliente}</span>
            {proyecto.fechaInicio
              ? ` · inicio ${fechaLegible(proyecto.fechaInicio)}`
              : ""}
            {proyecto.fechaEntrega
              ? ` · entrega estimada ${fechaLegible(proyecto.fechaEntrega)}`
              : ""}
          </p>
          {proyecto.descripcion ? (
            <p className="text-gray-400 text-sm leading-relaxed mt-4 max-w-2xl whitespace-pre-wrap">
              {proyecto.descripcion}
            </p>
          ) : null}
        </header>

        {/* Progreso */}
        {totalHitos > 0 && (
          <section
            aria-label="Progreso del proyecto"
            className="bg-[#111] border border-gray-800 rounded-2xl p-5 sm:p-6 mb-6"
          >
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <h2 className="text-sm font-semibold text-white">Avance del proyecto</h2>
              <span className="text-2xl font-extrabold text-[#C2B280]">
                {progreso}%
              </span>
            </div>
            <div
              className="h-2.5 rounded-full bg-[#1f1f1f] overflow-hidden"
              role="progressbar"
              aria-valuenow={progreso}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${completados} de ${totalHitos} etapas completadas`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#C2B280] to-[#e0d3a8] transition-all"
                style={{ width: `${progreso}%` }}
              />
            </div>
            <p className="text-gray-400 text-xs mt-2.5">
              {completados} de {totalHitos} etapas completadas
            </p>
          </section>
        )}

        {/* Hitos / línea de tiempo */}
        <section aria-labelledby="hitos-titulo" className="mb-8">
          <h2 id="hitos-titulo" className="text-lg font-semibold mb-4">
            Etapas del proyecto
          </h2>

          {totalHitos === 0 ? (
            <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 text-center">
              <p className="text-gray-400 text-sm">
                Aún no hay etapas publicadas. Wilson las irá agregando a medida
                que avance el trabajo.
              </p>
            </div>
          ) : (
            <ol className="space-y-0">
              {proyecto.hitos.map((hito, i) => {
                const ultimo = i === proyecto.hitos.length - 1;
                return (
                  <li key={hito.id} className="flex gap-4">
                    {/* Línea + círculo */}
                    <div className="flex flex-col items-center shrink-0">
                      <span
                        className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold ${
                          COLOR_HITO[hito.estado]
                        }`}
                        aria-hidden="true"
                      >
                        {ICONO_HITO[hito.estado]}
                      </span>
                      {!ultimo && (
                        <span
                          className="w-px flex-1 bg-gray-800 my-1"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className={`pb-6 min-w-0 ${ultimo ? "pb-0" : ""}`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-white text-sm font-semibold">
                          {hito.titulo}
                        </p>
                        <span className="text-[10px] uppercase tracking-wide text-gray-400">
                          {ETIQUETA_HITO[hito.estado]}
                        </span>
                      </div>
                      {hito.descripcion ? (
                        <p className="text-gray-400 text-xs leading-relaxed mt-1">
                          {hito.descripcion}
                        </p>
                      ) : null}
                      {hito.fecha ? (
                        <p className="text-gray-400 text-[11px] mt-1.5">
                          {fechaLegible(hito.fecha)}
                        </p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        {/* Pagos */}
        <section aria-labelledby="pagos-titulo" className="mb-8">
          <h2 id="pagos-titulo" className="text-lg font-semibold mb-4">
            Pagos
          </h2>

          {/* Resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {proyecto.valorTotal > 0 && (
              <div className="bg-[#111] border border-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-[11px] mb-1">Valor del proyecto</p>
                <p className="text-white font-bold text-lg">
                  {dinero(proyecto.valorTotal, proyecto.moneda)}
                </p>
              </div>
            )}
            <div className="bg-[#111] border border-emerald-500/30 rounded-xl p-4">
              <p className="text-gray-400 text-[11px] mb-1">Pagado</p>
              <p className="text-emerald-400 font-bold text-lg">
                {dinero(pagado, proyecto.moneda)}
              </p>
            </div>
            <div className="bg-[#111] border border-[#C2B280]/30 rounded-xl p-4">
              <p className="text-gray-400 text-[11px] mb-1">Saldo pendiente</p>
              <p className="text-[#C2B280] font-bold text-lg">
                {dinero(saldo, proyecto.moneda)}
              </p>
            </div>
          </div>

          {proyecto.pagos.length === 0 ? (
            <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 text-center">
              <p className="text-gray-400 text-sm">
                Todavía no hay pagos registrados para este proyecto.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {proyecto.pagos.map((pago) => {
                const pagadoOk = pago.estado === "pagado";
                const link = pago.linkPago || config.wompiLink;
                return (
                  <li
                    key={pago.id}
                    className="bg-[#111] border border-gray-800 rounded-2xl p-4 sm:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-white text-sm font-semibold">
                            {pago.concepto}
                          </p>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              pagadoOk
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                                : "bg-[#C2B280]/15 text-[#C2B280] border-[#C2B280]/40"
                            }`}
                          >
                            {pagadoOk ? "Pagado" : "Pendiente"}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">
                          {dinero(pago.monto, pago.moneda)}
                          {pago.vence && !pagadoOk
                            ? ` · vence ${fechaLegible(pago.vence)}`
                            : ""}
                          {pago.metodo ? ` · ${pago.metodo}` : ""}
                        </p>
                        {pagadoOk && pago.pagadoEn ? (
                          <p className="text-emerald-400/80 text-[11px] mt-1">
                            Confirmado el{" "}
                            {new Date(pago.pagadoEn).toLocaleDateString("es-CO", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        ) : null}
                      </div>

                      {!pagadoOk && link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 bg-[#C2B280] hover:bg-[#d4c69a] text-black text-xs font-bold px-4 py-2.5 rounded-lg transition"
                        >
                          Pagar con Wompi →
                        </a>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Datos para transferencia */}
          {hayTransferencia && pendiente > 0 && (
            <div className="mt-4 bg-[#111] border border-gray-800 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-1">
                Transferencia bancaria
              </h3>
              <p className="text-gray-400 text-xs mb-4">
                Si prefieres transferir, estos son los datos. Envía el
                comprobante por WhatsApp para confirmar tu pago.
              </p>
              <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                {config.banco && (
                  <div>
                    <dt className="text-gray-400">Banco</dt>
                    <dd className="text-gray-200">{config.banco}</dd>
                  </div>
                )}
                {config.tipoCuenta && (
                  <div>
                    <dt className="text-gray-400">Tipo de cuenta</dt>
                    <dd className="text-gray-200">{config.tipoCuenta}</dd>
                  </div>
                )}
                {config.numeroCuenta && (
                  <div>
                    <dt className="text-gray-400">Número de cuenta</dt>
                    <dd className="text-gray-200 font-mono tracking-wide">
                      {config.numeroCuenta}
                    </dd>
                  </div>
                )}
                {config.titular && (
                  <div>
                    <dt className="text-gray-400">Titular</dt>
                    <dd className="text-gray-200">{config.titular}</dd>
                  </div>
                )}
                {config.nit && (
                  <div>
                    <dt className="text-gray-400">NIT / C.C.</dt>
                    <dd className="text-gray-200">{config.nit}</dd>
                  </div>
                )}
              </dl>
              {config.nota ? (
                <p className="text-gray-400 text-xs leading-relaxed mt-3 border-t border-gray-800 pt-3">
                  {config.nota}
                </p>
              ) : null}
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 border border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/10 text-xs font-semibold px-4 py-2.5 rounded-lg transition"
              >
                Enviar comprobante por WhatsApp
              </a>
            </div>
          )}
        </section>

        {/* Pie */}
        <footer className="border-t border-gray-800 pt-6 mt-10">
          <p className="text-gray-400 text-xs leading-relaxed">
            ¿Dudas sobre tu proyecto? Escríbele a Wilson:{" "}
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C2B280] underline hover:opacity-80"
            >
              WhatsApp +57 301 2821174
            </a>{" "}
            o{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[#C2B280] underline hover:opacity-80"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="text-gray-400 text-[11px] mt-3">
            Este enlace es privado: no lo compartas públicamente. Wilson Valencia
            · Desarrollador Full-Stack ·{" "}
            <Link href="/" className="text-[#C2B280] underline hover:opacity-80">
              {SITE_HOST}
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
