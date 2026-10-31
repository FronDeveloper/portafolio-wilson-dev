import { ImageResponse } from "next/og";

/**
 * Icono para la pantalla de inicio en iOS/iPadOS.
 * Fondo sólido (sin transparencia) para que se vea bien en todos los temas.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #8B5CF6 0%, #4C1D95 100%)",
          color: "#FFFFFF",
          fontSize: 118,
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        P
      </div>
    ),
    { ...size }
  );
}
