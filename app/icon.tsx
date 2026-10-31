import { ImageResponse } from "next/og";

/**
 * Favicon de Pixescript: monograma P sobre la baldosa violeta.
 * Next.js lo sirve en /icon y lo inyecta solo en los metadatos.
 */

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 14,
          color: "#FFFFFF",
          fontSize: 42,
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
