/**
 * Genera los iconos del sitio a partir de la geometría de marca.
 *
 *   node scripts/iconos.mjs
 *
 * Salida en public/: favicon.ico (16+32+48), favicon-16x16, favicon-32x32,
 * apple-touch-icon, icon-192, icon-512.
 *
 * El de 16 px usa la variante compacta (solo la X): con corchetes, el trazo
 * mide 0.94 px y se empasta.
 */

import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const salida = (nombre) => path.join(raiz, "public", nombre);

const NAVY = "#0F294E";
const BLANCO = "#FFFFFF";
const AZUL = "#4D94F0";

const corchetes = `
  <path d="M 29.375 17 H 16.875 V 48.5 H 29.375" stroke="${BLANCO}" stroke-width="3.75"
        fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 34.625 17 H 47.125 V 48.5 H 34.625" stroke="${BLANCO}" stroke-width="3.75"
        fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 40.625 23.875 L 23.375 41.125" stroke="${BLANCO}" stroke-width="5.25" fill="none"/>
  <path d="M 23.375 23.875 L 40.625 41.125" stroke="${AZUL}" stroke-width="5.25" fill="none"/>
`;

const xCompacta = `
  <path d="M 43.5 20.5 L 20.5 43.5" stroke="${BLANCO}" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M 20.5 20.5 L 43.5 43.5" stroke="${AZUL}" stroke-width="9" fill="none" stroke-linecap="round"/>
`;

/** Icono cuadrado con la baldosa redondeada (favicon). */
function iconoRedondeado(n, compacto = false) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${n}" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="12.25" fill="${NAVY}"/>
    ${compacto ? xCompacta : corchetes}
  </svg>`;
}

/**
 * Icono a sangre (iOS, Android): sin esquinas transparentes, porque el sistema
 * aplica su propia máscara. La marca ocupa el 72 % para quedar dentro de la
 * zona segura de un icono "maskable".
 */
function iconoSangrado(n) {
  const escala = 0.72;
  const desplazamiento = (64 - 64 * escala) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${n}" viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${NAVY}"/>
    <g transform="translate(${desplazamiento} ${desplazamiento}) scale(${escala})">${corchetes}</g>
  </svg>`;
}

async function png(svg, n) {
  return sharp(Buffer.from(svg)).resize(n, n).png({ compressionLevel: 9 }).toBuffer();
}

/** Contenedor ICO con payloads PNG (soportado por todos los navegadores actuales). */
function ico(entradas) {
  const cabecera = Buffer.alloc(6);
  cabecera.writeUInt16LE(0, 0);
  cabecera.writeUInt16LE(1, 2);
  cabecera.writeUInt16LE(entradas.length, 4);

  let offset = 6 + 16 * entradas.length;
  const directorio = [];

  for (const { tamano, datos } of entradas) {
    const e = Buffer.alloc(16);
    e.writeUInt8(tamano >= 256 ? 0 : tamano, 0);
    e.writeUInt8(tamano >= 256 ? 0 : tamano, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(datos.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += datos.length;
    directorio.push(e);
  }

  return Buffer.concat([cabecera, ...directorio, ...entradas.map((e) => e.datos)]);
}

const trabajos = [
  ["favicon-16x16.png", await png(iconoRedondeado(16, true), 16)],
  ["favicon-32x32.png", await png(iconoRedondeado(32), 32)],
  ["apple-touch-icon.png", await png(iconoSangrado(180), 180)],
  ["icon-192.png", await png(iconoSangrado(192), 192)],
  ["icon-512.png", await png(iconoSangrado(512), 512)],
];

for (const [nombre, datos] of trabajos) {
  await writeFile(salida(nombre), datos);
}

await writeFile(
  salida("favicon.ico"),
  ico([
    { tamano: 16, datos: await png(iconoRedondeado(16, true), 16) },
    { tamano: 32, datos: await png(iconoRedondeado(32), 32) },
    { tamano: 48, datos: await png(iconoRedondeado(48), 48) },
  ])
);

await writeFile(
  path.join(raiz, "docs", "marca", "indexxel-icono.svg"),
  iconoRedondeado(64).replace(/^<svg[^>]*>/, '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 64 64">')
);

console.log("Iconos generados:", trabajos.map(([n]) => n).join(", "), "+ favicon.ico");
