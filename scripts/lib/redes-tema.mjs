/**
 * Tema compartido de las piezas de redes (carruseles 4:5 y tarjetas 9:16).
 *
 * Todo se dibuja en HTML y se captura con Chrome a tamaño real, así el texto usa
 * las mismas fuentes del sitio (Inter + Playfair Display) y queda nítido.
 *
 * Usado por: scripts/redes-lote01.mjs, scripts/redes-lote02.mjs, …
 */

import puppeteer from "puppeteer-core";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
export const RAIZ = path.resolve(AQUI, "../..");
export const DIR_FUENTES = path.join(RAIZ, "docs/redes/fuentes");

export const PALETA = {
  navy: "#0F294E",
  azul: "#1D4ED8",
  azulClaro: "#4D94F0",
  fondo: "#F4F7FB",
  blanco: "#FFFFFF",
  tenue: "#52657E",
  borde: "#D8E1EC",
};

// ── Fuentes embebidas ────────────────────────────────────────────────────────

async function fuente(nombre) {
  const datos = await readFile(path.join(DIR_FUENTES, nombre));
  return `data:font/woff2;base64,${datos.toString("base64")}`;
}

const caras = [
  ["Inter", 400, "inter-400.woff2"],
  ["Inter", 500, "inter-500.woff2"],
  ["Inter", 600, "inter-600.woff2"],
  ["Inter", 700, "inter-700.woff2"],
  ["Inter", 800, "inter-800.woff2"],
  ["Playfair Display", 700, "playfair-700.woff2"],
];

export const cssFuentes = (
  await Promise.all(
    caras.map(
      async ([familia, peso, archivo]) =>
        `@font-face{font-family:'${familia}';font-style:normal;font-weight:${peso};src:url(${await fuente(archivo)}) format('woff2');}`
    )
  )
).join("\n");

// ── Marca ────────────────────────────────────────────────────────────────────

/** Baldosa [x] para fondos claros. */
export function marcaClara(lado = 46) {
  return `<svg width="${lado}" height="${lado}" viewBox="0 0 64 64" aria-hidden="true">
    <rect width="64" height="64" rx="12.25" fill="${PALETA.navy}"/>
    <path d="M 29.375 17 H 16.875 V 48.5 H 29.375" stroke="#fff" stroke-width="3.75" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 34.625 17 H 47.125 V 48.5 H 34.625" stroke="#fff" stroke-width="3.75" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 40.625 23.875 L 23.375 41.125" stroke="#fff" stroke-width="5.25" fill="none"/>
    <path d="M 23.375 23.875 L 40.625 41.125" stroke="${PALETA.azulClaro}" stroke-width="5.25" fill="none"/>
  </svg>`;
}

/** Sobre azul noche la baldosa se funde: se usa la X suelta. */
export function marcaOscura(lado = 52) {
  return `<svg width="${lado}" height="${lado}" viewBox="0 0 64 64" aria-hidden="true">
    <path d="M 40.625 23.875 L 23.375 41.125" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M 23.375 23.875 L 40.625 41.125" stroke="${PALETA.azulClaro}" stroke-width="7" fill="none" stroke-linecap="round"/>
  </svg>`;
}

export const marca = (oscuro) => `
  <div class="marca">
    ${oscuro ? marcaOscura() : marcaClara()}
    <span class="marca-texto">Indexxel</span>
  </div>`;

// ── Plantillas ───────────────────────────────────────────────────────────────

export const CSS = `
  * { margin:0; padding:0; box-sizing:border-box; }
  body { margin:0; }
  .slide {
    position:relative; width:1080px; height:1350px; overflow:hidden;
    display:flex; flex-direction:column; padding:76px 88px 70px;
    font-family:'Inter', system-ui, sans-serif;
    -webkit-font-smoothing:antialiased;
  }
  .claro { background:${PALETA.fondo}; color:${PALETA.navy}; }
  .oscuro { background:linear-gradient(158deg,#16365f 0%, ${PALETA.navy} 52%, #0a1d36 100%); color:#fff; }
  .oscuro::before {
    content:''; position:absolute; inset:0;
    background-image:
      repeating-linear-gradient(0deg, rgba(255,255,255,.055) 0 1px, transparent 1px 54px),
      repeating-linear-gradient(90deg, rgba(255,255,255,.055) 0 1px, transparent 1px 54px);
  }
  .oscuro::after {
    content:''; position:absolute; width:820px; height:820px; right:-280px; top:-260px;
    background:radial-gradient(circle, rgba(77,148,240,.30) 0%, rgba(77,148,240,0) 68%);
  }
  .slide > * { position:relative; z-index:1; }

  .barra { position:absolute; z-index:2; top:0; left:0; right:0; height:7px; background:rgba(15,41,78,.10); }
  .oscuro .barra { background:rgba(255,255,255,.14); }
  .barra span { display:block; height:100%; background:${PALETA.azul}; }
  .oscuro .barra span { background:${PALETA.azulClaro}; }

  header { display:flex; align-items:center; justify-content:space-between; }
  .marca { display:flex; align-items:center; gap:16px; }
  .marca-texto { font-size:40px; font-weight:700; letter-spacing:-.02em; }
  .folio { font-size:22px; font-weight:600; letter-spacing:.18em; color:${PALETA.tenue}; }
  .oscuro .folio { color:rgba(255,255,255,.62); }

  main { flex:1; display:flex; flex-direction:column; justify-content:center; }
  /* En las láminas de contenido el bloque se ancla arriba: así el número y el
     título quedan a la misma altura en todas y el carrusel no "salta" al pasar. */
  main.arriba { justify-content:flex-start; padding-top:104px; }

  .kicker { font-size:23px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:${PALETA.azulClaro}; }
  .regla { width:78px; height:5px; background:${PALETA.azulClaro}; border-radius:99px; margin:30px 0 34px; }
  .titular { font-family:'Playfair Display', Georgia, serif; font-size:94px; line-height:1.06; font-weight:700; letter-spacing:-.02em; }
  .bajada { margin-top:38px; font-size:37px; line-height:1.42; color:rgba(255,255,255,.80); max-width:820px; }

  .etiqueta { font-size:22px; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:${PALETA.azul}; }
  .numero { font-size:108px; font-weight:800; line-height:.9; color:${PALETA.azul}; letter-spacing:-.04em; }
  .titulo { margin-top:26px; font-size:62px; line-height:1.1; font-weight:700; letter-spacing:-.025em; }
  .cuerpo { margin-top:26px; font-size:38px; line-height:1.45; color:${PALETA.tenue}; max-width:880px; }
  .cuerpo strong { color:${PALETA.navy}; font-weight:600; }

  .lista { display:flex; flex-direction:column; gap:22px; margin-top:8px; }
  .fila { display:flex; gap:22px; align-items:flex-start; }
  .punto { flex:none; width:16px; height:16px; border-radius:99px; background:${PALETA.azulClaro}; margin-top:16px; }
  .fila p { font-size:36px; line-height:1.4; color:${PALETA.tenue}; }

  .imagen-marco { border-radius:18px; overflow:hidden; border:1px solid ${PALETA.borde}; box-shadow:0 24px 60px rgba(15,41,78,.16); background:#fff; }
  .barra-nav { display:flex; align-items:center; gap:9px; padding:15px 18px; background:#eef2f8; border-bottom:1px solid ${PALETA.borde}; }
  .circulo { width:13px; height:13px; border-radius:99px; }
  .url { margin-left:12px; font-size:20px; color:${PALETA.tenue}; background:#fff; border:1px solid ${PALETA.borde}; border-radius:8px; padding:6px 16px; }
  .imagen-marco img { display:block; width:100%; }

  /* Teléfono con una captura del chat: el marco es del diseño, la pantalla es real. */
  .telefono { width:640px; margin:0 auto; border-radius:46px; padding:16px; background:#0b1220;
    border:1px solid rgba(15,41,78,.16); box-shadow:0 30px 70px rgba(15,41,78,.22); }
  .telefono img { display:block; width:100%; border-radius:32px; }

  .boton { align-self:flex-start; display:inline-flex; align-items:center; gap:20px; margin-top:44px; background:${PALETA.azul}; color:#fff; font-size:38px; font-weight:700; padding:27px 48px; border-radius:99px; }
  .nota { margin-top:26px; font-size:29px; line-height:1.5; color:rgba(255,255,255,.70); max-width:800px; }
  .nota-oscura { margin-top:24px; font-size:29px; line-height:1.5; color:${PALETA.tenue}; }

  footer { display:flex; align-items:center; justify-content:space-between; font-size:24px; font-weight:500; color:${PALETA.tenue}; }
  .oscuro footer { color:rgba(255,255,255,.55); }
  .desliza { display:flex; align-items:center; gap:14px; font-size:26px; font-weight:600; color:#fff; }
  .flecha { display:grid; place-items:center; width:52px; height:52px; border-radius:99px; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.22); font-size:26px; }

  .chips { display:flex; flex-wrap:wrap; gap:16px; margin-top:34px; }
  .chip { font-size:27px; font-weight:600; color:${PALETA.navy}; background:#fff; border:1px solid ${PALETA.borde}; border-radius:99px; padding:14px 26px; }
`;

export function slide({ tema = "claro", indice, total, contenido, pie, posicion }) {
  const oscuro = tema === "oscuro";
  const progreso = (indice / total) * 100;
  const anclaje = posicion ?? (tema === "claro" ? "arriba" : "");
  return `<div class="slide ${tema}">
    <div class="barra"><span style="width:${progreso}%"></span></div>
    <header>${marca(oscuro)}<span class="folio">${String(indice).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span></header>
    <main class="${anclaje}">${contenido}</main>
    <footer>${pie ?? `<span>indexxel.com</span><span>@indexxel</span>`}</footer>
  </div>`;
}

// ── Render ───────────────────────────────────────────────────────────────────

let navegador = null;

async function abrirNavegador() {
  if (!navegador) {
    navegador = await puppeteer.launch({
      executablePath:
        process.env.CHROME_PATH ||
        "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-gpu",
        "--hide-scrollbars",
        "--font-render-hinting=none",
      ],
    });
  }
  return navegador;
}

export async function render(html, archivo, alto, { transparente = false } = {}) {
  const nav = await abrirNavegador();
  const pagina = await nav.newPage();
  await pagina.setViewport({ width: 1080, height: alto, deviceScaleFactor: 1 });
  await pagina.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><style>${cssFuentes}\n${CSS}</style></head><body${
      transparente ? ' style="background:transparent"' : ""
    }>${html}</body></html>`,
    { waitUntil: "load" }
  );
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.screenshot({ path: archivo, omitBackground: transparente });
  await pagina.close();
}

export async function cerrarNavegador() {
  if (navegador) {
    await navegador.close();
    navegador = null;
  }
}

/** Convierte una imagen local en `data:` para incrustarla en el HTML. */
export async function imagenBase64(archivo, tipo = "image/png") {
  const datos = await readFile(archivo);
  return `data:${tipo};base64,${datos.toString("base64")}`;
}
