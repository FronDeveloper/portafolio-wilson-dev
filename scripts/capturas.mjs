/**
 * Capturas de QA del sitio: una por ruta, en escritorio y móvil.
 *
 *   node scripts/capturas.mjs http://localhost:3105 [salida]
 *
 * Guarda PNG a página completa y reporta errores de consola y de red.
 * Requiere Chrome instalado (puppeteer-core usa el del sistema).
 */

import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = process.argv[2] || "http://localhost:3105";
const salida = process.argv[3] || "C:/Users/Asus/AppData/Local/Temp/opencode/capturas";
await mkdir(salida, { recursive: true });

const RUTAS = [
  "/",
  "/about",
  "/projects",
  "/projects/faebo",
  "/projects/flowbill",
  "/projects/plataforma-educativa",
  "/contact",
  "/cotizar",
  "/testimonios",
  "/privacidad",
  "/terminos",
  "/gracias",
  "/no-existe-404",
];

const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const navegador = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

const problemas = [];

for (const dispositivo of [
  { nombre: "desktop", width: 1440, height: 900 },
  { nombre: "mobile", width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 },
]) {
  const pagina = await navegador.newPage();
  await pagina.setViewport(dispositivo);

  pagina.on("console", (m) => {
    if (m.type() === "error") problemas.push(`[${dispositivo.nombre}] consola: ${m.text().slice(0, 160)}`);
  });
  pagina.on("requestfailed", (r) => {
    problemas.push(`[${dispositivo.nombre}] red: ${r.url().slice(0, 120)}`);
  });

  for (const ruta of RUTAS) {
    const archivo = path.join(salida, `${dispositivo.nombre}${ruta.replaceAll("/", "_") || "_home"}.png`);
    await pagina.goto(base + ruta, { waitUntil: "networkidle2", timeout: 45000 });
    await pagina.evaluate(async () => {
      // Recorre la página por tramos: un salto directo al final deja las
      // secciones intermedias sin entrar nunca al viewport, y sus animaciones
      // de entrada (framer-motion) se quedan en opacidad 0.
      document.documentElement.style.scrollBehavior = "auto";
      const alto = window.innerHeight;
      const total = document.body.scrollHeight;
      for (let y = 0; y < total; y += alto / 2) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });
    // cierra el aviso de cookies para que no tape el contenido
    await pagina.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) =>
        /solo necesarias/i.test(x.textContent || "")
      );
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 250));
    await pagina.screenshot({ path: archivo, fullPage: true });
  }

  await pagina.close();
}

await navegador.close();
await mkdir(salida, { recursive: true });

console.log("capturas en", salida);
const unicos = [...new Set(problemas)];
console.log(unicos.length ? unicos.join("\n") : "sin errores de consola ni de red");
