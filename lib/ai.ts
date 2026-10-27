/**
 * ============================================================
 *  Capa de IA compartida (Alma + propuestas)  ·  SERVER-ONLY
 * ============================================================
 *  Cadena de proveedores:
 *    1. Groq `openai/gpt-oss-120b` (principal, rápido y barato)
 *    2. Groq `openai/gpt-oss-20b` (fallback ante 429/5xx/timeout)
 *    3. OpenRouter con GLM (opcional, solo si existe OPENROUTER_API_KEY)
 *
 *  Reintenta con backoff exponencial los errores transitorios
 *  (429, 408, 409, 5xx y fallos de red). No reintenta 401/403.
 *
 *  Variables de entorno:
 *    GROQ_API_KEY          (obligatoria para el proveedor Groq)
 *    GROQ_MODEL            (opcional; por defecto openai/gpt-oss-120b)
 *    OPENROUTER_API_KEY    (opcional)
 *    OPENROUTER_MODEL      (opcional; por defecto z-ai/glm-5.3-flash, 1M ctx)
 *    AI_PROVIDER           ("openrouter" para intentar GLM primero)
 * ============================================================
 */

import { SITE_URL } from "./pricing";

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface CompletionResult {
  text: string;
  provider: string;
  model: string;
}

export interface CompletionOptions {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  /** Presupuesto total de tiempo para toda la cadena (ms) */
  timeoutMs?: number;
}

interface Proveedor {
  id: string;
  url: string;
  apiKey: string;
  model: string;
  headers: Record<string, string>;
}

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b";
const GROQ_FALLBACK_MODEL = "openai/gpt-oss-20b";
const DEFAULT_OPENROUTER_MODEL = "z-ai/glm-5.3-flash";

function construirProveedores(): Proveedor[] {
  const groq: Proveedor[] = [];
  const openrouter: Proveedor[] = [];

  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    const principal = process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL;
    const modelos = [principal];
    if (principal !== GROQ_FALLBACK_MODEL) modelos.push(GROQ_FALLBACK_MODEL);

    for (const model of modelos) {
      groq.push({
        id: "groq",
        url: GROQ_URL,
        apiKey: groqKey,
        model,
        headers: {},
      });
    }
  }

  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey) {
    openrouter.push({
      id: "openrouter",
      url: OPENROUTER_URL,
      apiKey: openrouterKey,
      model: process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
      headers: {
        "HTTP-Referer": SITE_URL,
        "X-Title": "Alma - Wilson Valencia Dev",
      },
    });
  }

  return process.env.AI_PROVIDER === "openrouter"
    ? [...openrouter, ...groq]
    : [...groq, ...openrouter];
}

export function hayProveedorIA(): boolean {
  return Boolean(process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const TRANSIENT_STATUS = new Set([408, 409, 425, 429, 500, 502, 503, 504]);

function retryAfterMs(res: Response): number | null {
  const raw = res.headers.get("retry-after");
  if (!raw) return null;
  const seconds = Number(raw);
  if (Number.isFinite(seconds)) return Math.min(seconds * 1000, 5000);
  const date = Date.parse(raw);
  if (Number.isFinite(date)) return Math.min(Math.max(date - Date.now(), 0), 5000);
  return null;
}

interface IntentoResultado {
  ok: boolean;
  text?: string;
  status?: number;
  retryAfter?: number | null;
  error?: string;
}

async function intentar(
  proveedor: Proveedor,
  options: Required<Pick<CompletionOptions, "messages" | "temperature" | "maxTokens">>,
  timeoutMs: number
): Promise<IntentoResultado> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(proveedor.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${proveedor.apiKey}`,
        "Content-Type": "application/json",
        ...proveedor.headers,
      },
      body: JSON.stringify({
        model: proveedor.model,
        messages: options.messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        ok: false,
        status: res.status,
        retryAfter: retryAfterMs(res),
        error: body.slice(0, 400),
      };
    }

    const json = await res.json();
    const text: string = json?.choices?.[0]?.message?.content?.trim() || "";
    return { ok: Boolean(text), text: text || undefined };
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : String(err);
    return { ok: false, error: mensaje };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Devuelve el texto del primer proveedor que responda, o `null` si
 * toda la cadena falla. Nunca lanza: el llamador decide el fallback.
 */
export async function completarChat(
  options: CompletionOptions
): Promise<CompletionResult | null> {
  const proveedores = construirProveedores();
  if (proveedores.length === 0) return null;

  const presupuestoMs = options.timeoutMs ?? 40_000;
  const inicio = Date.now();
  const params = {
    messages: options.messages,
    temperature: options.temperature ?? 0.6,
    maxTokens: options.maxTokens ?? 700,
  };

  for (const proveedor of proveedores) {
    const restante = presupuestoMs - (Date.now() - inicio);
    if (restante < 3_000) break;

    for (let intento = 0; intento < 2; intento++) {
      const restanteIntento = presupuestoMs - (Date.now() - inicio);
      if (restanteIntento < 3_000) break;

      const timeoutIntento = Math.min(20_000, restanteIntento);
      const resultado = await intentar(proveedor, params, timeoutIntento);

      if (resultado.ok && resultado.text) {
        console.log(
          `[IA] Respuesta de ${proveedor.id}/${proveedor.model} (intento ${
            intento + 1
          })`
        );
        return {
          text: resultado.text,
          provider: proveedor.id,
          model: proveedor.model,
        };
      }

      const status = resultado.status;
      const transitorio =
        status === undefined || TRANSIENT_STATUS.has(status); // undefined = red/timeout

      console.warn(
        `[IA] ${proveedor.id}/${proveedor.model} falló${
          status ? ` (${status})` : ""
        }${resultado.error ? `: ${resultado.error}` : ""}`
      );

      if (!transitorio) break; // 400/401/403: no insistir con este proveedor

      if (intento === 0) {
        const espera = resultado.retryAfter ?? 700;
        const restanteEspera = presupuestoMs - (Date.now() - inicio);
        if (restanteEspera <= espera + 2_000) break;
        await sleep(espera);
      }
    }
  }

  console.error("[IA] Todos los proveedores fallaron");
  return null;
}
