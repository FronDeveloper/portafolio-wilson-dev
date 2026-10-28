/**
 * Verificación de sesión del panel, compartida por las APIs nuevas.
 * La cookie es la misma de /panel (PANEL_PASSWORD → 7 días).
 */

import { PANEL_COOKIE, isValidPanelToken } from "./proposal";

export function readPanelCookie(request: Request): string | null {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === PANEL_COOKIE) return rest.join("=");
  }
  return null;
}

export function panelAuthed(request: Request): boolean {
  return isValidPanelToken(readPanelCookie(request));
}
