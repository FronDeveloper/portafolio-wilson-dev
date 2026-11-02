/**
 * Geometría de la marca Indexxel (una sola fuente para SVG y PNG).
 *
 * La "X" vive en una rejilla de 3x3 sobre un lienzo de 64x64: cuatro bloques
 * blancos en las esquinas y uno turquesa en el cruce.
 */

export const LIENZO = 64;

/** Bloques blancos: las esquinas de la rejilla. */
export const BLOQUES: ReadonlyArray<readonly [number, number]> = [
  [8, 8],
  [42, 8],
  [8, 42],
  [42, 42],
];

/** Celda turquesa del centro (el cruce de la X). */
export const ACENTO: readonly [number, number] = [25, 25];

/** Lado del bloque y radio de la esquina, sobre el lienzo de 64. */
export const BLOQUE = 14;
export const RADIO = 3;

/** Radio de la baldosa que contiene la marca. */
export const RADIO_BALDOSA = 16;

/** Posición y tamaño de un bloque, ya escalados al lienzo destino. */
export function bloque(x: number, y: number, escala = 1) {
  return {
    left: x * escala,
    top: y * escala,
    size: BLOQUE * escala,
    radius: RADIO * escala,
  };
}
