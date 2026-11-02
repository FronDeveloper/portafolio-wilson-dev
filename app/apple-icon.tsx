import { ImageResponse } from "next/og";
import { ACENTO, BLOQUES, LIENZO, bloque } from "@/lib/brand-mark";

/**
 * Icono para la pantalla de inicio en iOS/iPadOS.
 * Fondo a sangre (sin transparencia): iOS aplica su propia máscara redondeada.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const ESCALA = 180 / LIENZO;

export default function AppleIcon() {
  const centro = bloque(ACENTO[0], ACENTO[1], ESCALA);

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
        {BLOQUES.map(([x, y]) => {
          const b = bloque(x, y, ESCALA);
          return (
            <div
              key={`${x}-${y}`}
              style={{
                position: "absolute",
                left: b.left,
                top: b.top,
                width: b.size,
                height: b.size,
                borderRadius: b.radius,
                background: "#FFFFFF",
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            left: centro.left,
            top: centro.top,
            width: centro.size,
            height: centro.size,
            borderRadius: centro.radius,
            background: "#5EEAD4",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
