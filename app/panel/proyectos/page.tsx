"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

/**
 * /panel/proyectos — administración del portal de clientes.
 *
 * Wilson crea el proyecto, agrega hitos (etapas), registra pagos y pega
 * el link de Wompi que generó en su panel. El cliente ve todo en
 * /proyecto/<token>. Wilson marca cada pago como pagado cuando lo
 * confirma; no hay cobros automáticos.
 */

// ── Tipos (espejo de lib/proyectos-db.ts, sin importar código servidor) ─────

type EstadoProyecto = "en_progreso" | "en_revision" | "pausado" | "entregado";
type EstadoHito = "pendiente" | "en_curso" | "completado";
type EstadoPago = "pendiente" | "pagado";

interface Hito {
  id: string;
  titulo: string;
  descripcion: string;
  estado: EstadoHito;
  fecha: string;
}

interface Pago {
  id: string;
  concepto: string;
  monto: number;
  moneda: string;
  estado: EstadoPago;
  metodo: string;
  linkPago: string;
  vence: string;
}

interface Proyecto {
  id: string;
  token: string;
  cliente: string;
  email: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  estado: EstadoProyecto;
  fechaInicio: string;
  fechaEntrega: string;
  valorTotal: number;
  moneda: string;
  creadoEn: string;
  hitos: Hito[];
  pagos: Pago[];
}

interface ConfigPagos {
  banco: string;
  tipoCuenta: string;
  numeroCuenta: string;
  titular: string;
  nit: string;
  wompiLink: string;
  nota: string;
}

const ESTADOS_PROYECTO: { id: EstadoProyecto; label: string }[] = [
  { id: "en_progreso", label: "En progreso" },
  { id: "en_revision", label: "En revisión" },
  { id: "pausado", label: "Pausado" },
  { id: "entregado", label: "Entregado ✅" },
];

const ESTADOS_HITO: { id: EstadoHito; label: string }[] = [
  { id: "pendiente", label: "Pendiente" },
  { id: "en_curso", label: "En curso" },
  { id: "completado", label: "Completado" },
];

const TIPOS = [
  "Landing / Sitio institucional",
  "E-commerce",
  "SaaS / Sistema a medida",
  "App móvil",
  "Dashboard / Panel admin",
  "Mantenimiento",
  "Otro",
];

const CONFIG_VACIA: ConfigPagos = {
  banco: "",
  tipoCuenta: "",
  numeroCuenta: "",
  titular: "",
  nit: "",
  wompiLink: "",
  nota: "",
};

const inputClass =
  "w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C2B280]/60";

function dinero(monto: number, moneda: string): string {
  try {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: moneda || "COP",
      maximumFractionDigits: 0,
    }).format(monto);
  } catch {
    return `${moneda} ${monto}`;
  }
}

function fechaCorta(v: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return "";
  const d = new Date(`${v}T12:00:00`);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

export default function PanelProyectosPage() {
  const [session, setSession] = useState("checking"); // checking | out | in
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState<"proyectos" | "cobros">("proyectos");
  const [configured, setConfigured] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [toast, setToast] = useState("");

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  }, []);

  const cargar = useCallback(async () => {
    setCargando(true);
    setErrorCarga("");
    try {
      const res = await fetch("/api/panel/proyectos", { cache: "no-store" });
      if (res.status === 401) {
        setSession("out");
        return;
      }
      const data = await res.json().catch(() => null);
      if (res.ok && data) {
        setConfigured(!!data.configured);
        setProyectos(data.proyectos || []);
      } else {
        setErrorCarga(data?.error || "No se pudieron cargar los proyectos.");
      }
    } catch {
      setErrorCarga("Error de conexión al cargar los proyectos.");
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
    if (session === "in") cargar();
  }, [session, cargar]);

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

  const copiarEnlace = async (p: Proyecto) => {
    const url = `${window.location.origin}/proyecto/${p.token}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("🔗 Enlace del cliente copiado");
    } catch {
      window.prompt("Copia el enlace para tu cliente:", url);
    }
  };

  const guardarProyecto = async (p: Proyecto, estado: EstadoProyecto) => {
    try {
      const res = await fetch("/api/panel/proyectos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: p.id,
          cliente: p.cliente,
          email: p.email,
          nombre: p.nombre,
          descripcion: p.descripcion,
          tipo: p.tipo,
          estado,
          fechaInicio: p.fechaInicio,
          fechaEntrega: p.fechaEntrega,
          valorTotal: p.valorTotal,
          moneda: p.moneda,
        }),
      });
      if (res.ok) {
        setProyectos((prev) =>
          prev.map((x) => (x.id === p.id ? { ...x, estado } : x))
        );
        showToast("💾 Estado actualizado");
      } else {
        const data = await res.json().catch(() => null);
        showToast(data?.error || "No se pudo actualizar.");
      }
    } catch {
      showToast("Error de conexión.");
    }
  };

  const eliminarProyecto = async (p: Proyecto) => {
    if (
      !window.confirm(
        `¿Eliminar el proyecto "${p.nombre}"? Se borran también sus hitos y pagos. Esta acción no se puede deshacer.`
      )
    )
      return;
    try {
      const res = await fetch("/api/panel/proyectos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id }),
      });
      if (res.ok) {
        setProyectos((prev) => prev.filter((x) => x.id !== p.id));
        showToast("🗑 Proyecto eliminado");
      } else {
        const data = await res.json().catch(() => null);
        showToast(data?.error || "No se pudo eliminar.");
      }
    } catch {
      showToast("Error de conexión.");
    }
  };

  // ── Login ──────────────────────────────────────────────────────────────────

  if (session !== "in") {
    return (
      <main className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#C2B280] to-[#a08b5f] flex items-center justify-center text-2xl mb-4">
              🗂
            </div>
            <h1 className="text-white text-xl font-semibold">Portal de clientes</h1>
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
                Misma contraseña de /panel y /panel/leads.
              </p>
            </form>
          )}
        </div>
      </main>
    );
  }

  // ── Panel ──────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[#0B0B0B]">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-white text-lg sm:text-xl font-semibold">
              Portal de clientes <span className="text-[#C2B280]">· privado</span>
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">
              {configured
                ? `${proyectos.length} proyecto${proyectos.length === 1 ? "" : "s"}`
                : "Base de datos sin configurar"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/panel"
              className="text-gray-400 hover:text-white text-xs border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-2 transition"
            >
              ✍️ Propuestas
            </Link>
            <Link
              href="/panel/leads"
              className="text-gray-400 hover:text-white text-xs border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-2 transition"
            >
              📊 Leads
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white text-xs border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-2 transition"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6" role="tablist" aria-label="Secciones del portal">
          {(
            [
              { id: "proyectos" as const, label: "🗂 Proyectos" },
              { id: "cobros" as const, label: "🏦 Datos de cobro" },
            ]
          ).map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`text-xs px-4 py-2 rounded-lg border transition ${
                tab === t.id
                  ? "bg-[#C2B280] text-black border-[#C2B280] font-semibold"
                  : "border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {!configured && (
          <div className="bg-[#C2B280]/10 border border-[#C2B280]/30 rounded-xl px-4 py-4 mb-6">
            <p className="text-[#C2B280] text-xs font-semibold mb-1">
              Falta configurar la base de datos
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              El portal usa la misma base de datos de los leads (
              <code className="bg-black/40 px-1 rounded">DATABASE_URL</code> en
              Vercel). Una vez esté configurada, esta pantalla funciona igual que
              /panel/leads.
            </p>
          </div>
        )}

        {configured && tab === "proyectos" && (
          <Proyectos
            proyectos={proyectos}
            cargando={cargando}
            errorCarga={errorCarga}
            onRecargar={cargar}
            onCopiar={copiarEnlace}
            onEstado={guardarProyecto}
            onEliminar={eliminarProyecto}
            onToast={showToast}
          />
        )}

        {configured && tab === "cobros" && (
          <ConfigCobros onToast={showToast} />
        )}

        <p className="text-gray-400 text-[11px] text-center mt-10 pb-6">
          Panel privado · no indexado · los enlaces de cada cliente son únicos
        </p>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] bg-[#C2B280] text-black text-xs font-semibold px-5 py-3 rounded-xl shadow-xl">
          {toast}
        </div>
      )}
    </main>
  );
}

// ── Sección de proyectos ─────────────────────────────────────────────────────

function Proyectos({
  proyectos,
  cargando,
  errorCarga,
  onRecargar,
  onCopiar,
  onEstado,
  onEliminar,
  onToast,
}: {
  proyectos: Proyecto[];
  cargando: boolean;
  errorCarga: string;
  onRecargar: () => Promise<void>;
  onCopiar: (p: Proyecto) => Promise<void>;
  onEstado: (p: Proyecto, estado: EstadoProyecto) => Promise<void>;
  onEliminar: (p: Proyecto) => Promise<void>;
  onToast: (msg: string) => void;
}) {
  const [creando, setCreando] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="text-gray-400 text-xs">
          Comparte el enlace de cada proyecto con tu cliente: ve avances, hitos
          y pagos sin crear cuenta.
        </p>
        <button
          onClick={() => setCreando((v) => !v)}
          className="shrink-0 bg-[#C2B280] hover:bg-[#d4c493] text-black text-xs font-semibold px-4 py-2.5 rounded-lg transition"
        >
          {creando ? "Cancelar" : "＋ Nuevo proyecto"}
        </button>
      </div>

      {creando && (
        <NuevoProyecto
          onCreado={async () => {
            setCreando(false);
            await onRecargar();
            onToast("✅ Proyecto creado · copia el enlace para tu cliente");
          }}
          onToast={onToast}
        />
      )}

      {cargando && <p className="text-gray-400 text-sm">Cargando proyectos…</p>}

      {!cargando && errorCarga && (
        <div className="bg-red-500/10 border border-red-500/40 rounded-xl px-4 py-3 mb-4">
          <p className="text-red-400 text-xs">{errorCarga}</p>
          <button
            onClick={onRecargar}
            className="text-[#C2B280] text-xs mt-2 hover:underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !errorCarga && proyectos.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">
            Aún no hay proyectos. Crea el primero y comparte el enlace con tu
            cliente.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {proyectos.map((p) => (
          <ProyectoCard
            key={p.id}
            proyecto={p}
            onCopiar={onCopiar}
            onEstado={onEstado}
            onEliminar={onEliminar}
            onRecargar={onRecargar}
            onToast={onToast}
          />
        ))}
      </div>
    </div>
  );
}

// ── Nuevo proyecto ───────────────────────────────────────────────────────────

function NuevoProyecto({
  onCreado,
  onToast,
}: {
  onCreado: () => Promise<void>;
  onToast: (msg: string) => void;
}) {
  const [form, setForm] = useState({
    cliente: "",
    nombre: "",
    email: "",
    descripcion: "",
    tipo: TIPOS[0],
    fechaInicio: "",
    fechaEntrega: "",
    valorTotal: "",
    moneda: "COP",
  });
  const [guardando, setGuardando] = useState(false);

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (guardando) return;
    setGuardando(true);
    try {
      const res = await fetch("/api/panel/proyectos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          valorTotal: Number(form.valorTotal) || 0,
        }),
      });
      if (res.ok) {
        setForm({
          cliente: "",
          nombre: "",
          email: "",
          descripcion: "",
          tipo: TIPOS[0],
          fechaInicio: "",
          fechaEntrega: "",
          valorTotal: "",
          moneda: "COP",
        });
        await onCreado();
      } else {
        const data = await res.json().catch(() => null);
        onToast(data?.error || "No se pudo crear el proyecto.");
      }
    } catch {
      onToast("Error de conexión.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form
      onSubmit={crear}
      className="bg-[#111] border border-gray-800 rounded-2xl p-5 mb-6 space-y-3"
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-gray-400 text-[11px] mb-1 block">
            Cliente *
          </span>
          <input
            required
            maxLength={120}
            value={form.cliente}
            onChange={(e) => setForm({ ...form, cliente: e.target.value })}
            placeholder="Ej: María Gómez"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-gray-400 text-[11px] mb-1 block">
            Nombre del proyecto *
          </span>
          <input
            required
            maxLength={160}
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            placeholder="Ej: Tienda online Mínimo Studio"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-gray-400 text-[11px] mb-1 block">Email</span>
          <input
            type="email"
            maxLength={160}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="cliente@correo.com"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-gray-400 text-[11px] mb-1 block">Tipo</span>
          <select
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            className={inputClass}
          >
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-gray-400 text-[11px] mb-1 block">
            Fecha de inicio
          </span>
          <input
            type="date"
            value={form.fechaInicio}
            onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-gray-400 text-[11px] mb-1 block">
            Entrega estimada
          </span>
          <input
            type="date"
            value={form.fechaEntrega}
            onChange={(e) => setForm({ ...form, fechaEntrega: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-gray-400 text-[11px] mb-1 block">
            Valor total
          </span>
          <input
            type="number"
            min={0}
            step={1000}
            value={form.valorTotal}
            onChange={(e) => setForm({ ...form, valorTotal: e.target.value })}
            placeholder="3200000"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-gray-400 text-[11px] mb-1 block">Moneda</span>
          <select
            value={form.moneda}
            onChange={(e) => setForm({ ...form, moneda: e.target.value })}
            className={inputClass}
          >
            <option value="COP">COP</option>
            <option value="USD">USD</option>
          </select>
        </label>
      </div>
      <label className="block">
        <span className="text-gray-400 text-[11px] mb-1 block">
          Descripción para el cliente
        </span>
        <textarea
          rows={3}
          maxLength={3000}
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          placeholder="Qué estás construyendo y qué verá el cliente en su portal…"
          className={inputClass}
        />
      </label>
      <button
        type="submit"
        disabled={guardando}
        className="bg-[#C2B280] hover:bg-[#d4c493] disabled:opacity-40 text-black text-xs font-semibold px-5 py-2.5 rounded-lg transition"
      >
        {guardando ? "Creando…" : "Crear proyecto"}
      </button>
    </form>
  );
}

// ── Tarjeta de proyecto ──────────────────────────────────────────────────────

function ProyectoCard({
  proyecto,
  onCopiar,
  onEstado,
  onEliminar,
  onRecargar,
  onToast,
}: {
  proyecto: Proyecto;
  onCopiar: (p: Proyecto) => Promise<void>;
  onEstado: (p: Proyecto, estado: EstadoProyecto) => Promise<void>;
  onEliminar: (p: Proyecto) => Promise<void>;
  onRecargar: () => Promise<void>;
  onToast: (msg: string) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const [cambiando, setCambiando] = useState(false);

  const completados = proyecto.hitos.filter(
    (h) => h.estado === "completado"
  ).length;
  const progreso =
    proyecto.hitos.length > 0
      ? Math.round((completados / proyecto.hitos.length) * 100)
      : 0;
  const pagado = proyecto.pagos
    .filter((p) => p.estado === "pagado")
    .reduce((a, p) => a + p.monto, 0);
  const pendiente = proyecto.pagos
    .filter((p) => p.estado === "pendiente")
    .reduce((a, p) => a + p.monto, 0);

  const cambiarEstado = async (estado: EstadoProyecto) => {
    setCambiando(true);
    await onEstado(proyecto, estado);
    setCambiando(false);
  };

  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm">{proyecto.nombre}</p>
          <p className="text-gray-400 text-xs mt-0.5">
            {proyecto.cliente}
            {proyecto.tipo ? ` · ${proyecto.tipo}` : ""}
            {proyecto.fechaEntrega
              ? ` · entrega ${fechaCorta(proyecto.fechaEntrega)}`
              : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <select
            value={proyecto.estado}
            onChange={(e) => cambiarEstado(e.target.value as EstadoProyecto)}
            disabled={cambiando}
            aria-label={`Estado del proyecto ${proyecto.nombre}`}
            className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#C2B280]/60 disabled:opacity-50"
          >
            {ESTADOS_PROYECTO.map((e) => (
              <option key={e.id} value={e.id}>
                {e.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => onCopiar(proyecto)}
            className="text-[#C2B280] border border-[#C2B280]/40 hover:border-[#C2B280] rounded-lg px-3 py-1.5 text-xs transition"
          >
            🔗 Copiar enlace
          </button>
          <a
            href={`/proyecto/${proyecto.token}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5 text-xs transition"
          >
            Abrir ↗
          </a>
          <button
            onClick={() => onEliminar(proyecto)}
            aria-label={`Eliminar ${proyecto.nombre}`}
            className="text-gray-400 hover:text-red-400 border border-gray-700 hover:border-red-500/50 rounded-lg px-3 py-1.5 text-xs transition"
          >
            🗑
          </button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-3 mt-4 text-xs">
        <div>
          <p className="text-gray-400">Avance</p>
          <p className="text-white font-semibold">{progreso}%</p>
          <div className="h-1.5 rounded-full bg-[#1f1f1f] mt-1.5 overflow-hidden">
            <div
              className="h-full bg-[#C2B280] rounded-full"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>
        <div>
          <p className="text-gray-400">Pagado</p>
          <p className="text-emerald-400 font-semibold">
            {dinero(pagado, proyecto.moneda)}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Pendiente</p>
          <p className="text-[#C2B280] font-semibold">
            {dinero(pendiente, proyecto.moneda)}
          </p>
        </div>
      </div>

      <button
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        className="text-gray-400 hover:text-white text-xs mt-4 border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5 transition"
      >
        {abierto ? "Ocultar hitos y pagos" : "Gestionar hitos y pagos"}
      </button>

      {abierto && (
        <div className="mt-5 space-y-6 border-t border-gray-800 pt-5">
          <Hitos
            proyecto={proyecto}
            onRecargar={onRecargar}
            onToast={onToast}
          />
          <Pagos
            proyecto={proyecto}
            onRecargar={onRecargar}
            onToast={onToast}
          />
        </div>
      )}
    </div>
  );
}

// ── Hitos ────────────────────────────────────────────────────────────────────

function Hitos({
  proyecto,
  onRecargar,
  onToast,
}: {
  proyecto: Proyecto;
  onRecargar: () => Promise<void>;
  onToast: (msg: string) => void;
}) {
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [creando, setCreando] = useState(false);

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || creando) return;
    setCreando(true);
    try {
      const res = await fetch("/api/panel/proyectos/hitos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proyectoId: proyecto.id, titulo, fecha }),
      });
      if (res.ok) {
        setTitulo("");
        setFecha("");
        await onRecargar();
        onToast("✅ Hito agregado");
      } else {
        const data = await res.json().catch(() => null);
        onToast(data?.error || "No se pudo agregar el hito.");
      }
    } catch {
      onToast("Error de conexión.");
    } finally {
      setCreando(false);
    }
  };

  const cambiar = async (h: Hito, estado: EstadoHito) => {
    try {
      const res = await fetch("/api/panel/proyectos/hitos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: h.id,
          titulo: h.titulo,
          descripcion: h.descripcion,
          estado,
          fecha: h.fecha,
        }),
      });
      if (res.ok) {
        await onRecargar();
        onToast("💾 Hito actualizado");
      } else {
        const data = await res.json().catch(() => null);
        onToast(data?.error || "No se pudo actualizar.");
      }
    } catch {
      onToast("Error de conexión.");
    }
  };

  const borrar = async (h: Hito) => {
    if (!window.confirm(`¿Eliminar el hito "${h.titulo}"?`)) return;
    try {
      const res = await fetch("/api/panel/proyectos/hitos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: h.id }),
      });
      if (res.ok) {
        await onRecargar();
        onToast("🗑 Hito eliminado");
      } else {
        const data = await res.json().catch(() => null);
        onToast(data?.error || "No se pudo eliminar.");
      }
    } catch {
      onToast("Error de conexión.");
    }
  };

  return (
    <div>
      <h3 className="text-white text-xs font-semibold mb-2">Hitos / etapas</h3>

      {proyecto.hitos.length === 0 ? (
        <p className="text-gray-400 text-xs mb-3">
          Sin hitos todavía. Agrega las etapas que verá el cliente.
        </p>
      ) : (
        <ul className="space-y-2 mb-3">
          {proyecto.hitos.map((h) => (
            <li
              key={h.id}
              className="flex flex-wrap items-center gap-2 bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-2"
            >
              <span className="text-white text-xs flex-1 min-w-[140px]">
                {h.titulo}
                {h.fecha ? (
                  <span className="text-gray-400"> · {fechaCorta(h.fecha)}</span>
                ) : null}
              </span>
              <select
                value={h.estado}
                onChange={(e) => cambiar(h, e.target.value as EstadoHito)}
                aria-label={`Estado del hito ${h.titulo}`}
                className="bg-[#0B0B0B] border border-gray-700 rounded-md px-2 py-1 text-[11px] text-white focus:outline-none focus:border-[#C2B280]/60"
              >
                {ESTADOS_HITO.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => borrar(h)}
                aria-label={`Eliminar hito ${h.titulo}`}
                className="text-gray-400 hover:text-red-400 text-xs px-1.5"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={crear} className="flex flex-wrap items-center gap-2">
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          maxLength={160}
          placeholder="Nuevo hito (ej: Diseño aprobado)"
          aria-label="Título del nuevo hito"
          className="flex-1 min-w-[180px] bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C2B280]/60"
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          aria-label="Fecha del nuevo hito"
          className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C2B280]/60"
        />
        <button
          type="submit"
          disabled={creando || !titulo.trim()}
          className="bg-[#C2B280] hover:bg-[#d4c493] disabled:opacity-40 text-black text-xs font-semibold px-4 py-2 rounded-lg transition"
        >
          {creando ? "…" : "Agregar"}
        </button>
      </form>
    </div>
  );
}

// ── Pagos ────────────────────────────────────────────────────────────────────

function Pagos({
  proyecto,
  onRecargar,
  onToast,
}: {
  proyecto: Proyecto;
  onRecargar: () => Promise<void>;
  onToast: (msg: string) => void;
}) {
  const [form, setForm] = useState({
    concepto: "",
    monto: "",
    metodo: "Wompi",
    linkPago: "",
    vence: "",
  });
  const [creando, setCreando] = useState(false);

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (creando) return;
    const monto = Number(form.monto);
    if (!form.concepto.trim() || !Number.isFinite(monto) || monto <= 0) {
      onToast("Escribe el concepto y un monto mayor a cero.");
      return;
    }
    setCreando(true);
    try {
      const res = await fetch("/api/panel/proyectos/pagos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proyectoId: proyecto.id,
          concepto: form.concepto,
          monto,
          moneda: proyecto.moneda,
          metodo: form.metodo,
          linkPago: form.linkPago,
          vence: form.vence,
        }),
      });
      if (res.ok) {
        setForm({ concepto: "", monto: "", metodo: "Wompi", linkPago: "", vence: "" });
        await onRecargar();
        onToast("✅ Pago agregado");
      } else {
        const data = await res.json().catch(() => null);
        onToast(data?.error || "No se pudo agregar el pago.");
      }
    } catch {
      onToast("Error de conexión.");
    } finally {
      setCreando(false);
    }
  };

  const cambiarEstado = async (p: Pago, estado: EstadoPago) => {
    try {
      const res = await fetch("/api/panel/proyectos/pagos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: p.id,
          concepto: p.concepto,
          monto: p.monto,
          moneda: p.moneda,
          estado,
          metodo: p.metodo,
          linkPago: p.linkPago,
          vence: p.vence,
        }),
      });
      if (res.ok) {
        await onRecargar();
        onToast(estado === "pagado" ? "💰 Pago confirmado" : "Pago marcado pendiente");
      } else {
        const data = await res.json().catch(() => null);
        onToast(data?.error || "No se pudo actualizar.");
      }
    } catch {
      onToast("Error de conexión.");
    }
  };

  const borrar = async (p: Pago) => {
    if (!window.confirm(`¿Eliminar el pago "${p.concepto}"?`)) return;
    try {
      const res = await fetch("/api/panel/proyectos/pagos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id }),
      });
      if (res.ok) {
        await onRecargar();
        onToast("🗑 Pago eliminado");
      } else {
        const data = await res.json().catch(() => null);
        onToast(data?.error || "No se pudo eliminar.");
      }
    } catch {
      onToast("Error de conexión.");
    }
  };

  return (
    <div>
      <h3 className="text-white text-xs font-semibold mb-2">Pagos</h3>

      {proyecto.pagos.length === 0 ? (
        <p className="text-gray-400 text-xs mb-3">
          Sin pagos registrados. Puedes registrar el anticipo y el saldo.
        </p>
      ) : (
        <ul className="space-y-2 mb-3">
          {proyecto.pagos.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center gap-2 bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-2"
            >
              <span className="text-white text-xs flex-1 min-w-[150px]">
                {p.concepto}
                <span className="text-gray-400">
                  {" "}
                  · {dinero(p.monto, p.moneda)}
                  {p.metodo ? ` · ${p.metodo}` : ""}
                </span>
              </span>
              <button
                onClick={() =>
                  cambiarEstado(p, p.estado === "pagado" ? "pendiente" : "pagado")
                }
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border transition ${
                  p.estado === "pagado"
                    ? "text-emerald-300 border-emerald-500/40 bg-emerald-500/10"
                    : "text-[#C2B280] border-[#C2B280]/40 bg-[#C2B280]/10"
                }`}
              >
                {p.estado === "pagado" ? "Pagado ✓" : "Marcar pagado"}
              </button>
              <button
                onClick={() => borrar(p)}
                aria-label={`Eliminar pago ${p.concepto}`}
                className="text-gray-400 hover:text-red-400 text-xs px-1.5"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={crear} className="grid sm:grid-cols-2 gap-2">
        <input
          value={form.concepto}
          onChange={(e) => setForm({ ...form, concepto: e.target.value })}
          maxLength={160}
          placeholder="Concepto (ej: Anticipo 50%)"
          aria-label="Concepto del nuevo pago"
          className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C2B280]/60"
        />
        <input
          type="number"
          min={0}
          step={1000}
          value={form.monto}
          onChange={(e) => setForm({ ...form, monto: e.target.value })}
          placeholder={`Monto en ${proyecto.moneda}`}
          aria-label="Monto del nuevo pago"
          className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C2B280]/60"
        />
        <select
          value={form.metodo}
          onChange={(e) => setForm({ ...form, metodo: e.target.value })}
          aria-label="Método de pago"
          className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C2B280]/60"
        >
          <option value="Wompi">Wompi</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Otro">Otro</option>
        </select>
        <input
          value={form.linkPago}
          onChange={(e) => setForm({ ...form, linkPago: e.target.value })}
          maxLength={500}
          placeholder="Link de pago Wompi (opcional)"
          aria-label="Link de pago Wompi"
          className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C2B280]/60"
        />
        <input
          type="date"
          value={form.vence}
          onChange={(e) => setForm({ ...form, vence: e.target.value })}
          aria-label="Fecha de vencimiento del pago"
          className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C2B280]/60"
        />
        <button
          type="submit"
          disabled={creando}
          className="bg-[#C2B280] hover:bg-[#d4c493] disabled:opacity-40 text-black text-xs font-semibold px-4 py-2 rounded-lg transition"
        >
          {creando ? "…" : "Agregar pago"}
        </button>
      </form>
      <p className="text-gray-400 text-[11px] mt-2">
        Crea el link de pago en tu panel de Wompi y pégalo aquí: el cliente lo
        verá como botón &quot;Pagar con Wompi&quot;. Los cobros no son automáticos;
        tú confirmas cada pago.
      </p>
    </div>
  );
}

// ── Datos de cobro ───────────────────────────────────────────────────────────

function ConfigCobros({ onToast }: { onToast: (msg: string) => void }) {
  const [config, setConfig] = useState<ConfigPagos>(CONFIG_VACIA);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    fetch("/api/panel/config-pagos", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d?.config) setConfig({ ...CONFIG_VACIA, ...d.config });
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (guardando) return;
    setGuardando(true);
    try {
      const res = await fetch("/api/panel/config-pagos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        onToast("💾 Datos de cobro guardados");
      } else {
        const data = await res.json().catch(() => null);
        onToast(data?.error || "No se pudo guardar.");
      }
    } catch {
      onToast("Error de conexión.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <p className="text-gray-400 text-sm">Cargando datos de cobro…</p>;
  }

  return (
    <form
      onSubmit={guardar}
      className="bg-[#111] border border-gray-800 rounded-2xl p-5 space-y-3"
    >
      <p className="text-gray-400 text-xs leading-relaxed">
        Estos datos aparecen en el portal de todos los clientes que tengan pagos
        pendientes por transferencia. Se guardan una sola vez.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-gray-400 text-[11px] mb-1 block">Banco</span>
          <input
            value={config.banco}
            onChange={(e) => setConfig({ ...config, banco: e.target.value })}
            placeholder="Ej: Bancolombia"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-gray-400 text-[11px] mb-1 block">
            Tipo de cuenta
          </span>
          <input
            value={config.tipoCuenta}
            onChange={(e) => setConfig({ ...config, tipoCuenta: e.target.value })}
            placeholder="Ahorros / Corriente"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-gray-400 text-[11px] mb-1 block">
            Número de cuenta
          </span>
          <input
            value={config.numeroCuenta}
            onChange={(e) =>
              setConfig({ ...config, numeroCuenta: e.target.value })
            }
            placeholder="000-000000-00"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-gray-400 text-[11px] mb-1 block">Titular</span>
          <input
            value={config.titular}
            onChange={(e) => setConfig({ ...config, titular: e.target.value })}
            placeholder="Nombre completo"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-gray-400 text-[11px] mb-1 block">
            NIT / C.C.
          </span>
          <input
            value={config.nit}
            onChange={(e) => setConfig({ ...config, nit: e.target.value })}
            placeholder="Opcional"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-gray-400 text-[11px] mb-1 block">
            Link base de Wompi (opcional)
          </span>
          <input
            value={config.wompiLink}
            onChange={(e) => setConfig({ ...config, wompiLink: e.target.value })}
            placeholder="https://checkout.wompi.co/l/..."
            className={inputClass}
          />
        </label>
      </div>
      <label className="block">
        <span className="text-gray-400 text-[11px] mb-1 block">
          Nota para el cliente
        </span>
        <textarea
          rows={3}
          value={config.nota}
          onChange={(e) => setConfig({ ...config, nota: e.target.value })}
          placeholder="Ej: envía el comprobante por WhatsApp y confirma tu pago el mismo día."
          className={inputClass}
        />
      </label>
      <button
        type="submit"
        disabled={guardando}
        className="bg-[#C2B280] hover:bg-[#d4c493] disabled:opacity-40 text-black text-xs font-semibold px-5 py-2.5 rounded-lg transition"
      >
        {guardando ? "Guardando…" : "Guardar datos de cobro"}
      </button>
    </form>
  );
}
