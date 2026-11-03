/**
 * Abre los componentes flotantes (chat, aviso de cookies, formulario de
 * propuesta) y guarda capturas para revisión visual.
 *
 *   node scripts/qa-modales.mjs [base] [salida]
 */

import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = process.argv[2] || "http://localhost:3105";
const salida = process.argv[3] || "C:/Users/Asus/AppData/Local/Temp/opencode/modales";
await mkdir(salida, { recursive: true });

const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const navegador = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

const pagina = await navegador.newPage();
await pagina.setViewport({ width: 1280, height: 900 });

const errores = [];
pagina.on("console", (m) => {
  if (m.type() === "error") errores.push(m.text().slice(0, 160));
});

// 1. Aviso de cookies (sin consentimiento previo)
await pagina.goto(base + "/", { waitUntil: "networkidle2" });
await pagina.evaluate(() => {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {}
});
await pagina.reload({ waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 900));
await pagina.screenshot({ path: path.join(salida, "cookies.png") });

// 2. Chat abierto
await pagina.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find((x) =>
    /solo necesarias/i.test(x.textContent || "")
  );
  if (b) b.click();
  const chat = [...document.querySelectorAll("button")].find((x) =>
    /chat|alma|asistente|hablar/i.test(
      `${x.getAttribute("aria-label") || ""} ${x.textContent || ""}`
    )
  );
  if (chat) chat.click();
});
await new Promise((r) => setTimeout(r, 900));
await pagina.screenshot({ path: path.join(salida, "chat.png") });

// 3. Formulario de propuesta (lo abre el chat cuando el lead avanza)
const abierto = await pagina.evaluate(() => {
  const b = [...document.querySelectorAll("button, a")].find((x) =>
    /propuesta/i.test(x.textContent || "")
  );
  if (b) {
    b.click();
    return true;
  }
  return false;
});
await new Promise((r) => setTimeout(r, 900));
if (abierto) await pagina.screenshot({ path: path.join(salida, "propuesta.png") });

await pagina.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
await pagina.goto(base + "/", { waitUntil: "networkidle2" });
await pagina.evaluate(() => {
  try {
    localStorage.clear();
  } catch {}
});
await pagina.reload({ waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 900));
await pagina.screenshot({ path: path.join(salida, "cookies-movil.png") });

await navegador.close();
console.log("capturas en", salida);
console.log(errores.length ? [...new Set(errores)].join("\n") : "sin errores de consola");
