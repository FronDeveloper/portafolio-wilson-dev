/**
 * Geometría de la marca Indexxel — concepto "corchetes + X".
 *
 * Lienzo virtual de 64 unidades. Los corchetes [ ] tienen extremos redondeados;
 * la X son dos trazos rectos cruzados (uno claro, uno de acento). La misma
 * geometría alimenta el logotipo, el favicon y los iconos generados.
 */

export const LIENZO = 64;

/** Radio de la baldosa que contiene la marca. */
export const RADIO_BALDOSA = 12.25;

/** Corchetes [ ]: un path por lado. */
export const TRAZO_CORCHETE = 3.75;
export const CORCHETES: ReadonlyArray<string> = [
  "M 29.375 17 H 16.875 V 48.5 H 29.375",
  "M 34.625 17 H 47.125 V 48.5 H 34.625",
];

/** X central: dos trazos cruzados, extremos rectos. */
export const TRAZO_X = 5.25;
export const X_TRAZOS = {
  /** Trazo claro (se dibuja debajo). */
  claro: "M 40.625 23.875 L 23.375 41.125",
  /** Trazo de acento (se dibuja encima). */
  acento: "M 23.375 23.875 L 40.625 41.125",
} as const;

/**
 * Variante compacta: sin corchetes y con la X más gruesa.
 * Es la única que se lee a 16 px (el corchete mide 0.94 px a ese tamaño),
 * así que se usa solo en el favicon pequeño.
 */
export const X_COMPACTA = {
  ancho: 9,
  trazos: [
    "M 43.5 20.5 L 20.5 43.5",
    "M 20.5 20.5 L 43.5 43.5",
  ],
} as const;

/** Escala de un valor del lienzo de 64 al tamaño destino. */
export function escala(valor: number, tamano: number): number {
  return (valor / 64) * tamano;
}
