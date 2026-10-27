/**
 * ============================================================
 *  Fuente única de precios, planes y presupuestos
 *  Wilson Valencia Dev  ·  CLIENT-SAFE
 * ============================================================
 *  Todo lo que el visitante ve (home, /cotizar, Alma, propuestas,
 *  JSON-LD, FAQ y emails) sale de este archivo. Si cambias un
 *  precio aquí, cambia en todo el sitio.
 *
 *  ⚠️ Los valores son precios BASE ("desde"). No son cotizaciones
 *     cerradas: el precio final depende del alcance.
 * ============================================================
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://wvalencia-dev.vercel.app";

export const WHATSAPP_PHONE = "573012821174";
export const CONTACT_EMAIL = "wilson.arroyo12@gmail.com";

/** Equivalencia usada solo para mostrar rangos orientativos en USD. */
export const COP_POR_USD = 4000;

export type Moneda = "COP" | "USD";

export type PlanId = "landing" | "ecommerce" | "saas";

export interface PrecioBase {
  cop: number;
  usd: number;
}

export interface Plan {
  id: PlanId;
  nombre: string;
  /** Etiqueta corta para tarjetas y formularios */
  etiqueta: string;
  sub: string;
  desde: PrecioBase;
  plazo: string;
  /** Meses de soporte incluidos después del lanzamiento */
  soporteMeses: number;
  incluye: string[];
  destacado?: boolean;
  /** Tipos de proyecto del formulario que usan este plan */
  tipos: string[];
}

/* ------------------------------------------------------------
 * Planes principales
 * Precios vigentes (sin aumento): 1.2M / 3.2M / 6M COP
 * ---------------------------------------------------------- */

export const PLANES: Plan[] = [
  {
    id: "landing",
    nombre: "Landing Page",
    etiqueta: "Landing page / sitio institucional",
    sub: "Ideal para empezar tu presencia online",
    desde: { cop: 1_200_000, usd: 300 },
    plazo: "5-7 días",
    soporteMeses: 1,
    tipos: ["landing"],
    incluye: [
      "Diseño responsive",
      "Hasta 5 secciones",
      "Formulario de contacto",
      "SEO básico",
      "Entrega en 5-7 días",
      "1 mes de soporte",
    ],
  },
  {
    id: "ecommerce",
    nombre: "E-commerce",
    etiqueta: "E-commerce / tienda online",
    sub: "Vende tus productos sin complicaciones",
    desde: { cop: 3_200_000, usd: 800 },
    plazo: "3-4 semanas",
    soporteMeses: 3,
    tipos: ["ecommerce"],
    destacado: true,
    incluye: [
      "Catálogo de productos",
      "Carrito de compras",
      "Integración de pagos",
      "Panel de administración",
      "Optimización de conversiones",
      "3 meses de soporte",
    ],
  },
  {
    id: "saas",
    nombre: "SaaS / App a medida",
    etiqueta: "SaaS / sistema o app a medida",
    sub: "Software hecho para tu operación",
    desde: { cop: 6_000_000, usd: 1_500 },
    plazo: "6-8 semanas",
    soporteMeses: 6,
    tipos: ["saas", "app", "dashboard"],
    incluye: [
      "Desarrollo a medida",
      "Panel de administración",
      "Base de datos y roles",
      "Integraciones y pagos",
      "Despliegue incluido",
      "6 meses de soporte",
    ],
  },
];

export const PLAN_POR_ID: Record<PlanId, Plan> = {
  landing: PLANES[0],
  ecommerce: PLANES[1],
  saas: PLANES[2],
};

/* ------------------------------------------------------------
 * Mantenimiento mensual
 * Valor de partida editable. No se publica como cotización cerrada.
 * ---------------------------------------------------------- */

export const MANTENIMIENTO = {
  id: "mantenimiento",
  nombre: "Mantenimiento mensual",
  sub: "Tu producto sigue funcionando después del lanzamiento",
  desde: { cop: 350_000, usd: 90 },
  periodo: "mes",
  incluye: [
    "Actualizaciones de seguridad",
    "Copias de seguridad",
    "Monitoreo y corrección de errores",
    "Ajustes menores de contenido",
    "Soporte prioritario por WhatsApp",
  ],
  nota:
    "Plan mensual opcional. El alcance y las horas incluidas se acuerdan por escrito según el tamaño del sistema.",
} as const;

/** Nota única sobre soporte, para no contradecirse entre secciones. */
export const SOPORTE_NOTA =
  "El soporte incluido va de 1 a 6 meses según el plan. Después puedes contratar mantenimiento mensual.";

/* ------------------------------------------------------------
 * Presupuestos
 * Claves en COP (canónicas). Se muestran también en USD porque
 * el portafolio recibe clientes internacionales.
 * ---------------------------------------------------------- */

export interface RangoPresupuesto {
  id: string;
  cop: string;
  usd: string;
  label: string;
  /** Plan sugerido cuando el cliente no sabe qué necesita */
  planSugerido: PlanId;
}

export const PRESUPUESTOS: RangoPresupuesto[] = [
  {
    id: "menos-1m",
    cop: "Menos de $1.000.000 COP",
    usd: "menos de $250 USD",
    label: "Menos de $1.000.000 COP · menos de $250 USD",
    planSugerido: "landing",
  },
  {
    id: "1m-2m",
    cop: "$1.000.000 – $2.000.000 COP",
    usd: "$250 – $500 USD",
    label: "$1.000.000 – $2.000.000 COP · $250 – $500 USD",
    planSugerido: "landing",
  },
  {
    id: "2m-3m5",
    cop: "$2.000.000 – $3.500.000 COP",
    usd: "$500 – $875 USD",
    label: "$2.000.000 – $3.500.000 COP · $500 – $875 USD",
    planSugerido: "ecommerce",
  },
  {
    id: "mas-3m5",
    cop: "Más de $3.500.000 COP",
    usd: "más de $875 USD",
    label: "Más de $3.500.000 COP · más de $875 USD",
    planSugerido: "saas",
  },
  {
    id: "no-definido",
    cop: "Aún no lo tengo claro",
    usd: "necesito asesoría",
    label: "Aún no lo tengo claro / necesito asesoría",
    planSugerido: "landing",
  },
];

export const PRESUPUESTO_LABELS: Record<string, string> = Object.fromEntries(
  PRESUPUESTOS.map((p) => [p.id, p.label])
);

/** Claves antiguas (rangos en USD) que aún pueden llegar por enlaces viejos. */
export const LEGACY_PRESUPUESTO_LABELS: Record<string, string> = {
  "300-800": "$300 – $800 USD (rango antiguo)",
  "800-1500": "$800 – $1.500 USD (rango antiguo)",
  "1500-3000": "$1.500 – $3.000 USD (rango antiguo)",
  "3000+": "Más de $3.000 USD (rango antiguo)",
  undefined: "No definido",
};

export function etiquetaPresupuesto(valor: string): string {
  return (
    PRESUPUESTO_LABELS[valor] ||
    LEGACY_PRESUPUESTO_LABELS[valor] ||
    valor ||
    "No definido"
  );
}

/* ------------------------------------------------------------
 * Tipos de proyecto del formulario
 * ---------------------------------------------------------- */

export const PROYECTO_LABELS: Record<string, string> = {
  landing: "Landing Page / Sitio web",
  ecommerce: "E-commerce / Tienda online",
  saas: "SaaS / Sistema a medida",
  app: "App móvil",
  dashboard: "Dashboard / Panel administrativo",
  mantenimiento: "Mantenimiento de un proyecto existente",
  otro: "No estoy seguro / Necesito asesoría",
};

export const TIPOS_PROYECTO = Object.entries(PROYECTO_LABELS).map(
  ([value, label]) => ({ value, label })
);

/** Tipo del formulario → plan del catálogo (sin adivinar e-commerce). */
export function planParaTipo(tipo: string, presupuesto?: string): Plan {
  if (tipo === "landing") return PLAN_POR_ID.landing;
  if (tipo === "ecommerce") return PLAN_POR_ID.ecommerce;
  if (tipo === "saas" || tipo === "app" || tipo === "dashboard") {
    return PLAN_POR_ID.saas;
  }
  if (tipo === "mantenimiento") return PLAN_POR_ID.saas;

  // Tipo desconocido: se usa el presupuesto declarado. Nunca e-commerce por defecto.
  const rango = PRESUPUESTOS.find((p) => p.id === presupuesto);
  return PLAN_POR_ID[rango?.planSugerido || "landing"];
}

/* ------------------------------------------------------------
 * Catálogo compatible con el motor de propuestas
 * ---------------------------------------------------------- */

export const CATALOGO = {
  landing: {
    nombre: PLAN_POR_ID.landing.nombre,
    precio: `desde ${formatearCOP(PLAN_POR_ID.landing.desde.cop)} COP`,
    plazo: PLAN_POR_ID.landing.plazo,
    soporte: `${PLAN_POR_ID.landing.soporteMeses} mes de soporte gratuito`,
    incluye: PLAN_POR_ID.landing.incluye,
  },
  ecommerce: {
    nombre: PLAN_POR_ID.ecommerce.nombre,
    precio: `desde ${formatearCOP(PLAN_POR_ID.ecommerce.desde.cop)} COP`,
    plazo: PLAN_POR_ID.ecommerce.plazo,
    soporte: `${PLAN_POR_ID.ecommerce.soporteMeses} meses de soporte gratuito`,
    incluye: PLAN_POR_ID.ecommerce.incluye,
  },
  saas: {
    nombre: PLAN_POR_ID.saas.nombre,
    precio: `desde ${formatearCOP(PLAN_POR_ID.saas.desde.cop)} COP`,
    plazo: PLAN_POR_ID.saas.plazo,
    soporte: `${PLAN_POR_ID.saas.soporteMeses} meses de soporte gratuito`,
    incluye: PLAN_POR_ID.saas.incluye,
  },
  /** Alias histórico: las propuestas antiguas usaban `app`. */
  app: {
    nombre: "App a Medida",
    precio: `desde ${formatearCOP(PLAN_POR_ID.saas.desde.cop)} COP`,
    plazo: PLAN_POR_ID.saas.plazo,
    soporte: `${PLAN_POR_ID.saas.soporteMeses} meses de soporte gratuito`,
    incluye: PLAN_POR_ID.saas.incluye,
  },
} as const;

/* ------------------------------------------------------------
 * Capacidades reales de Wilson (para Alma y textos públicos)
 * ---------------------------------------------------------- */

export const CAPACIDADES_PAGO = {
  resumen:
    "Integro pasarelas de pago según el país, la cuenta del cliente y las necesidades del proyecto.",
  colombia: ["Wompi", "PSE", "Efecty", "Tarjetas débito/crédito vía Wompi"],
  internacionales: ["Stripe", "PayPal", "Mercado Pago"],
  proceso:
    "Investigo la documentación del proveedor, valido con el cliente los requisitos y el país soportado, implemento en entorno de pruebas y acompaño la puesta en producción.",
  limite:
    "No prometas un proveedor específico hasta confirmar que la cuenta del cliente lo permite y que el país está soportado. La integración de pagos es una capacidad de Wilson, no una garantía de aprobación por parte del proveedor.",
};

export const CAPACIDADES_ADICIONALES = [
  "Sistemas web a medida, SaaS, dashboards y paneles administrativos",
  "E-commerce e integración de pasarelas de pago nacionales e internacionales",
  "Aplicaciones móviles con Flutter",
  "Sitios y ajustes en WordPress",
  "Integraciones de IA, chatbots y automatización de procesos",
  "Mantenimiento mensual, monitoreo y soporte posterior al lanzamiento",
  "Sistemas multiusuario con roles, permisos y multiinstancia",
  "Integración de APIs y servicios externos",
];

/* ------------------------------------------------------------
 * Formato de precios
 * ---------------------------------------------------------- */

/** 1200000 → "$1.200.000" (determinista, sin depender del ICU del navegador) */
export function formatearCOP(valor: number): string {
  return "$" + String(Math.round(valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** 1500 → "$1.500" */
export function formatearUSD(valor: number): string {
  return "$" + String(Math.round(valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function precioDesde(plan: Plan, moneda: Moneda): string {
  return moneda === "COP"
    ? `${formatearCOP(plan.desde.cop)} COP`
    : `${formatearUSD(plan.desde.usd)} USD`;
}

export function precioMantenimiento(moneda: Moneda): string {
  return moneda === "COP"
    ? `${formatearCOP(MANTENIMIENTO.desde.cop)} COP/mes`
    : `${formatearUSD(MANTENIMIENTO.desde.usd)} USD/mes`;
}

/** Texto compacto para prompts de IA y emails. */
export function resumenPrecios(): string {
  const planes = PLANES.map(
    (p) =>
      `- ${p.nombre}: desde ${formatearCOP(p.desde.cop)} COP (${formatearUSD(
        p.desde.usd
      )} USD), plazo ${p.plazo}, ${p.soporteMeses} ${
        p.soporteMeses === 1 ? "mes" : "meses"
      } de soporte`
  ).join("\n");

  return `${planes}\n- Mantenimiento mensual: desde ${formatearCOP(
    MANTENIMIENTO.desde.cop
  )} COP/mes (${formatearUSD(MANTENIMIENTO.desde.usd)} USD/mes)`;
}
