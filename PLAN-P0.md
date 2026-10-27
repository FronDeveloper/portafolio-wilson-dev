# Plan P0 — Portafolio Wilson Valencia

Objetivo: dejar de perder leads, unificar precios, hacer a Alma más confiable y cerrar los
huecos de confianza/legales antes de seguir invirtiendo en tráfico.

Criterios de aceptación globales:

- `npx tsc --noEmit` y `npx next build` terminan sin errores.
- Un solo lugar define precios, planes, presupuestos y soporte (`lib/pricing.ts`).
- El chat conserva la conversación al recargar y se puede borrar.
- Un lead del chat o del formulario llega a Wilson con origen (UTM), contacto y presupuesto.
- Analytics solo se carga con consentimiento y el evento `Lead` se dispara una sola vez.
- Existen `/privacidad` y `/terminos`, enlazadas desde el footer y los formularios.
- Las páginas públicas se sirven estáticas (sin `force-dynamic` global).

## Bloque 1 — Precios y catálogo

- [x] Crear `lib/pricing.ts` como fuente única: planes, precios COP/USD, plazos, soporte,
      presupuestos, mantenimiento, capacidades de pago y textos de soporte.
- [x] Agregar `saas` y `mantenimiento` al catálogo (sin subir los precios públicos actuales).
- [x] Refactorizar `lib/catalogo.ts`, `SeccionPrecios.jsx`, `Faq.jsx`, `JsonLd.jsx`,
      `app/cotizar`, `PropuestaForm`, `/api/cotizar` y `lib/propuestas.ts`.
- [x] Unificar el vocabulario de presupuesto (claves COP) conservando las claves USD antiguas.

## Bloque 2 — Chat y leads

- [x] Persistencia del chat en `localStorage` v2 con TTL de 7 días, hidratación previa y
      botón para borrar la conversación.
- [x] Eliminar el badge falso “1” y mostrar aviso de privacidad del chat.
- [x] Devolver contacto y presupuesto del lead desde `/api/chat` para prellenar la propuesta.
- [x] Enviar UTM, página de origen y referrer en las notificaciones de lead.
- [x] `lib/ai.ts`: reintentos con backoff, fallback Groq 120b → 20b y OpenRouter/GLM opcional.
- [x] Propuesta: nunca elegir e-commerce por defecto para un tipo desconocido.
- [x] Formulario de propuesta: consentimiento, etiquetas accesibles y datos prellenados.

## Bloque 3 — Analytics y legal

- [x] Consentimiento de cookies/analytics; GA4 y Meta solo después de aceptar.
- [x] Conservar UTM durante la navegación (90 días) y enviarlos con el lead.
- [x] Quitar el `value: 500 USD` inventado y disparar `Lead` una sola vez.
- [x] Páginas `/privacidad` y `/terminos` con tratamiento de datos (Ley 1581 de 2012).
- [x] Checkbox de consentimiento en `/cotizar` y en la propuesta.
- [x] Enlaces legales en el footer.

## Bloque 4 — SEO, UX y rendimiento

- [x] Quitar `force-dynamic` del layout raíz y reducir fuentes.
- [x] `app/not-found.tsx` en español; `app/robots.ts`; sitemap completo.
- [x] Montar `JsonLd` (usaba precios duplicados y no estaba montado).
- [x] H1 en `/projects`, títulos sin doble marca, `noindex` en `/gracias`.
- [x] Corregir grilla de tablets, etiquetas de formulario y nombres accesibles en el hero.
- [x] Pausar partículas con `prefers-reduced-motion` y pestaña oculta; bajar densidad.
- [x] Cabeceras de seguridad en `next.config.ts`.
- [x] Eliminar rutas/componentes muertos (`/api/lead`, `LeadMagnet`, `Pricing`).

## Pendiente de decisión de Wilson (no bloquea P0)

- Precio de mantenimiento: hoy queda como referencia editable en `lib/pricing.ts`.
- Dominio propio (`NEXT_PUBLIC_SITE_URL`) y verificación del dominio en Resend.
- Revisión legal de `/privacidad` y `/terminos` por un abogado.
- Validar métricas públicas y testimonios antes de publicarlos.
