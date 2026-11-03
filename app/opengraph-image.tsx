import { ImageResponse } from "next/og";
import { SITE_HOST } from "@/lib/pricing";
import { BRAND } from "@/lib/brand";
import { PALETA } from "@/lib/paleta";

/**
 * Imagen para compartir el sitio en WhatsApp, LinkedIn y redes (1200×630).
 * Next.js la sirve en /opengraph-image y la inyecta sola en los metadatos.
 *
 * Tema claro: fondo de la paleta, baldosa azul noche y titulares en tinta.
 */

export const alt = `${BRAND.name} — Desarrollo de software a la medida en Colombia`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** La baldosa [x], igual que el favicon, dibujada con divs (Satori no traza paths). */
function Marca({ lado = 64 }: { lado?: number }) {
  const S = lado / 64;

  const corchete = (izquierda: boolean) => {
    const base = {
      position: "absolute" as const,
      top: 15.1 * S,
      width: 16.3 * S,
      height: 35.3 * S,
      borderTop: `${3.75 * S}px solid ${PALETA.bracket}`,
      borderBottom: `${3.75 * S}px solid ${PALETA.bracket}`,
      boxSizing: "border-box" as const,
      display: "flex",
    };
    return izquierda
      ? {
          ...base,
          left: 15 * S,
          borderLeft: `${3.75 * S}px solid ${PALETA.bracket}`,
          borderTopLeftRadius: 4 * S,
          borderBottomLeftRadius: 4 * S,
        }
      : {
          ...base,
          left: 32.75 * S,
          borderRight: `${3.75 * S}px solid ${PALETA.bracket}`,
          borderTopRightRadius: 4 * S,
          borderBottomRightRadius: 4 * S,
        };
  };

  const trazo = (rot: number, color: string) => ({
    position: "absolute" as const,
    left: 19.8 * S,
    top: 29.9 * S,
    width: 24.4 * S,
    height: 5.25 * S,
    borderRadius: 1 * S,
    background: color,
    transform: `rotate(${rot}deg)`,
    display: "flex",
  });

  return (
    <div
      style={{
        width: lado,
        height: lado,
        position: "relative",
        background: PALETA.tile,
        borderRadius: 12 * S,
        display: "flex",
        flex: "none",
      }}
    >
      <div style={corchete(true)} />
      <div style={corchete(false)} />
      <div style={trazo(-45, PALETA.xClaro)} />
      <div style={trazo(45, PALETA.xAcento)} />
    </div>
  );
}

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
          background: PALETA.fondo,
          padding: "68px 80px",
          position: "relative",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        {/* Halo azul tenue */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(29,78,216,0.12) 0%, rgba(29,78,216,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -240,
            left: -200,
            width: 640,
            height: 640,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(77,148,240,0.10) 0%, rgba(77,148,240,0) 70%)",
            display: "flex",
          }}
        />

        {/* Encabezado */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Marca />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                color: PALETA.tinta,
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: -0.6,
              }}
            >
              {BRAND.name}
            </span>
            <span
              style={{
                color: PALETA.acento,
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Software a la medida
            </span>
          </div>
        </div>

        {/* Mensaje principal */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              color: PALETA.tinta,
              fontSize: 62,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: -1.8,
            }}
          >
            Software a medida
          </span>
          <span
            style={{
              color: PALETA.acento,
              fontSize: 62,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: -1.8,
            }}
          >
            para hacer crecer
          </span>
          <span
            style={{
              color: PALETA.tinta,
              fontSize: 62,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: -1.8,
            }}
          >
            tu negocio
          </span>
          <span
            style={{
              color: PALETA.tintaSuave,
              fontSize: 25,
              lineHeight: 1.4,
              marginTop: 18,
            }}
          >
            Sistemas de gestión, SaaS, e-commerce y dashboards · Next.js y
            TypeScript
          </span>
        </div>

        {/* Pie */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${PALETA.borde}`,
            paddingTop: 26,
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            {["Colombia", "Remoto", "Cotización en 24 h"].map((chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  color: PALETA.tintaSuave,
                  border: `1px solid ${PALETA.borde}`,
                  background: PALETA.superficie,
                  borderRadius: 999,
                  padding: "9px 20px",
                  fontSize: 19,
                }}
              >
                {chip}
              </div>
            ))}
          </div>
          <span
            style={{
              color: PALETA.acento,
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            {SITE_HOST}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
