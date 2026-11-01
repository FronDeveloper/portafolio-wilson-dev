/**
 * Marca de Pixescript: una "P" construida con bloques (guiño al pixel)
 * y un pixel turquesa de acento en la esquina inferior derecha.
 *
 * SVG puro: nítido a cualquier tamaño, sin imágenes que cargar.
 * La geometría vive en lib/brand-mark.ts para que el favicon y el SVG
 * no se desincronicen.
 */

import { ACENTO, CELDAS, celda } from "@/lib/brand-mark";

type Props = {
  size?: number;
  className?: string;
  /** Cuando hay texto al lado, el icono es decorativo. */
  decorative?: boolean;
};

export default function Logo({ size = 40, className = "", decorative = true }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative ? "true" : undefined}
      aria-label={decorative ? undefined : "Pixescript"}
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="pixescript-tile" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx="16" fill="url(#pixescript-tile)" />

      {CELDAS.map(([col, fila]) => {
        const c = celda(col, fila);
        return (
          <rect
            key={`${col}-${fila}`}
            x={c.left}
            y={c.top}
            width={c.size}
            height={c.size}
            rx={c.radius}
            fill="#FFFFFF"
          />
        );
      })}

      {(() => {
        const a = celda(ACENTO[0], ACENTO[1]);
        return (
          <rect
            x={a.left}
            y={a.top}
            width={a.size}
            height={a.size}
            rx={a.radius}
            fill="#5EEAD4"
          />
        );
      })()}
    </svg>
  );
}
