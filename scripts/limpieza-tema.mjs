/**
 * Segunda pasada: botones con fondo azul sólido y texto que quedó en tinta.
 * Uso puntual tras scripts/migrar-tema.mjs.
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function* recorrer(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "projects") continue;
      yield* recorrer(p);
    } else if (/\.(jsx|tsx)$/.test(e.name)) {
      yield p;
    }
  }
}

const MARCA_AZUL = /(bg-acento|from-acento|to-acento|bg-\[#1D4ED8\])/;
let tocados = 0;

for await (const archivo of recorrer(path.join(raiz, "app"))) {
  await procesar(archivo);
}
for await (const archivo of recorrer(path.join(raiz, "components"))) {
  await procesar(archivo);
}

async function procesar(archivo) {
  const original = await readFile(archivo, "utf8");
  const lineas = original.split("\n");
  let cambios = 0;

  const nuevas = lineas.map((linea) => {
    if (!MARCA_AZUL.test(linea) || !/text-tinta(?![-\w])/.test(linea)) return linea;
    cambios++;
    return linea.replace(/text-tinta(?![-\w])/g, "text-white");
  });

  if (cambios) {
    await writeFile(archivo, nuevas.join("\n"), "utf8");
    tocados += cambios;
    console.log(path.relative(raiz, archivo).replaceAll("\\", "/"), "->", cambios);
  }
}

console.log("líneas corregidas:", tocados);
