/**
 * Logotipo horizontal: la P de píxeles ES la primera letra de la palabra.
 * La P se dibuja en SVG y el resto se compone con Inter (la tipografía del sitio),
 * así el conjunto se lee como una sola palabra.
 *
 * Escala con el tamaño de letra: la altura de la P es la altura de mayúscula
 * de Inter (~0.73em), por lo que sirve igual en el navbar que en un banner.
 */

type Props = {
  className?: string;
  /** Color de la P: violeta claro sobre fondo oscuro, violeta oscuro sobre claro. */
  tone?: "oscuro" | "claro";
  /** El color del texto lo hereda del contenedor. */
  label?: string;
};

export default function Wordmark({ className = "", tone = "oscuro", label = "Pixescript" }: Props) {
  const violeta = tone === "claro" ? "#7C3AED" : "#A78BFA";

  return (
    <span
      className={`inline-flex items-baseline ${className}`}
      role="img"
      aria-label={label}
    >
      <svg
        viewBox="0 0 40 50"
        aria-hidden="true"
        focusable="false"
        style={{ height: "0.73em", width: "auto", marginRight: "0.03em" }}
      >
        <g fill={violeta}>
          <rect width="10" height="10" />
          <rect x="10" width="10" height="10" />
          <rect x="20" width="10" height="10" />
          <rect x="30" width="10" height="10" />
          <rect y="10" width="10" height="10" />
          <rect x="30" y="10" width="10" height="10" />
          <rect y="20" width="10" height="10" />
          <rect x="10" y="20" width="10" height="10" />
          <rect x="20" y="20" width="10" height="10" />
          <rect x="30" y="20" width="10" height="10" />
          <rect y="30" width="10" height="10" />
          <rect y="40" width="10" height="10" />
        </g>
      </svg>
      <span aria-hidden="true">ixescript</span>
    </span>
  );
}
