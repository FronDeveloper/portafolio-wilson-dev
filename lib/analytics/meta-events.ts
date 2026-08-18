/**
 * Helper para disparar eventos del Pixel de Meta desde el cliente.
 *
 * Pixel ID: 864423433128485 (compartido con AgendaPro)
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
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

export function trackMetaEvent(
  eventName: MetaEventName,
  params?: MetaEventParams
): void {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") {
    if (process.env.NODE_ENV === "development") {
      console.debug("[Meta Pixel] Evento no disparado (fbq no cargado):", eventName, params);
    }
    return;
  }

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
  if (typeof window.fbq !== "function") return;

  if (params && Object.keys(params).length > 0) {
    window.fbq("trackCustom", eventName, params);
  } else {
    window.fbq("trackCustom", eventName);
  }
}

export function captureUTMParams(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};

  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
  ];

  for (const key of utmKeys) {
    const value = urlParams.get(key);
    if (value) {
      utmParams[key] = value;
    }
  }

  return utmParams;
}
