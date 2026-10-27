"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

/**
 * Panel privado de propuestas — Fase 2.
 *
 * Flujo: lead llega por email (chat de Alma o /cotizar) → Wilson entra a
 * /panel → pega los datos → Groq redacta un borrador → Wilson lo EDITA y
 * lo aprueba → lo entrega ÉL MISMO (copia el texto o descarga un HTML
 * elegante para imprimir a PDF y adjuntar). NADA se envía automáticamente.
 *
 * El historial de propuestas vive en ESTE navegador (localStorage):
 * "alma_propuestas_v1", máximo 20, sin servidores ni bases de datos.
 */

const HISTORY_KEY = "alma_propuestas_v1";
const WHATSAPP = "573012821174";

const TIPOS = [
  { id: "landing", label: "Landing / Sitio institucional" },
  { id: "ecommerce", label: "E-commerce / Tienda online" },
  { id: "saas", label: "SaaS / Sistema a medida" },
  { id: "app", label: "App móvil" },
  { id: "dashboard", label: "Dashboard / Panel admin" },
  { id: "otro", label: "Otro / Por definir" },
];

type HistoryItem = {
  id: number;
  date: string;
  clientName: string;
  projectType: string;
  text: string;
};

// ── Conversión de Markdown (salida de la IA) ────────────────────────────────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

/** Markdown simple → HTML con la marca de Wilson (tema claro, apto para PDF). */
function mdToHtmlBody(md: string): string {
  const lines = escapeHtml(md).split(/\r?\n/);
  const out: string[] = [];
  let inList = false;
  for (const raw of lines) {
    const line = raw.trim();
    const isLi = /^[-*]\s+/.test(line);
    if (isLi && !inList) {
      out.push('<ul style="margin:8px 0 14px 20px; padding:0;">');
      inList = true;
    }
    if (!isLi && inList) {
      out.push("</ul>");
      inList = false;
    }
    if (!line) continue;
    if (line.startsWith("### ")) {
      out.push(
        `<h3 style="color:#1a1a1a; font-size:15px; margin:18px 0 6px;">${inline(line.slice(4))}</h3>`
      );
    } else if (line.startsWith("## ")) {
      out.push(
        `<h2 style="color:#0B0B0B; font-size:18px; border-bottom:2px solid #C2B280; padding-bottom:6px; margin:26px 0 10px;">${inline(line.slice(3))}</h2>`
      );
    } else if (isLi) {
      out.push(
        `<li style="color:#333; font-size:14px; line-height:1.7; margin:4px 0;">${inline(line.replace(/^[-*]\s+/, ""))}</li>`
      );
    } else {
      out.push(
        `<p style="color:#333; font-size:14px; line-height:1.8; margin:8px 0;">${inline(line)}</p>`
      );
    }
  }
  if (inList) out.push("</ul>");
  return out.join("\n");
}

function buildProposalHtml(md: string, clientName: string): string {
  const hoy = new Date().toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Propuesta — ${escapeHtml(clientName)}</title></head>
<body style="margin:0; background:#f4f1ea; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
<div style="max-width:720px; margin:0 auto; background:#ffffff; padding:48px 52px;">
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:34px;">
    <div>
      <p style="margin:0; font-size:20px; font-weight:700; color:#0B0B0B;">Wilson Valencia</p>
      <p style="margin:2px 0 0; font-size:12px; color:#8a7a55;">Desarrollador Full-Stack — wvalencia-dev.vercel.app</p>
    </div>
    <p style="margin:0; font-size:12px; color:#999;">${hoy}</p>
  </div>
  <div style="background:#0B0B0B; color:#fff; border-radius:10px; padding:18px 22px; margin-bottom:10px;">
    <p style="margin:0; font-size:15px; font-weight:600; color:#C2B280;">Propuesta de desarrollo de software</p>
    <p style="margin:3px 0 0; font-size:13px; color:#ccc;">Preparada para ${escapeHtml(clientName)}</p>
  </div>
${mdToHtmlBody(md)}
  <div style="margin-top:40px; border-top:1px solid #e5e0d5; padding-top:18px;">
    <p style="margin:0; font-size:12px; color:#777;">
      Wilson Valencia · WhatsApp +57 301 2821174 ·
      <a href="https://wvalencia-dev.vercel.app" style="color:#8a7a55;">wvalencia-dev.vercel.app</a>
    </p>
  </div>
</div>
</body></html>`;
}

/** Markdown → texto plano cómodo para pegar en WhatsApp o email. */
function toPlainText(md: string): string {
  return md
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/^###\s*(.+)$/gm, "$1")
    .replace(/^##\s*(.+)$/gm, "▼ $1")
    .replace(/^[-*]\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ── Página ───────────────────────────────────────────────────────────────────

export default function PanelPage() {
  const [session, setSession] = useState("checking"); // checking | out | in
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [form, setForm] = useState({
    clientName: "",
    contact: "",
    projectType: "landing",
    need: "",
    budget: "",
    extra: "",
  });
  const [proposal, setProposal] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const [toast, setToast] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }, []);

  // Sesión + historial al cargar
  useEffect(() => {
    fetch("/api/panel/login")
      .then((r) => r.json())
      .then((d) => setSession(d?.authed ? "in" : "out"))
      .catch(() => setSession("out"));
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  const persistHistory = (items: HistoryItem[]) => {
    setHistory(items);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
    } catch {}
  };

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
    setProposal("");
  };

  const generate = async () => {
    if (generating) return;
    if (form.clientName.trim().length < 2) {
      setGenError("Escribe el nombre del cliente.");
      return;
    }
    if (form.need.trim().length < 10) {
      setGenError("Describe la necesidad del cliente (mínimo 10 caracteres).");
      return;
    }
    setGenerating(true);
    setGenError("");
    try {
      const res = await fetch("/api/panel/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.proposal) {
        setProposal(data.proposal);
        showToast("✨ Borrador listo — edítalo antes de entregarlo");
      } else {
        setGenError(data?.error || "No se pudo generar el borrador.");
      }
    } catch {
      setGenError("Error de conexión. Intenta de nuevo.");
    } finally {
      setGenerating(false);
    }
  };

  const copyPlain = async () => {
    if (!proposal) return;
    const text = toPlainText(proposal);
    try {
      await navigator.clipboard.writeText(text);
      showToast("📋 Propuesta copiada — pégala en WhatsApp o email");
    } catch {
      showToast("No se pudo copiar: selecciona el texto manualmente.");
    }
  };

  const downloadHtml = () => {
    if (!proposal) return;
    const html = buildProposalHtml(proposal, form.clientName || "cliente");
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const slug =
      (form.clientName || "cliente")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "cliente";
    a.href = url;
    a.download = `propuesta-${slug}-${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("⬇️ HTML descargado — ábrelo e imprime a PDF si lo necesitas");
  };

  const saveToHistory = () => {
    if (!proposal) return;
    const item: HistoryItem = {
      id: Date.now(),
      date: new Date().toISOString(),
      clientName: form.clientName || "Sin nombre",
      projectType: form.projectType,
      text: proposal,
    };
    persistHistory([item, ...history].slice(0, 20));
    showToast("💾 Guardada en el historial de este navegador");
  };

  const loadFromHistory = (item: HistoryItem) => {
    setForm((f) => ({ ...f, clientName: item.clientName, projectType: item.projectType }));
    setProposal(item.text);
    showToast("Propuesta cargada en el editor");
  };

  const removeFromHistory = (id: number) => {
    persistHistory(history.filter((h) => h.id !== id));
  };

  // ── Pantalla de sesión ─────────────────────────────────────────────────────
  if (session !== "in") {
    return (
      <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#0B0B0B] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#C2B280] to-[#a08b5f] flex items-center justify-center text-2xl mb-4">
              🦋
            </div>
            <h1 className="text-white text-xl font-semibold">Panel de propuestas</h1>
            <p className="text-gray-500 text-sm mt-1">Acceso privado de Wilson</p>
          </div>
          {session === "checking" ? (
            <p className="text-center text-gray-500 text-sm">Verificando sesión…</p>
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
              {loginError && (
                <p className="text-red-400 text-xs">{loginError}</p>
              )}
              <button
                type="submit"
                disabled={loggingIn || !password}
                className="w-full bg-[#C2B280] hover:bg-[#d4c493] disabled:opacity-40 text-black font-semibold py-3 rounded-xl transition"
              >
                {loggingIn ? "Entrando…" : "Entrar"}
              </button>
              <p className="text-gray-600 text-[11px] text-center">
                La contraseña se define en la variable de entorno PANEL_PASSWORD.
              </p>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ── Panel principal ─────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#0B0B0B]">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-lg sm:text-xl font-semibold">
              Panel de propuestas <span className="text-[#C2B280]">· privado</span>
            </h1>
            <p className="text-gray-500 text-xs mt-0.5">
              Genera borradores con IA, edítalos y apruébalos tú. Nada se envía solo.
            </p>
          </div>
          <div className="flex items-center gap-2">
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

        {/* Aviso de entrega */}
        <div className="bg-[#C2B280]/10 border border-[#C2B280]/30 rounded-xl px-4 py-3 mb-6">
          <p className="text-[#C2B280] text-xs font-semibold mb-1">
            Cómo se entrega una propuesta
          </p>
          <p className="text-gray-400 text-xs leading-relaxed">
            Genera el borrador → <strong className="text-gray-200">edítalo a tu gusto</strong> →
            cópialo y envíalo por WhatsApp/email, o descárgalo como HTML elegante
            (imprimible a PDF). El envío automático directo al cliente llegará en la
            Fase 3, cuando verifiques tu propio dominio en Resend.
          </p>
        </div>

        {/* Formulario del lead */}
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-5 mb-6">
          <h2 className="text-white text-sm font-semibold mb-4">
            1 · Datos del lead <span className="text-gray-500 font-normal">(pégalos desde el email del lead)</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              placeholder="Nombre del cliente *"
              maxLength={80}
              className="bg-[#1a1a1a] border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C2B280]/60 min-w-0"
            />
            <input
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              placeholder="Contacto (WhatsApp o email)"
              maxLength={120}
              className="bg-[#1a1a1a] border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C2B280]/60 min-w-0"
            />
            <select
              value={form.projectType}
              onChange={(e) => setForm({ ...form, projectType: e.target.value })}
              aria-label="Tipo de proyecto"
              className="bg-[#1a1a1a] border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C2B280]/60 min-w-0"
            >
              {TIPOS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <input
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              placeholder="Presupuesto indicado (ej: $2M - $3M COP)"
              maxLength={80}
              className="bg-[#1a1a1a] border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C2B280]/60 min-w-0"
            />
          </div>
          <textarea
            value={form.need}
            onChange={(e) => setForm({ ...form, need: e.target.value })}
            placeholder="Necesidad del cliente * — pega aquí lo que contó en el chat o el resumen del email del lead…"
            rows={4}
            maxLength={2000}
            className="w-full mt-3 bg-[#1a1a1a] border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C2B280]/60 resize-y"
          />
          <textarea
            value={form.extra}
            onChange={(e) => setForm({ ...form, extra: e.target.value })}
            placeholder="Detalles extra (opcional): plazos, referencias, integraciones que mencionó…"
            rows={2}
            maxLength={1500}
            className="w-full mt-3 bg-[#1a1a1a] border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C2B280]/60 resize-y"
          />

          <button
            onClick={generate}
            disabled={generating}
            className="mt-4 w-full sm:w-auto bg-[#C2B280] hover:bg-[#d4c493] disabled:opacity-40 text-black font-semibold text-sm px-6 py-3 rounded-xl transition"
          >
            {generating ? "✍️ Redactando borrador…" : "✨ Generar borrador de propuesta"}
          </button>
          {genError && <p className="text-red-400 text-xs mt-3">{genError}</p>}
        </div>

        {/* Borrador editable */}
        {proposal && (
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-5 mb-6">
            <h2 className="text-white text-sm font-semibold mb-1">
              2 · Borrador — revísalo y edítalo <span className="text-gray-500 font-normal">(Markdown simple)</span>
            </h2>
            <p className="text-gray-500 text-xs mb-3">
              Tu requisito: nada sale sin tu aprobación. Todo lo que escribas aquí es
              lo que se copia o descarga.
            </p>
            <textarea
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              rows={18}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-3 text-[13px] text-gray-100 font-mono leading-relaxed focus:outline-none focus:border-[#C2B280]/60 resize-y"
            />
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={copyPlain}
                className="bg-[#C2B280] hover:bg-[#d4c493] text-black font-semibold text-xs px-4 py-2.5 rounded-lg transition"
              >
                📋 Copiar para WhatsApp/email
              </button>
              <button
                onClick={downloadHtml}
                className="bg-[#1a1a1a] hover:bg-[#262626] border border-gray-700 text-gray-100 text-xs px-4 py-2.5 rounded-lg transition"
              >
                ⬇️ Descargar HTML (PDF)
              </button>
              <button
                onClick={saveToHistory}
                className="bg-[#1a1a1a] hover:bg-[#262626] border border-gray-700 text-gray-100 text-xs px-4 py-2.5 rounded-lg transition"
              >
                💾 Guardar en historial
              </button>
              <button
                onClick={generate}
                disabled={generating}
                className="bg-[#1a1a1a] hover:bg-[#262626] border border-gray-700 text-gray-100 disabled:opacity-40 text-xs px-4 py-2.5 rounded-lg transition"
              >
                🔄 Regenerar
              </button>
            </div>
          </div>
        )}

        {/* Historial */}
        {history.length > 0 && (
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-5 mb-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white text-sm font-semibold">
                Historial <span className="text-gray-500 font-normal">({history.length}/20 · solo este navegador)</span>
              </h2>
              <button
                onClick={() => persistHistory([])}
                className="text-gray-500 hover:text-red-400 text-[11px] transition"
              >
                Vaciar
              </button>
            </div>
            <ul className="space-y-2">
              {history.map((h) => (
                <li
                  key={h.id}
                  className="flex items-center justify-between gap-3 bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-gray-100 text-sm truncate">
                      {h.clientName}{" "}
                      <span className="text-gray-500 text-xs">
                        · {TIPOS.find((t) => t.id === h.projectType)?.label || h.projectType}
                      </span>
                    </p>
                    <p className="text-gray-600 text-[11px]">
                      {new Date(h.date).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => loadFromHistory(h)}
                      className="text-[#C2B280] hover:text-[#d4c493] text-xs transition"
                    >
                      Abrir
                    </button>
                    <button
                      onClick={() => removeFromHistory(h.id)}
                      className="text-gray-500 hover:text-red-400 text-xs transition"
                    >
                      Borrar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-gray-600 text-[11px] text-center pb-6">
          Panel privado · no indexado · WhatsApp {WHATSAPP.replace("57", "+57 ")}
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
