/* ============================================================
 *  SNIPPET — "Resultados reales" reetiquetado (paso 3 del plan)
 *
 *  QUÉ HACER: en tu home (app/page.jsx, sección RESULTADOS REALES),
 *  reemplaza el ARRAY de objetos (lo que está dentro de {[ ... ].map})
 *  por este. Mantén tus clases y tu .map tal como los tienes.
 *
 *  Etiquetas usadas:
 *  - "Producto propio"  → es tuyo y está vivo (VentaChat, ARISE, Saberly)
 *  - "Proyecto de portafolio" → demo funcional que construiste para dominar el stack
 *  - "Cliente real" → trabajo pagado (Faebo, al cerrar)
 *
 *  ⚠️ 3 CONFIRMACIONES ANTES DE PUBLICAR (marcadas abajo):
 *  1. Pisarte "50+ pedidos": me dijiste que Faebo es tu único cliente real.
 *     Si Pisarte es tuyo y realmente procesó pedidos, deja la métrica;
 *     si no, usa la alternativa que pongo en el comentario.
 *  2. ARISE "500+ descargas": solo inclúyelo si Google Play lo confirma hoy.
 *  3. AgendaPro "−70% ausencias": solo si es una medición real.
 * ============================================================ */

const RESULTADOS = [
  {
    metric: "~2 s",
    label: "Respuesta con IA",
    desc: "VentaChat responde a tus clientes por WhatsApp en segundos, 24/7, con la información de tu negocio. Demo en vivo disponible.",
    tag: "Producto propio · IA",
  },
  {
    metric: "4",
    label: "Pasarelas de pago integradas",
    desc: "Mínimo Studio integra Stripe, Wompi, PSE y Efecty: el stack de pagos completo para e-commerce colombiano, con panel admin y carrito.",
    tag: "Proyecto de portafolio",
  },
  {
    // ⚠️ CONFIRMACIÓN 1: si los pedidos de Pisarte NO son reales, usa:
    //    metric: "100%", label: "Flujo de compra probado",
    //    desc: "Tienda de calzado con catálogo, carrito, pasarela de pago y flujo de pedido probado de punta a punta.",
    metric: "50+",
    label: "Pedidos procesados",
    desc: "Pisarte lleva más de 50 pedidos reales sin un solo error de pago desde su lanzamiento.",
    tag: "Tienda en producción",
  },
  {
    metric: "7",
    label: "Módulos funcionales",
    desc: "FlowBill: dashboard, clientes, proyectos, kanban, facturación con IVA, reportes y portal del cliente — todos operativos.",
    tag: "Proyecto de portafolio",
  },
  {
    // ⚠️ CONFIRMACIÓN 2: si Google Play confirma 500+ descargas, cambia a:
    //    metric: "500+", label: "Descargas en Google Play"
    metric: "Google Play",
    label: "App publicada ✓",
    desc: "ARISE Shadow System: app RPG de entrenamiento con Flutter y Firebase, disponible en la tienda de Google.",
    tag: "Producto propio",
  },
  {
    // ⚠️ CONFIRMACIÓN 3: si el "−70% ausencias" no es medible real, usa:
    //    metric: "24/7", label: "Reservas automáticas",
    //    desc: "AgendaPro gestiona citas con calendario y recordatorios automáticos por email y WhatsApp.",
    metric: "-70%",
    label: "Ausencias por olvidos",
    desc: "AgendaPro reduce las citas perdidas con recordatorios automáticos antes de cada reserva.",
    tag: "Proyecto de portafolio",
  },
  {
    metric: "5",
    label: "Portales con acceso propio",
    desc: "Plataforma Educativa multi-institución: sitio, panel admin, docentes, padres y estudiantes, cada uno con su portal.",
    tag: "Producto propio",
  },
  {
    metric: "IA",
    label: "Análisis automático",
    desc: "InsightAI analiza ventas e inventario de una tienda con asistente de inteligencia artificial integrado al dashboard.",
    tag: "Proyecto de portafolio",
  },
  {
    metric: "Nº 1",
    label: "Cliente real",
    desc: "Fundación FAEBO: sitio institucional para una fundación social colombiana, con diseño accesible y canal para donantes.",
    tag: "Cliente real",
  },
];

export default RESULTADOS;
