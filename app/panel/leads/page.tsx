"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

/**
 * /panel/leads — tablero de leads de Wilson (Fase 3).
 *
 * Todos los leads captados por Alma (chat), /cotizar y /contact quedan en
 * la base de datos (DATABASE_URL) además del correo. Aquí Wilson los
 * revisa, les cambia el estado y deja notas. Nada se envía automático:
 * el contacto con el cliente siempre lo hace él.
 *
 * Si DATABASE_URL no está configurada, muestra instrucciones para
 * activarla (Neon/Supabase gratis) y recuerda que los leads siguen
 * llegando por correo.
 */

type Estado = "nuevo" | "calificado" | "llamada" | "propuesta" | "cerrado" | "descartado";

interface Lead {
  id: string;
  creadoEn: string;
  origen: string;
  nombre: string;
  contacto: string;
  whatsapp: string;
  presupuesto: string;
  necesidad: string;
  utm: Record<string, string>;
  estado: Estado;
  notas: string;
}

const ESTADOS: { id: Estado; label: string }[] = [
  { id: "nuevo", label: "Nuevo" },
  { id: "calificado", label: "Calificado" },
  { id: "llamada", label: "Llamada" },
  { id: "propuesta", label: "Propuesta" },
  { id: "cerrado", label: "Cerrado ✅" },
  { id: "descartado", label: "Descartado" },
];

const COLOR_ORIGEN: Record<string, string> = {
  chat: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  cotizar: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  contacto: "bg-[#C2B280]/15 text-[#C2B280] border-[#C2B280]/30",
};

const COLOR_ESTADO: Record<string, string> = {
  nuevo: "bg-green-500/15 text-green-300 border-green-500/30",
  calificado: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  llamada: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  propuesta: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  cerrado: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  descartado: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

export default function PanelLeadsPage() {
  const [session, setSession] = useState("checking"); // checking | out | in
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [configured, setConfigured] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [filtro, setFiltro] = useState<Estado | "todos">("todos");
  const [toast, setToast] = useState("");

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }, []);

  const cargarLeads = useCallback(async () => {
    setCargando(true);
    setErrorCarga("");
    try {
      const res = await fetch("/api/panel/leads", { cache: "no-store" });
      if (res.status === 401) {
        setSession("out");
        return;
      }
      const data = await res.json().catch(() => null);
      if (res.ok && data) {
        setConfigured(!!data.configured);
        setLeads(data.leads || []);
      } else {
        setErrorCarga(data?.error || "No se pudieron cargar los leads.");
      }
    } catch {
      setErrorCarga("Error de conexión al cargar los leads.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/panel/login")
      .then((r) => r.json())
      .then((d) => setSession(d?.authed ? "in" : "out"))
      .catch(() => setSession("out"));
  }, []);

  useEffect(() => {
    if (session === "in") cargarLeads();
  }, [session, cargarLeads]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || loggingIn) return;
    setLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch("/api/panel/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setPassword("");
        setSession("in");
      } else {
        setLoginError(data?.error || "No se pudo iniciar sesión.");
      }
    } catch {
      setLoginError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/panel/login", { method: "DELETE" }).catch(() => {});
    setSession("out");
  };

  const guardarLead = async (lead: Lead, estado: Estado, notas: string) => {
    try {
      const res = await fetch("/api/panel/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id, estado, notas }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === lead.id ? { ...l, estado, notas } : l))
        );
        showToast("💾 Cambios guardados");
      } else {
        const data = await res.json().catch(() => null);
        showToast(data?.error || "No se pudo guardar.");
      }
    } catch {
      showToast("Error de conexión.");
    }
  };

  // ── Pantalla de sesión ─────────────────────────────────────────────────────
  if (session !== "in") {
    return (
      <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#0B0B0B] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#C2B280] to-[#a08b5f] flex items-center justify-center text-2xl mb-4">
              📊
            </div>
            <h1 className="text-white text-xl font-semibold">Panel de leads</h1>
            <p className="text-gray-400 text-sm mt-1">Acceso privado de Wilson</p>
          </div>
          {session === "checking" ? (
            <p className="text-center text-gray-400 text-sm">Verificando sesión…</p>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña del panel"
                autoFocus
                aria-label="Contraseña del panel"
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#C2B280]/60"
              />
              {loginError && <p className="text-red-400 text-xs">{loginError}</p>}
              <button
                type="submit"
                disabled={loggingIn || !password}
                className="w-full bg-[#C2B280] hover:bg-[#d4c493] disabled:opacity-40 text-black font-semibold py-3 rounded-xl transition"
              >
                {loggingIn ? "Entrando…" : "Entrar"}
              </button>
              <p className="text-gray-400 text-[11px] text-center">
                Misma contraseña del panel de propuestas (PANEL_PASSWORD).
              </p>
            </form>
          )}
        </div>
      </div>
    );
  }

  const visibles = leads.filter((l) => filtro === "todos" || l.estado === filtro);
  const nuevos = leads.filter((l) => l.estado === "nuevo").length;

  // ── Panel principal ─────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#0B0B0B]">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-white text-lg sm:text-xl font-semibold">
              Panel de leads <span className="text-[#C2B280]">· privado</span>
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">
              {configured
                ? `${leads.length} leads guardados · ${nuevos} nuevo${nuevos === 1 ? "" : "s"}`
                : "Base de datos sin configurar"}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/panel"
              className="text-gray-400 hover:text-white text-xs border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-2 transition"
            >
              ✍️ Propuestas
            </Link>
            <Link
              href="/panel/proyectos"
              className="text-gray-400 hover:text-white text-xs border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-2 transition"
            >
              🗂 Proyectos
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white text-xs border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-2 transition"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Sin base de datos: instrucciones de activación */}
        {!configured && (
          <div className="bg-[#C2B280]/10 border border-[#C2B280]/30 rounded-xl px-4 py-4 mb-6">
            <p className="text-[#C2B280] text-xs font-semibold mb-2">
              Activa la base de datos (gratis, 5 minutos)
            </p>
            <ol className="text-gray-400 text-xs leading-relaxed list-decimal list-inside space-y-1">
              <li>
                Crea una cuenta gratis en <strong className="text-gray-200">neon.tech</strong> (o Supabase) y crea un proyecto.
              </li>
              <li>
                Copia la cadena de conexión (<strong className="text-gray-200">DATABASE_URL</strong>) que te da la plataforma.
              </li>
              <li>
                En Vercel → tu proyecto → Settings → Environment Variables, agrega{" "}
                <code className="bg-black/40 px-1 rounded">DATABASE_URL</code> con ese valor y redespliega.
              </li>
            </ol>
            <p className="text-gray-400 text-[11px] mt-2">
              Mientras tanto no pierdes nada: cada lead ya te llega por correo como siempre.
              La tabla se crea sola en el primer uso.
            </p>
          </div>
        )}

        {/* Filtros */}
        {configured && (
          <div className="flex flex-wrap gap-2 mb-6">
            {([{ id: "todos" as const, label: "Todos" }, ...ESTADOS]).map((e) => (
              <button
                key={e.id}
                onClick={() => setFiltro(e.id as Estado | "todos")}
                aria-pressed={filtro === e.id}
                className={`text-[11px] px-3 py-1.5 rounded-lg border transition ${
                  filtro === e.id
                    ? "bg-[#C2B280] text-black border-[#C2B280] font-semibold"
                    : "border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                {e.label}
                {e.id !== "todos" && (
                  <span className="ml-1 opacity-60">
                    ({leads.filter((l) => l.estado === e.id).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Estados de carga / error */}
        {configured && cargando && (
          <p className="text-gray-400 text-sm">Cargando leads…</p>
        )}
        {configured && !cargando && errorCarga && (
          <div className="bg-red-500/10 border border-red-500/40 rounded-xl px-4 py-3 mb-6">
            <p className="text-red-400 text-xs">{errorCarga}</p>
            <button
              onClick={cargarLeads}
              className="text-[#C2B280] text-xs mt-2 hover:underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Lista de leads */}
        {configured && !cargando && !errorCarga && visibles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">
              {leads.length === 0
                ? "Aún no hay leads guardados. Cuando alguien deje su contacto en el chat, /cotizar o /contact, aparecerá aquí."
                : "No hay leads con ese filtro."}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {visibles.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onGuardar={guardarLead} />
          ))}
        </div>

        <p className="text-gray-400 text-[11px] text-center mt-10 pb-6">
          Panel privado · no indexado · los leads también llegan a tu correo
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] bg-[#C2B280] text-black text-xs font-semibold px-5 py-3 rounded-xl shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

// ── Tarjeta de lead ──────────────────────────────────────────────────────────

function LeadCard({
  lead,
  onGuardar,
}: {
  lead: Lead;
  onGuardar: (lead: Lead, estado: Estado, notas: string) => Promise<void>;
}) {
  const [estado, setEstado] = useState<Estado>(lead.estado);
  const [notas, setNotas] = useState(lead.notas);
  const [guardando, setGuardando] = useState(false);

  const sucio = estado !== lead.estado || notas !== lead.notas;
  const esEmail = lead.contacto.includes("@");
  const telDigits = (lead.whatsapp || lead.contacto).replace(/\D/g, "");

  const guardar = async () => {
    if (!sucio || guardando) return;
    setGuardando(true);
    await onGuardar(lead, estado, notas);
    setGuardando(false);
  };

  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-5">
      {/* Encabezado */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="text-white text-sm font-semibold">{lead.nombre}</p>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border ${
                COLOR_ORIGEN[lead.origen] || "border-gray-600 text-gray-400"
              }`}
            >
              {lead.origen}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border ${
                COLOR_ESTADO[lead.estado] || "border-gray-600 text-gray-400"
              }`}
            >
              {ESTADOS.find((e) => e.id === lead.estado)?.label || lead.estado}
            </span>
          </div>
          <p className="text-gray-400 text-[11px]">
            {new Date(lead.creadoEn).toLocaleString("es-CO", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {lead.whatsapp || (!esEmail && telDigits.length >= 7) ? (
            <a
              href={`https://wa.me/${telDigits}?text=${encodeURIComponent(
                `Hola ${lead.nombre}, vi tu mensaje en mi portafolio 👋`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:text-green-400 text-xs border border-[#25D366]/40 hover:border-[#25D366] rounded-lg px-3 py-1.5 transition"
            >
              💬 WhatsApp
            </a>
          ) : null}
          {esEmail && (
            <a
              href={`mailto:${lead.contacto}`}
              className="text-[#C2B280] hover:text-[#d4c493] text-xs border border-[#C2B280]/40 hover:border-[#C2B280] rounded-lg px-3 py-1.5 transition"
            >
              ✉️ Email
            </a>
          )}
        </div>
      </div>

      {/* Datos */}
      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs mb-3">
        <p className="text-gray-400">
          <span className="text-gray-400">Contacto:</span>{" "}
          <span className="text-gray-300 break-all">{lead.contacto || "—"}</span>
        </p>
        <p className="text-gray-400">
          <span className="text-gray-400">Presupuesto:</span>{" "}
          <span className="text-gray-300">{lead.presupuesto || "No indicó"}</span>
        </p>
        <p className="text-gray-400 sm:col-span-2">
          <span className="text-gray-400">Necesidad:</span>{" "}
          <span className="text-gray-300">{lead.necesidad || "—"}</span>
        </p>
        <p className="text-gray-400 sm:col-span-2 text-[11px] break-all">
          <span className="text-gray-400">Origen:</span>{" "}
          {lead.utm?.utm_source || "Directo"}
          {lead.utm?.utm_medium ? ` / ${lead.utm.utm_medium}` : ""}
          {lead.utm?.utm_campaign ? ` / ${lead.utm.utm_campaign}` : ""}
          {lead.utm?.page ? ` · ${lead.utm.page}` : ""}
        </p>
      </div>

      {/* Estado + notas */}
      <div className="flex flex-col sm:flex-row gap-3 border-t border-gray-800 pt-3">
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as Estado)}
          aria-label={`Estado del lead de ${lead.nombre}`}
          className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C2B280]/60"
        >
          {ESTADOS.map((e) => (
            <option key={e.id} value={e.id}>
              {e.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          maxLength={2000}
          placeholder="Notas: qué acordaste, cuándo escribirle, propuesta enviada…"
          aria-label={`Notas del lead de ${lead.nombre}`}
          className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C2B280]/60"
        />
        <button
          onClick={guardar}
          disabled={!sucio || guardando}
          className="bg-[#C2B280] hover:bg-[#d4c493] disabled:opacity-30 disabled:cursor-not-allowed text-black font-semibold text-xs px-4 py-2 rounded-lg transition shrink-0"
        >
          {guardando ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </div>
  );
}
