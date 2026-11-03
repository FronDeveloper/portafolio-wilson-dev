/**
 * Captura del panel interno (pantalla de acceso y, si hay clave en el entorno,
 * las vistas privadas). Uso: node scripts/qa-panel.mjs [base] [clave]
 */
import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] || "http://localhost:3105";
const clave = process.argv[3] || process.env.PANEL_PASSWORD || "";
const salida = "C:/Users/Asus/AppData/Local/Temp/opencode/panel";
await mkdir(salida, { recursive: true });

const navegador = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});
const pagina = await navegador.newPage();
await pagina.setViewport({ width: 1280, height: 900 });

await pagina.goto(`${base}/panel`, { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 600));
await pagina.screenshot({ path: `${salida}/acceso.png` });

if (clave) {
  await pagina.evaluate((k) => {
    const input = document.querySelector('input[type="password"]');
    if (input) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      ).set;
      setter.call(input, k);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
    const form = document.querySelector("form");
    if (form) form.requestSubmit();
  }, clave);
  await new Promise((r) => setTimeout(r, 2500));
  await pagina.screenshot({ path: `${salida}/inicio.png`, fullPage: true });
  await pagina.goto(`${base}/panel/leads`, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 800));
  await pagina.screenshot({ path: `${salida}/leads.png`, fullPage: true });
}

await navegador.close();
console.log("capturas en", salida);
