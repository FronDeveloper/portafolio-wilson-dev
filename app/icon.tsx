import { ImageResponse } from "next/og";
import { ACENTO, CELDAS, celda } from "@/lib/brand-mark";

/**
 * Favicon de Pixescript: la P de bloques sobre la baldosa violeta.
 * Next.js lo sirve en /icon y lo inyecta solo en los metadatos.
 */

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

const ESCALA = 1;

export default function Icon() {
  const acento = celda(ACENTO[0], ACENTO[1], ESCALA);

  return new ImageResponse(
    (
      <div
        style={{
          width: 64,
          height: 64,
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #8B5CF6 0%, #4C1D95 100%)",
          borderRadius: 14,
        }}
      >
        {CELDAS.map(([col, fila]) => {
          const c = celda(col, fila, ESCALA);
          return (
            <div
              key={`${col}-${fila}`}
              style={{
                position: "absolute",
                left: c.left,
                top: c.top,
                width: c.size,
                height: c.size,
                borderRadius: c.radius,
                background: "#FFFFFF",
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            left: acento.left,
            top: acento.top,
            width: acento.size,
            height: acento.size,
            borderRadius: acento.radius,
            background: "#5EEAD4",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
