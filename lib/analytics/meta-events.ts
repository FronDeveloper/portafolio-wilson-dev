/**
 * Analítica del portafolio.
 *
 * Reglas:
 *  - Nada se envía a Meta/Google sin consentimiento explícito.
 *  - La atribución (UTM + página + referrer) vive 90 días para que el
 *    lead llegue con su origen aunque navegue antes de cotizar.
 */

import { hasAnalyticsConsent } from "./consent";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export type MetaEventName =
  | "PageView"
  | "ViewContent"
  | "Lead"
  | "Contact"
  | "CompleteRegistration";

export interface MetaEventParams {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
  status?: string;
  source?: string;
  [key: string]: unknown;
}

const ATTRIBUTION_KEY = "wv_attribution_v1";
const NINETY_DAYS = 1000 * 60 * 60 * 24 * 90;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "msclkid",
] as const;

interface Attribution {
  utm: Record<string, string>;
  page: string;
  referrer: string;
  landing: string;
  ts: number;
}

function readAttribution(): Attribution | null {
  try {
    const raw = localStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Attribution;
    if (!parsed?.ts || Date.now() - parsed.ts > NINETY_DAYS) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Lee los UTM de la URL actual, los fusiona con los guardados y devuelve
 * un objeto plano listo para enviar con el lead.
 */
export function captureUTMParams(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const desdeUrl: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) desdeUrl[key] = value.slice(0, 160);
  }

  const previo = readAttribution();
  const hayUtm = Object.keys(desdeUrl).length > 0;

  const registro: Attribution = {
    utm: hayUtm ? { ...(previo?.utm || {}), ...desdeUrl } : previo?.utm || {},
    page: window.location.pathname || "/",
    referrer:
      previo?.referrer ||
      (document.referrer ? document.referrer.slice(0, 300) : ""),
    landing: previo?.landing || window.location.pathname || "/",
    ts: hayUtm || !previo ? Date.now() : previo.ts,
  };

  try {
    localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(registro));
  } catch {
    /* modo privado: se envía solo lo de esta página */
  }

  return {
    ...registro.utm,
    page: registro.page,
    referrer: registro.referrer,
  };
}

/** Atribución completa (incluye landing) para diagnósticos o emails. */
export function getAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const actual = captureUTMParams();
  const guardado = readAttribution();
  return {
    ...actual,
    landing: guardado?.landing || actual.page || "/",
  };
}

export function trackMetaEvent(
  eventName: MetaEventName,
  params?: MetaEventParams
): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) {
    if (process.env.NODE_ENV === "development") {
      console.debug("[Meta Pixel] Sin consentimiento, evento omitido:", eventName);
    }
    return;
  }
  if (typeof window.fbq !== "function") return;

  if (params && Object.keys(params).length > 0) {
    window.fbq("track", eventName, params);
  } else {
    window.fbq("track", eventName);
  }

  if (process.env.NODE_ENV === "development") {
    console.debug("[Meta Pixel] Evento disparado:", eventName, params);
  }
}

export function trackMetaCustomEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  if (typeof window.fbq !== "function") return;

  if (params && Object.keys(params).length > 0) {
    window.fbq("trackCustom", eventName, params);
  } else {
    window.fbq("trackCustom", eventName);
  }
}

/** Evento GA4 opcional (solo con consentimiento). */
export function trackGAEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params || {});
}
