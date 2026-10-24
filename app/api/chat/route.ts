import { NextResponse } from "next/server";
import { Resend } from "resend";
import { ASSISTANT_NAME, DEFAULT_NOTIFY_EMAIL, SYSTEM_PROMPT, WHATSAPP_PHONE } from "@/lib/assistant";

// Igual que las demás rutas del portafolio: nunca evaluar en build
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Respuestas largas de la IA sin que Vercel corte la request (Hobby: 10s por defecto)
export const maxDuration = 60;

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL_DEFAULT = "openai/gpt-oss-120b";

// ── Rate limit simple en memoria (por instancia del serverless) ─────────────
const RATE_LIMIT = 25; // mensajes por hora por IP
const WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    if (hits.size > 500) {
      for (const [key, value] of hits) if (now > value.reset) hits.delete(key);
    }
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

// ── Validación del historial que llega del cliente ───────────────────────────
type ChatMsg = { role: "user" | "assistant"; content: string };

function sanitizeHistory(input: unknown): ChatMsg[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(
      (m): m is ChatMsg =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0 &&
        m.content.length <= 1000
    )
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.trim() }));
}

// ── Extracción del lead (línea @@LEAD@@{...} que genera la IA) ──────────────
type LeadData = { name: string; contact: string; need: string; budget: string };

const LEAD_MARKER = "@@LEAD@@";

function extractLead(reply: string): { visibleReply: string; lead: LeadData | null } {
  const markerIdx = reply.indexOf(LEAD_MARKER);
  if (markerIdx === -1) return { visibleReply: reply.trim(), lead: null };

  const visibleReply = reply.slice(0, markerIdx).trim();
  try {
    // Tomar todo lo que sigue al marcador y recortar el JSON entre el primer
    // "{" y el último "}" — tolera fences de código (```json) o texto extra.
    const after = reply.slice(markerIdx + LEAD_MARKER.length);
    const start = after.indexOf("{");
    const end = after.lastIndexOf("}");
    if (start === -1 || end <= start) return { visibleReply, lead: null };

    const parsed = JSON.parse(after.slice(start, end + 1)) as Record<string, unknown>;
    const str = (v: unknown, max: number) =>
      typeof v === "string" ? v.trim().slice(0, max) : "";

    const lead: LeadData = {
      name: str(parsed.name, 80),
      contact: str(parsed.contact, 120),
      need: str(parsed.need, 500),
      budget: str(parsed.budget, 80),
    };

    // Contacto válido: email o teléfono (>= 7 dígitos)
    const hasEmail = /.+@.+\..+/.test(lead.contact);
    const hasPhone = (lead.contact.replace(/\D/g, "") || "").length >= 7;
    if (lead.name && lead.need && (hasEmail || hasPhone)) {
      return { visibleReply, lead };
    }
  } catch {
    // JSON malformado: se ignora el lead, la respuesta igual se muestra
  }
  return { visibleReply, lead: null };
}

// ── Email con Resend (mismo patrón que /api/cotizar) ────────────────────────
let _resend: Resend | null = null;
function getResend(): Resend {
  if (_resend) return _resend;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY no está configurada");
  _resend = new Resend(apiKey);
  return _resend;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function transcriptHtml(messages: ChatMsg[]): string {
  return messages
    .map((m) => {
      const isUser = m.role === "user";
      const label = isUser ? "👤 Visitante" : `✨ ${ASSISTANT_NAME}`;
      const color = isUser ? "#fff" : "#C2B280";
      return `
      <div style="margin-bottom: 14px;">
        <div style="font-size: 11px; color: #888; margin-bottom: 3px;">${label}</div>
        <div style="background: ${isUser ? "#111" : "#1a1a1a"}; border: 1px solid #333; border-left: 3px solid ${color}; border-radius: 8px; padding: 12px 14px;">
          <p style="color: #ddd; font-size: 13px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${escapeHtml(m.content)}</p>
        </div>
      </div>`;
    })
    .join("");
}

async function notifyLeadByEmail(lead: LeadData, messages: ChatMsg[]): Promise<boolean> {
  try {
    const resend = getResend();
    const to = process.env.NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL;

    const contactIsPhone = (lead.contact.replace(/\D/g, "") || "").length >= 7 && !lead.contact.includes("@");
    const contactLink = contactIsPhone
      ? `<a href="https://wa.me/${lead.contact.replace(/\D/g, "")}?text=${encodeURIComponent(
          `Hola ${lead.name}, vi tu mensaje en mi portafolio 👋`
        )}" style="color: #25D366;">${escapeHtml(lead.contact)}</a>`
      : `<a href="mailto:${escapeHtml(lead.contact)}" style="color: #C2B280;">${escapeHtml(lead.contact)}</a>`;

    const { error } = await resend.emails.send({
      from: "Chatbot Portafolio <onboarding@resend.dev>",
      to: [to],
      subject: `✨ Nuevo lead de ${ASSISTANT_NAME} — ${lead.name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0B0B0B; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #C2B280; font-size: 24px; margin-bottom: 5px;">¡Nuevo lead de ${ASSISTANT_NAME}!</h1>
            <p style="color: #888; font-size: 13px;">Tu asistente virtual capturó un interés en wvalencia-dev.vercel.app</p>
          </div>

          <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
            <h2 style="color: #fff; font-size: 18px; margin-bottom: 15px;">📋 Datos del visitante</h2>
            <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #888; width: 130px;">Nombre:</td><td style="padding: 8px 0; color: #fff; font-weight: 600;">${escapeHtml(lead.name)}</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Contacto:</td><td style="padding: 8px 0;">${contactLink}</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Presupuesto:</td><td style="padding: 8px 0; color: #fff;">${lead.budget ? escapeHtml(lead.budget) : "No indicó"}</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Necesidad:</td><td style="padding: 8px 0; color: #fff;">${escapeHtml(lead.need)}</td></tr>
            </table>
          </div>

          <div style="background: #111; border: 1px solid #333; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
            <h2 style="color: #fff; font-size: 18px; margin-bottom: 15px;">💬 Conversación completa</h2>
            ${transcriptHtml(messages)}
          </div>

          <div style="text-align: center; margin-top: 25px;">
            ${contactIsPhone
              ? `<a href="https://wa.me/${lead.contact.replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Hola ${lead.name}, vi tu mensaje en mi portafolio 👋`
                )}" style="display: inline-block; background: #25D366; color: #000; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
                  💬 Responder por WhatsApp
                </a>`
              : `<a href="mailto:${escapeHtml(lead.contact)}" style="display: inline-block; background: #C2B280; color: #000; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
                  ✉️ Responder por email
                </a>`}
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #555; font-size: 11px;">
              Lead capturado por ${ASSISTANT_NAME}, la asistente virtual del portafolio<br>
              ${new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("[Alma] Resend error (chat lead):", JSON.stringify(error));
      return false;
    }
    console.log("[Alma] Email del lead enviado ✅ →", to);
    return true;
  } catch (err) {
    console.error("[Alma] Email notify error (chat lead):", err);
    return false;
  }
}

// ── Avisos push instantáneos (opcionales, con variables de entorno) ─────────
// Telegram: gratuito y disponible ya (canal recomendado para aviso inmediato).
// CallMeBot: WhatsApp real hacia el número de Wilson (requiere apikey propia;
// el bot gratuito estuvo sin cupos — si se activa, solo agregar las env vars).

function leadText(lead: LeadData): string {
  return [
    "🔔 NUEVO LEAD — Alma (portafolio)",
    "",
    `👤 Nombre: ${lead.name}`,
    `📞 Contacto: ${lead.contact}`,
    `💰 Presupuesto: ${lead.budget || "No indicó"}`,
    `💬 Necesidad: ${lead.need}`,
    "",
    `Hora: ${new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}`,
  ].join("\n");
}

async function notifyByTelegram(lead: LeadData): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.log("[Alma] Telegram no configurado (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID) — sin aviso por Telegram");
    return false;
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: leadText(lead) }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.error(`[Alma] Telegram error ${res.status}:`, t.slice(0, 300));
      return false;
    }
    console.log("[Alma] Aviso por Telegram enviado ✅");
    return true;
  } catch (err) {
    console.error("[Alma] Telegram excepción:", err);
    return false;
  }
}

async function notifyByCallMeBot(lead: LeadData): Promise<boolean> {
  const phone = process.env.CALLMEBOT_PHONE; // formato +573012821174
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) {
    console.log("[Alma] CallMeBot no configurado (CALLMEBOT_PHONE / CALLMEBOT_APIKEY) — sin aviso por WhatsApp");
    return false;
  }
  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
      phone
    )}&text=${encodeURIComponent(leadText(lead))}&apikey=${encodeURIComponent(apikey)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    const body = await res.text().catch(() => "");
    if (!res.ok) {
      console.error(`[Alma] CallMeBot error ${res.status}:`, body.slice(0, 300));
      return false;
    }
    console.log("[Alma] Aviso por WhatsApp (CallMeBot) enviado ✅");
    return true;
  } catch (err) {
    console.error("[Alma] CallMeBot excepción:", err);
    return false;
  }
}

// ── POST /api/chat ───────────────────────────────────────────────────────────
const FALLBACK_REPLY = `Ups, tuve un problema técnico momentáneo 😅. Puedes escribirle a Wilson directo por WhatsApp: https://wa.me/${WHATSAPP_PHONE} — o intenta de nuevo en unos segundos.`;

export async function POST(request: Request) {
  // Rate limit
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        reply: `Estoy recibiendo muchos mensajes ahora mismo 😅. Escríbele directo a Wilson por WhatsApp: https://wa.me/${WHATSAPP_PHONE}`,
        leadSaved: false,
      },
      { status: 429 }
    );
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY no está configurada");
    return NextResponse.json(
      { reply: FALLBACK_REPLY, leadSaved: false },
      { status: 200 }
    );
  }

  // Validar entrada
  let body: { messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const history = sanitizeHistory(body.messages);
  if (history.length === 0 || !history.some((m) => m.role === "user")) {
    return NextResponse.json({ error: "Historial inválido" }, { status: 400 });
  }

  // Llamar a Groq (últimos 14 mensajes + system prompt)
  const payload = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-14),
  ];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || GROQ_MODEL_DEFAULT,
        messages: payload,
        temperature: 0.6,
        max_tokens: 700,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`Groq error ${res.status}:`, errText.slice(0, 500));
      return NextResponse.json(
        { reply: FALLBACK_REPLY, leadSaved: false },
        { status: 200 }
      );
    }

    const data = await res.json();
    const rawReply: string = data?.choices?.[0]?.message?.content?.trim() || "";

    if (!rawReply) {
      return NextResponse.json(
        { reply: FALLBACK_REPLY, leadSaved: false },
        { status: 200 }
      );
    }

    // Extraer lead si viene
    const { visibleReply, lead } = extractLead(rawReply);

    // Diagnóstico: la IA intentó capturar un lead pero los datos no pasaron
    // la validación (falta nombre, contacto válido o necesidad).
    if (!lead && rawReply.includes(LEAD_MARKER)) {
      console.warn(
        "[Alma] Marcador @@LEAD@@ presente pero inválido. Cola de la respuesta:",
        rawReply.slice(-400)
      );
    }

    // Historial completo para el email del lead
    const fullHistory: ChatMsg[] = [...history];
    if (lead) {
      fullHistory.push({ role: "assistant", content: visibleReply });
    }

    let leadSaved = false;
    const channels: Record<string, boolean | null> = {
      email: null,
      telegram: null,
      whatsapp_callmebot: null,
    };

    if (lead) {
      console.log("[Alma] Lead detectado:", JSON.stringify(lead));

      // Email (canal principal) + avisos push opcionales, en paralelo
      const [emailRes, tgRes, cbRes] = await Promise.allSettled([
        notifyLeadByEmail(lead, fullHistory),
        notifyByTelegram(lead),
        notifyByCallMeBot(lead),
      ]);

      const emailOk = emailRes.status === "fulfilled" ? emailRes.value : false;
      const telegramOk = tgRes.status === "fulfilled" ? tgRes.value : false;
      const callmebotOk = cbRes.status === "fulfilled" ? cbRes.value : false;

      channels.email = emailOk;
      channels.telegram = telegramOk;
      channels.whatsapp_callmebot = callmebotOk;

      leadSaved = emailOk || telegramOk || callmebotOk;

      if (!emailOk) {
        console.error(
          "[Alma] ⚠️ Email del lead NO enviado — corre /api/chat-diagnostics?key=TU_CLAVE o revisa resend.com → Logs:",
          JSON.stringify(lead)
        );
      }
      if (!leadSaved) {
        // Copia de seguridad: el lead completo queda en los logs de Vercel
        console.error(
          "[Alma] ⚠️⚠️ Lead NO entregado por ningún canal. Copia para contacto manual:",
          JSON.stringify(lead)
        );
      }
    }

    return NextResponse.json({
      reply: visibleReply || FALLBACK_REPLY,
      leadSaved,
      leadCaptured: !!lead,
      leadName: lead?.name || null,
      channels,
    });
  } catch (error) {
    console.error("API chat error:", error);
    return NextResponse.json(
      { reply: FALLBACK_REPLY, leadSaved: false },
      { status: 200 }
    );
  }
}
