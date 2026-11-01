import { ImageResponse } from "next/og";
import { ACENTO, CELDAS, LIENZO, celda } from "@/lib/brand-mark";

/**
 * Icono para la pantalla de inicio en iOS/iPadOS.
 * Fondo a sangre (sin transparencia): iOS aplica su propia máscara redondeada.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const ESCALA = 180 / LIENZO;

export default function AppleIcon() {
  const acento = celda(ACENTO[0], ACENTO[1], ESCALA);

  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #8B5CF6 0%, #4C1D95 100%)",
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
