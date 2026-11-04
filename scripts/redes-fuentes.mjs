/**
 * Descarga las fuentes que usan las plantillas de redes (subset latin).
 *   node scripts/redes-fuentes.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const destino = "C:/Users/Asus/wilson-portfolio/docs/redes/fuentes";
await mkdir(destino, { recursive: true });

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

async function css(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  return r.text();
}

/** Devuelve la URL del bloque @font-face cuyo unicode-range es latin. */
function latinUrl(texto) {
  const bloques = texto.split("@font-face").slice(1);
  const latin = bloques.find((b) => /U\+0000-00FF/.test(b));
  const m = latin?.match(/url\((https:[^)]+\.woff2)\)/);
  return m?.[1];
}

const trabajos = [
  ["inter-400.woff2", "https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap"],
  ["inter-500.woff2", "https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap"],
  ["inter-600.woff2", "https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap"],
  ["inter-700.woff2", "https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap"],
  ["inter-800.woff2", "https://fonts.googleapis.com/css2?family=Inter:wght@800&display=swap"],
  [
    "playfair-700.woff2",
    "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap",
  ],
];

for (const [nombre, hoja] of trabajos) {
  const texto = await css(hoja);
  const url = latinUrl(texto);
  if (!url) {
    console.log("sin URL latin:", nombre);
    continue;
  }
  const datos = Buffer.from(await (await fetch(url)).arrayBuffer());
  await writeFile(path.join(destino, nombre), datos);
  console.log(nombre, Math.round(datos.length / 1024) + " KB");
}
