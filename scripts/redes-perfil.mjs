/**
 * Genera los elementos de perfil para Instagram y Facebook:
 *   - foto de perfil 1024×1024 (segura en recorte circular)
 *   - 4 portadas de historias destacadas 1080×1080
 *
 *   node scripts/redes-perfil.mjs
 *
 * Salida: docs/redes/lote-01/perfil/
 */

import puppeteer from "puppeteer-core";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const RAIZ = "C:/Users/Asus/wilson-portfolio";
const SALIDA = path.join(RAIZ, "docs/redes/lote-01/perfil");
const FUENTES = path.join(RAIZ, "docs/redes/fuentes");

const NAVY = "#0F294E";
const AZUL_CLARO = "#4D94F0";

async function fuente(nombre) {
  const datos = await readFile(path.join(FUENTES, nombre));
  return `data:font/woff2;base64,${datos.toString("base64")}`;
}

const cssFuentes = (
  await Promise.all(
    [
      ["Inter", 600, "inter-600.woff2"],
      ["Inter", 700, "inter-700.woff2"],
    ].map(
      async ([familia, peso, archivo]) =>
        `@font-face{font-family:'${familia}';font-style:normal;font-weight:${peso};src:url(${await fuente(archivo)}) format('woff2');}`
    )
  )
).join("\n");

/** X de la marca, misma geometría que lib/brand-mark.ts (lienzo 64). */
function equis(lado, trazo = 6.6) {
  return `<svg width="${lado}" height="${lado}" viewBox="0 0 64 64" aria-hidden="true">
    <path d="M 40.625 23.875 L 23.375 41.125" stroke="#ffffff" stroke-width="${trazo}" fill="none" stroke-linecap="round"/>
    <path d="M 23.375 23.875 L 40.625 41.125" stroke="${AZUL_CLARO}" stroke-width="${trazo}" fill="none" stroke-linecap="round"/>
  </svg>`;
}

const perfil = `<!doctype html><html><head><meta charset="utf-8"><style>
  ${cssFuentes}
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1024px; height:1024px; background:${NAVY}; display:grid; place-items:center; overflow:hidden; }
  .halo { position:absolute; width:1100px; height:1100px; border-radius:50%;
    background:radial-gradient(circle, rgba(77,148,240,.28) 0%, rgba(77,148,240,0) 62%); }
  svg { position:relative; }
</style></head><body>
  <div class="halo"></div>
  ${equis(600, 6.2)}
</body></html>`;

const destacadas = [
  ["Casos", "casos"],
  ["Precios", "precios"],
  ["Proceso", "proceso"],
  ["Testimonios", "testimonios"],
];

function destacada(etiqueta) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    ${cssFuentes}
    * { margin:0; padding:0; box-sizing:border-box; }
    body { width:1080px; height:1080px; overflow:hidden; background:${NAVY}; }
    .slide { position:relative; width:1080px; height:1080px; display:flex; flex-direction:column;
      align-items:center; justify-content:center; gap:40px; color:#fff;
      font-family:'Inter', system-ui, sans-serif; }
    .slide::before { content:''; position:absolute; inset:0;
      background-image:
        repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 1px, transparent 1px 72px),
        repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 1px, transparent 1px 72px); }
    .slide::after { content:''; position:absolute; width:900px; height:900px; border-radius:50%;
      background:radial-gradient(circle, rgba(77,148,240,.30) 0%, rgba(77,148,240,0) 65%); }
    svg, span { position:relative; z-index:1; }
    span { font-size:82px; font-weight:700; letter-spacing:.02em; }
  </style></head><body>
    <div class="slide">${equis(190, 6.8)}<span>${etiqueta}</span></div>
  </body></html>`;
}

const navegador = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--font-render-hinting=none"],
});

async function render(html, archivo, lado, alto = lado) {
  const pagina = await navegador.newPage();
  await pagina.setViewport({ width: lado, height: alto, deviceScaleFactor: 1 });
  await pagina.setContent(html, { waitUntil: "load" });
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.screenshot({ path: archivo });
  await pagina.close();
}

await mkdir(SALIDA, { recursive: true });
await render(perfil, path.join(SALIDA, "perfil-1024.png"), 1024);
console.log("perfil-1024.png");

for (const [etiqueta, archivo] of destacadas) {
  await render(destacada(etiqueta), path.join(SALIDA, `destacada-${archivo}.png`), 1080);
  console.log(`destacada-${archivo}.png`);
}

await navegador.close();
console.log("listo en", SALIDA);
