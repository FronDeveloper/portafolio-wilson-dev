/**
 * Recorta un tramo de una captura y lo escala para revisarlo.
 *   node scripts/recorte.mjs <archivo.png> <y> <alto> [salida] [ancho]
 */
import sharp from "sharp";

const [archivo, y, alto, salida, ancho] = process.argv.slice(2);
const destino = salida || "C:/Users/Asus/AppData/Local/Temp/opencode/recorte.png";

const meta = await sharp(archivo).metadata();
const altoRecorte = Math.min(Number(alto), meta.height - Number(y));

let img = sharp(archivo).extract({
  left: 0,
  top: Number(y),
  width: meta.width,
  height: altoRecorte,
});

if (ancho) img = img.resize({ width: Number(ancho) });

await img.png().toFile(destino);
console.log(`${destino} (${meta.width}x${altoRecorte} de ${meta.width}x${meta.height})`);
