/**
 * Consentimiento de cookies/analytics.
 * Se guarda en localStorage y se avisa al resto de la app con un evento.
 */

export type ConsentValue = "granted" | "denied";

const CONSENT_KEY = "wv_cookie_consent_v1";
const CONSENT_EVENT = "wv-consent-change";
const OPEN_EVENT = "wv-open-consent";
const SIX_MONTHS = 1000 * 60 * 60 * 24 * 180;

interface ConsentRecord {
  value: ConsentValue;
  ts: number;
}

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (parsed?.value !== "granted" && parsed?.value !== "denied") return null;
    if (!parsed.ts || Date.now() - parsed.ts > SIX_MONTHS) {
      localStorage.removeItem(CONSENT_KEY);
      return null;
    }
    return parsed.value;
  } catch {
    return null;
  }
}

export function setConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ value, ts: Date.now() } satisfies ConsentRecord)
    );
  } catch {
    /* modo privado: se aplica solo a esta sesión */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

export function hasAnalyticsConsent(): boolean {
  return getConsent() === "granted";
}

export function onConsentChange(
  callback: (value: ConsentValue) => void
): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<ConsentValue>).detail;
    if (detail === "granted" || detail === "denied") callback(detail);
  };
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}

/** Abre el banner de nuevo (por ejemplo, desde /privacidad). */
export function openConsentSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenConsentSettings(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(OPEN_EVENT, callback);
  return () => window.removeEventListener(OPEN_EVENT, callback);
}
