/**
 * Marca de Pixescript: monograma "P" con un pixel de acento.
 * SVG puro: nítido a cualquier tamaño, sin imágenes que cargar.
 */

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

      {/* P: asta + ojo geométrico */}
      <rect x="17" y="14" width="10" height="36" rx="5" fill="#FFFFFF" />
      <circle cx="37" cy="27" r="13" fill="#FFFFFF" />
      <circle cx="37" cy="27" r="6" fill="url(#pixescript-tile)" />

      {/* Pixel de acento */}
      <rect x="46" y="44" width="8" height="8" rx="2" fill="#5EEAD4" />
    </svg>
  );
}
