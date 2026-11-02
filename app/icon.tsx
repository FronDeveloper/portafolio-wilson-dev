import { ImageResponse } from "next/og";
import { ACENTO, BLOQUES, RADIO_BALDOSA, bloque } from "@/lib/brand-mark";

/**
 * Favicon de Indexxel: la X de bloques sobre la baldosa violeta.
 * Next.js lo sirve en /icon y lo inyecta solo en los metadatos.
 */

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

const ESCALA = 1;

export default function Icon() {
  const centro = bloque(ACENTO[0], ACENTO[1], ESCALA);

  return new ImageResponse(
    (
      <div
        style={{
          width: 64,
          height: 64,
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #8B5CF6 0%, #4C1D95 100%)",
          borderRadius: RADIO_BALDOSA,
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
