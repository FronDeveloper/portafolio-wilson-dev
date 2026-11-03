/**
 * Migración mecánica de colores al tema claro (paleta B).
 * Uso puntual: node scripts/migrar-tema.mjs
 * Imprime un reporte por archivo y deja la lista de restos para revisar a mano.
 */
import { readFile, writeFile } from "node:fs/promises";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const EXCLUIR = [
  "components/Wordmark.tsx",
  "app/layout.tsx",
  "app/opengraph-image.tsx",
  "components/JsonLd.jsx",
];

async function* recorrer(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "projects" || e.name === "node_modules") continue;
      yield* recorrer(p);
    } else if (/\.(jsx|tsx)$/.test(e.name)) {
      yield p;
    }
  }
}

/** [regex, reemplazo] en orden de aplicación. */
const reglas = [
  // 1. Botones dorados: el texto negro pasa a blanco ANTES de convertir el dorado.
  [/(bg-\[#C2B280\][^"'`\n]*?)text-black/g, "$1text-white"],
  [/(bg-\[#25D366\][^"'`\n]*?)text-black/g, "$1text-black"],

  // 2. Superficies oscuras -> tema claro
  [/bg-\[#0B0B0B\]/g, "bg-fondo"],
  [/bg-\[#111\]/g, "bg-superficie"],
  [/bg-\[#0[bB]0[bB]0[bB]\]/g, "bg-fondo"],
  [/bg-\[#1[aA]1[aA]1[aA]\]/g, "bg-fondo"],
  [/bg-\[#1[5fF]1[5fF]1[5fF]\]/g, "bg-fondo"],
  [/bg-\[#2[26]2[26]2[26]\]/g, "bg-fondo"],
  [/bg-\[#0[fF]0[fF]0[fF]\]/g, "bg-fondo"],
  [/bg-\[#151515\]/g, "bg-fondo"],

  // 3. Bordes oscuros
  [/border-\[#333\]/g, "border-borde"],
  [/border-\[#222\]/g, "border-borde"],
  [/border-\[#262626\]/g, "border-borde"],
  [/border-\[#2[aA]2[aA]2[aA]\]/g, "border-borde"],
  [/border-\[#444\]/g, "border-borde-fuerte"],
  [/border-\[#555\]/g, "border-borde-fuerte"],
  [/border-gray-900/g, "border-borde"],
  [/border-gray-800/g, "border-borde"],
  [/border-gray-700/g, "border-borde"],
  [/border-gray-600/g, "border-borde-fuerte"],
  [/border-gray-500/g, "border-borde-fuerte"],
  [/divide-gray-800/g, "divide-borde"],
  [/border-white\/10/g, "border-borde"],

  // 4. Acento (dorado -> azul)
  [/text-\[#C2B280\]/g, "text-acento"],
  [/bg-\[#C2B280\]/g, "bg-acento"],
  [/border-\[#C2B280\]/g, "border-acento"],
  [/shadow-\[#C2B280\]/g, "shadow-acento"],
  [/from-\[#C2B280\]/g, "from-acento"],
  [/to-\[#C2B280\]/g, "to-acento"],
  [/accent-\[#C2B280\]/g, "accent-acento"],
  [/\[#C2B280\]/g, "acento"],
  [/to-\[#9[aA]8[aA]5[eE]\]/g, "to-acento-hover"],
  [/hover:bg-\[#d4c69a\]/gi, "hover:bg-acento-hover"],
  [/hover:text-\[#d4c69a\]/gi, "hover:text-acento-hover"],

  // 5. Violeta / cian / fucsia -> familia del acento
  [/(?:text|border|bg|from|to|via|shadow|ring|accent|fill|stroke)-(?:violet|cyan|fuchsia|indigo|purple)-\d{2,3}/g, (m) => {
    const familia = m.split("-")[0];
    const color = /cyan-6|violet-6/.test(m) ? "acento-hover" : "acento";
    if (familia === "shadow") return "shadow-acento";
    if (familia === "ring") return "ring-acento";
    return `${familia}-${color}`;
  }],
  [/shadow-acento\/\d+/g, "shadow-acento/20"],

  // 6. Grises
  [/text-gray-100/g, "text-tinta"],
  [/text-gray-200/g, "text-tinta"],
  [/text-gray-300/g, "text-tinta"],
  [/text-gray-400/g, "text-tinta-suave"],
  [/text-gray-500/g, "text-tinta-suave"],
  [/text-gray-600/g, "text-tinta-suave"],
  [/placeholder-gray-500/g, "placeholder-tinta-suave"],
  [/bg-gray-900/g, "bg-fondo"],
  [/bg-gray-800/g, "bg-fondo"],
  [/text-\[#9{3}\]/g, "text-tinta-suave"],
  [/text-\[#A3A3A3\]/gi, "text-tinta-suave"],

  // 7. Estados sobre fondo claro
  [/text-red-400/g, "text-red-700"],
  [/text-red-300/g, "text-red-700"],
  [/text-green-400/g, "text-green-700"],
  [/text-green-300/g, "text-green-700"],
  [/text-emerald-400/g, "text-emerald-700"],
  [/text-emerald-300/g, "text-emerald-700"],
  [/text-yellow-400/g, "text-amber-700"],
  [/text-yellow-300/g, "text-amber-700"],
  [/border-green-500\/30/g, "border-green-200"],
  [/bg-green-500\/10/g, "bg-green-50"],

  // 8. Superposiciones
  [/bg-black\/90/g, "bg-white/95"],
  [/bg-black\/60/g, "bg-white/85"],
  [/bg-black\/40/g, "bg-tinta/40"],
  [/bg-white\/5/g, "bg-tinta/5"],
  [/hover:bg-white\/10/g, "hover:bg-tinta/5"],
  [/shadow-black\/60/g, "shadow-tinta/20"],
  [/shadow-black\/40/g, "shadow-tinta/20"],

  // 9. Texto sobre superficies claras
  [/text-white/g, "text-tinta"],
];

const reporte = [];
const restos = [];

for await (const archivo of recorrer(path.join(raiz, "app"))) {
  const rel = path.relative(raiz, archivo).replaceAll("\\", "/");
  if (EXCLUIR.includes(rel)) continue;
  await procesar(archivo, rel);
}
for await (const archivo of recorrer(path.join(raiz, "components"))) {
  const rel = path.relative(raiz, archivo).replaceAll("\\", "/");
  if (EXCLUIR.includes(rel)) continue;
  await procesar(archivo, rel);
}

async function procesar(archivo, rel) {
  const original = await readFile(archivo, "utf8");
  let texto = original;

  for (const [patron, reemplazo] of reglas) {
    texto = texto.replace(patron, reemplazo);
  }

  // En una misma clase, un fondo sólido de acento/tinta exige texto blanco.
  texto = texto
    .split("\n")
    .map((linea) => {
      const fondoOscuro =
        /bg-(acento|acento-hover|tinta)(\s|\/|"|`|$)/.test(linea) ||
        /bg-\[#25D366\]/.test(linea) ||
        /bg-(green|red|emerald)-(600|700|800)/.test(linea);
      if (fondoOscuro && /text-tinta(?![-\w])/.test(linea)) {
        return linea.replace(/text-tinta(?![-\w])/g, "text-white");
      }
      return linea;
    })
    .join("\n");

  if (texto !== original) {
    await writeFile(archivo, texto, "utf8");
    const cambios = original.split("\n").filter((l, i) => l !== texto.split("\n")[i]).length;
    reporte.push(`${rel}: ${cambios} líneas`);
  }

  const sobrantes = [...texto.matchAll(/#[0-9A-Fa-f]{3,8}\b/g)]
    .map((m) => m[0])
    .filter((h) => !["#25D366", "#1fb857", "#0F294E", "#4D94F0", "#FFFFFF", "#fff", "#000"].includes(h));
  if (sobrantes.length) restos.push(`${rel}: ${[...new Set(sobrantes)].join(" ")}`);
}

console.log(reporte.join("\n"));
console.log("\n--- HEX RESTANTES ---");
console.log(restos.join("\n"));
