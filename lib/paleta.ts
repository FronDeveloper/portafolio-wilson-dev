/**
 * Paleta de Indexxel — "Azul Institucional" (tema claro).
 * Fuente única del color de marca: el CSS y los iconos leen de aquí.
 *
 * Contraste verificado (WCAG 2.2):
 *   tinta / fondo          13.5:1  (AAA)
 *   tinta / superficie     14.5:1  (AAA)
 *   tinta suave / fondo     5.6:1  (AA)
 *   acento / fondo          6.2:1  (AA)
 *   blanco / acento         6.7:1  (AA)
 *   X azul / baldosa        4.7:1  (AA gráficos)
 */

export const PALETA = {
  nombre: "Azul Institucional",

  /** Lienzo de la página. */
  fondo: "#F4F7FB",
  /** Tarjetas, modales y barras. */
  superficie: "#FFFFFF",
  /** Texto principal y titulares. */
  tinta: "#0F294E",
  /** Texto secundario: subtítulos, metadatos, ayudas. */
  tintaSuave: "#52657E",
  /** Acción principal y enlaces. */
  acento: "#1D4ED8",
  acentoHover: "#1E40AF",
  /** Fondo tenue para destacados y estados activos. */
  acentoSuave: "#E8EFFD",
  /** Líneas y separadores. */
  borde: "#D8E1EC",
  /** Bordes de controles sobre superficie. */
  bordeFuerte: "#C3D0E0",

  // Marca: la baldosa y su X.
  tile: "#0F294E",
  bracket: "#FFFFFF",
  /** Trazo azul de la X. Solo sobre la baldosa (4.7:1); sobre blanco no pasa 3:1. */
  xAcento: "#4D94F0",
  xClaro: "#FFFFFF",
} as const;
