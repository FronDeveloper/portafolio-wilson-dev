import { ImageResponse } from "next/og";

/**
 * Imagen para compartir el sitio en WhatsApp, LinkedIn y redes.
 * Next.js la sirve en /opengraph-image y la inyecta sola en los metadatos
 * (ver app/layout.tsx: no hay que declararla a mano).
 */

export const alt =
  "Pixescript — Desarrollo de software a la medida en Colombia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0B0B",
          padding: "72px 80px",
          position: "relative",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        {/* Halo dorado decorativo */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -160,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(194,178,128,0.22) 0%, rgba(194,178,128,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -180,
            width: 620,
            height: 620,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(194,178,128,0.12) 0%, rgba(194,178,128,0) 70%)",
            display: "flex",
          }}
        />

        {/* Encabezado */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#C2B280",
              color: "#0B0B0B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            P
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                color: "#FFFFFF",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: -0.4,
              }}
            >
              Pixescript
            </span>
            <span
              style={{
                color: "#C2B280",
                fontSize: 17,
                letterSpacing: 2.4,
                textTransform: "uppercase",
              }}
            >
              Software a la medida
            </span>
          </div>
        </div>

        {/* Mensaje principal */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              color: "#FFFFFF",
              fontSize: 62,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: -1.6,
            }}
          >
            Software a medida
          </span>
          <span
            style={{
              color: "#C2B280",
              fontSize: 62,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: -1.6,
            }}
          >
            para hacer crecer
          </span>
          <span
            style={{
              color: "#FFFFFF",
              fontSize: 62,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: -1.6,
            }}
          >
            tu negocio
          </span>
          <span
            style={{
              color: "#A3A3A3",
              fontSize: 26,
              lineHeight: 1.4,
              marginTop: 16,
            }}
          >
            Sistemas de gestión, SaaS, e-commerce y dashboards · Next.js y
            TypeScript
          </span>
        </div>

        {/* Pie con datos de contacto */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #2A2A2A",
            paddingTop: 26,
          }}
        >
          <div style={{ display: "flex", gap: 14 }}>
            {["Colombia", "Remoto", "Cotización en 24 h"].map((chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  color: "#D6CFB8",
                  border: "1px solid #3A3831",
                  background: "#151515",
                  borderRadius: 999,
                  padding: "10px 22px",
                  fontSize: 20,
                }}
              >
                {chip}
              </div>
            ))}
          </div>
          <span style={{ color: "#C2B280", fontSize: 23, fontWeight: 600 }}>
            wvalencia-dev.vercel.app
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
