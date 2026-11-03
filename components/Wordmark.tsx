/**
 * Logotipo de Indexxel: baldosa [x] + palabra.
 *
 * La baldosa y la X se dibujan en SVG con la geometría de lib/brand-mark.ts
 * (la misma de los iconos) y los colores de lib/paleta.ts. El texto usa la
 * tipografía del sitio (Inter) y hereda el color del contenedor.
 *
 * La baldosa tiene tamaño propio en píxeles: por debajo de 24 px los corchetes
 * miden menos de un píxel y se empastan, así que ahí se usa la variante
 * compacta (solo la X).
 */

import {
  CORCHETES,
  LIENZO,
  RADIO_BALDOSA,
  TRAZO_CORCHETE,
  TRAZO_X,
  X_COMPACTA,
  X_TRAZOS,
} from "@/lib/brand-mark";
import { PALETA } from "@/lib/paleta";

type Props = {
  className?: string;
  label?: string;
  /** Lado de la baldosa en píxeles. Mínimo legible: 24. */
  tamano?: number;
  variante?: "completo" | "compacto";
};

export default function Wordmark({
  className = "",
  label = "Indexxel",
  tamano = 28,
  variante = "completo",
}: Props) {
  const compacto = variante === "compacto" || tamano < 24;

  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-flex items-center ${className}`}
      style={{ gap: "0.4em" }}
    >
      <svg
        viewBox={`0 0 ${LIENZO} ${LIENZO}`}
        aria-hidden="true"
        focusable="false"
        style={{ width: tamano, height: tamano, flex: "none" }}
      >
        <rect
          width={LIENZO}
          height={LIENZO}
          rx={RADIO_BALDOSA}
          fill={PALETA.tile}
        />

        {!compacto &&
          CORCHETES.map((d) => (
            <path
              key={d}
              d={d}
              stroke={PALETA.bracket}
              strokeWidth={TRAZO_CORCHETE}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

        {compacto ? (
          <>
            <path
              d={X_COMPACTA.trazos[0]}
              stroke={PALETA.xClaro}
              strokeWidth={X_COMPACTA.ancho}
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={X_COMPACTA.trazos[1]}
              stroke={PALETA.xAcento}
              strokeWidth={X_COMPACTA.ancho}
              fill="none"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <path
              d={X_TRAZOS.claro}
              stroke={PALETA.xClaro}
              strokeWidth={TRAZO_X}
              fill="none"
            />
            <path
              d={X_TRAZOS.acento}
              stroke={PALETA.xAcento}
              strokeWidth={TRAZO_X}
              fill="none"
            />
          </>
        )}
      </svg>

      <span
        aria-hidden="true"
        style={{ fontWeight: 600, letterSpacing: "-0.012em" }}
      >
        Indexxel
      </span>
    </span>
  );
}
