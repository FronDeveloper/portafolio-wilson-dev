/**
 * Logotipo: la X de píxeles acompaña a la palabra y la doble x lleva el acento.
 *
 * La baldosa y la X se dibujan en SVG con la geometría de lib/brand-mark.ts
 * (la misma del favicon), y el texto usa Inter, la tipografía del sitio.
 * Todo escala con el font-size: sirve igual en el navbar que en un banner.
 */

import { ACENTO, BLOQUES, LIENZO, RADIO_BALDOSA, bloque } from "@/lib/brand-mark";

type Props = {
  className?: string;
  /** Acento y color del texto: turquesa sobre oscuro, violeta sobre claro. */
  tone?: "oscuro" | "claro";
  label?: string;
};

export default function Wordmark({ className = "", tone = "oscuro", label = "Indexxel" }: Props) {
  const acento = tone === "claro" ? "#7C3AED" : "#5EEAD4";
  const centro = bloque(ACENTO[0], ACENTO[1]);

  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-flex items-center ${className}`}
      style={{ gap: "0.18em" }}
    >
      <svg
        viewBox={`0 0 ${LIENZO} ${LIENZO}`}
        aria-hidden="true"
        focusable="false"
        style={{ width: "0.82em", height: "0.82em", flex: "none" }}
      >
        <defs>
          <linearGradient id="indexxel-baldosa" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>
        </defs>

        <rect width={LIENZO} height={LIENZO} rx={RADIO_BALDOSA} fill="url(#indexxel-baldosa)" />

        {BLOQUES.map(([x, y]) => {
          const b = bloque(x, y);
          return (
            <rect
              key={`${x}-${y}`}
              x={b.left}
              y={b.top}
              width={b.size}
              height={b.size}
              rx={b.radius}
              fill="#FFFFFF"
            />
          );
        })}

        <rect
          x={centro.left}
          y={centro.top}
          width={centro.size}
          height={centro.size}
          rx={centro.radius}
          fill="#5EEAD4"
        />
      </svg>

      <span aria-hidden="true">
        Inde<span style={{ color: acento }}>xx</span>el
      </span>
    </span>
  );
}
