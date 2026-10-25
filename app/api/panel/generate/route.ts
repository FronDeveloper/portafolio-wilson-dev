import { NextResponse } from "next/server";
import {
  PROJECT_TYPE_LABELS,
  PROPOSAL_SYSTEM_PROMPT,
  buildProposalUserPrompt,
  clientIp,
  createRateLimiter,
  isValidPanelToken,
  type ProposalInput,
} from "@/lib/proposal";

/**
 * POST /api/panel/generate  (requiere cookie de sesión del panel)
 * Recibe los datos del lead y devuelve un BORRADOR de propuesta (Markdown)
 * generado con Groq. Wilson lo edita y lo entrega él mismo — nada se envía
 * automáticamente al cliente.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL_DEFAULT = "openai/gpt-oss-120b";

const limited = createRateLimiter(20, 60 * 60 * 1000); // 20 propuestas/hora

function readCookie(request: Request): string | null {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === "alma_panel") return rest.join("=");
  }
  return null;
}

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(request: Request) {
  // Sesión del panel
  if (!isValidPanelToken(readCookie(request))) {
    return NextResponse.json(
      { error: "Sesión no válida. Inicia sesión de nuevo en /panel." },
      { status: 401 }
    );
  }

  if (limited(clientIp(request))) {
    return NextResponse.json(
      { error: "Límite de generaciones por hora alcanzado. Espera un rato." },
      { status: 429 }
    );
  }

  // Entrada
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const data: ProposalInput = {
    clientName: str(body.clientName, 80),
    contact: str(body.contact, 120),
    projectType: str(body.projectType, 20) in PROJECT_TYPE_LABELS ? str(body.projectType, 20) : "otro",
    need: str(body.need, 2000),
    budget: str(body.budget, 80),
    extra: str(body.extra, 1500),
  };

  if (data.clientName.length < 2) {
    return NextResponse.json(
      { error: "Escribe el nombre del cliente." },
      { status: 400 }
    );
  }
  if (data.need.length < 10) {
    return NextResponse.json(
      { error: "Describe la necesidad del cliente (mínimo 10 caracteres)." },
      { status: 400 }
    );
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY no está configurada en Vercel." },
      { status: 503 }
    );
  }

  // Groq
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
        messages: [
          { role: "system", content: PROPOSAL_SYSTEM_PROMPT },
          { role: "user", content: buildProposalUserPrompt(data) },
        ],
        temperature: 0.4,
        max_tokens: 1500,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`[Panel] Groq error ${res.status}:`, errText.slice(0, 400));
      return NextResponse.json(
        {
          error:
            res.status === 401 || res.status === 403
              ? "GROQ_API_KEY inválida — genera otra en console.groq.com/keys."
              : "Groq no respondió correctamente. Intenta de nuevo en unos segundos.",
        },
        { status: 502 }
      );
    }

    const json = await res.json();
    const proposal: string = json?.choices?.[0]?.message?.content?.trim() || "";

    if (!proposal) {
      return NextResponse.json(
        { error: "La IA devolvió una respuesta vacía. Genera de nuevo." },
        { status: 502 }
      );
    }

    console.log(
      `[Panel] Borrador generado para ${data.clientName} (${data.projectType})`
    );
    return NextResponse.json({ proposal });
  } catch (error) {
    console.error("[Panel] generate error:", error);
    return NextResponse.json(
      { error: "No se pudo generar el borrador. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
