/**
 * Geometria de la marca Pixescript (una sola fuente para SVG y PNG).
 *
 * La "P" vive en una rejilla de 5x5 celdas sobre un lienzo de 64x64.
 */

/** Celdas que forman la P: [columna, fila]. */
export const CELDAS: ReadonlyArray<readonly [number, number]> = [
  // trazo superior del ojo
  [0, 0], [1, 0], [2, 0], [3, 0],
  // laterales del ojo
  [0, 1], [3, 1],
  // trazo inferior del ojo
  [0, 2], [1, 2], [2, 2], [3, 2],
  // asta
  [0, 3], [0, 4],
];

/** Celda del pixel turquesa (esquina inferior derecha). */
export const ACENTO: readonly [number, number] = [4, 4];

export const CELDA = 9.5;
export const HUECO = 1;
export const ORIGEN = 6.25;
export const LIENZO = 64;

/** Posicion y tamano de una celda, ya escalados al lienzo destino. */
export function celda(col: number, fila: number, escala = 1, offset = 0) {
  return {
    left: offset + (ORIGEN + col * (CELDA + HUECO)) * escala,
    top: offset + (ORIGEN + fila * (CELDA + HUECO)) * escala,
    size: CELDA * escala,
    radius: 2 * escala,
  };
}
