# Plan P1 — Portafolio Wilson Valencia

Objetivo: convertir el sitio en un proceso comercial repetible — captura unificada, seguimiento
con agenda y propuesta, correo entregable con dominio propio y confianza honesta — sin subir
precios ni prometer de más.

Criterios de aceptación globales:

- `npx tsc --noEmit` y `npx next build` terminan sin errores.
- Los 3 puntos de captura (chat, `/cotizar`, `/contact`) alimentan un solo pipeline y Wilson
  recibe notificaciones con el mismo formato, con origen y UTM.
- El cliente recibe autorrespuesta inmediata desde un correo del dominio propio
  (ya no `onboarding@resend.dev`). → **Requiere dominio (aplazado por Wilson).**
- Propuesta PDF y links de pago con política 50/50 listos para usarse en una venta real.
- No se publican testimonios ni métricas sin validar.
- Lighthouse mantiene 100/100/100 y el bundle no crece (se eliminan dependencias muertas).

Ya cubierto por P0 (no repetir): `force-dynamic`/ISR, reducción de fuentes, pausa de partículas
con `prefers-reduced-motion`, consentimiento y cookies, UTM persistidos 90 días, páginas legales,
guardrails y reintentos del chat.

## Bloque A — Marca y entregabilidad (dominio + correo)

> Nota: el dominio gratuito `*.vercel.app` no permite verificar Resend ni tener correo propio.
> Mientras tanto los correos siguen saliendo de `onboarding@resend.dev` hacia el correo de
> Wilson, como funciona hoy.

- [x] Remitente preparado en las 4 rutas de email: cambiar a dominio propio será solo
      definir `EMAIL_FROM` en Vercel.
- [ ] (Requiere dominio) Comprar dominio, definir `EMAIL_FROM` y `NEXT_PUBLIC_SITE_URL`.
- [ ] (Requiere dominio) Verificar el dominio en Resend (SPF/DKIM/DMARC) y probar entrega.
- [x] OG image propia (`app/opengraph-image.tsx`, 1200×630) con metadatos finales:
      WhatsApp/LinkedIn ya muestran la tarjeta con marca. Verificada en producción.

## Bloque B — Pipeline comercial único

- [x] Migrar `/contact` de `emailjs` al pipeline propio (`/api/contacto` + Resend) y
      eliminar `@emailjs/browser`. Con consentimiento y eventos.
- [x] Notificación interna unificada: origen (chat/cotizar/contacto), contacto, presupuesto
      y UTM en las tres rutas.
- [x] Dashboard propio `/panel/leads` (misma contraseña que `/panel`): leads con estado
      (nuevo → calificado → llamada → propuesta → cerrado/descartado), notas, origen y UTM,
      botones directos a WhatsApp/email. Activación: definir `DATABASE_URL` en Vercel
      (Neon/Supabase gratis); la tabla se crea sola en el primer uso. Sin BD no se pierde
      nada: los leads siguen llegando por correo.
- [x] Cobros en Colombia: transferencia bancaria y Wompi, escritos en `/terminos` §4,
      junto a la política 50/50 ya existente. (Internacional por definir.)
- [x] Planes de mantenimiento definitivos publicados en `lib/pricing.ts` (fuente única):
      Básico $250.000 COP/$65 USD, Estándar $350.000 COP/$90 USD (más elegido),
      Premium $750.000 COP/$190 USD; hora extra $100.000 COP/$25 USD.
      Actualizados: SeccionPrecios, FAQ, JSON-LD, propuestas (IA y respaldo) y prompt de Alma.
- [x] Chat: descalificación amable de proyectos fuera de alcance (nueva regla en el prompt).
      El resumen del lead a Wilson ya incluye la conversación completa (P0).
- [x] Plantilla de propuesta formal: el panel genera borrador IA y descarga HTML imprimible
      a PDF con inclusiones, exclusiones, pagos 50/50 (transferencia/Wompi), garantía y
      soporte 30 días + planes de mantenimiento, propiedad intelectual, validez 15 días y
      bloque de aceptación con firma.
- [ ] Autorrespuesta al cliente → **requiere dominio propio en Resend** (aplazado).
- [ ] Agenda online (Cal.com) + guion de llamada de 15 min + recap por email (pendiente
      cuenta de Cal.com de Wilson).
- [x] Handoff dentro del chat: botón "¿Prefieres hablar con Wilson? Escríbele por WhatsApp"
      sobre el input y "Hablar con Wilson ahora" cuando ya dejó sus datos.

## Bloque C — Confianza honesta

- [x] Eliminar `components/Testimonials.jsx` (sin usar, datos no validados).
- [x] Flujo para testimonios reales: página `/testimonios` (noindex) + `/api/testimonios` —
      el testimonio llega por correo a Wilson con el permiso del cliente y NUNCA se
      publica automático. Enlazado desde el footer ("Deja tu testimonio").
- [ ] Validar o retirar métricas públicas sin fundamento (pendiente confirmar con Wilson).
- [ ] Alinear GitHub y LinkedIn con el posicionamiento del portafolio (tarea de Wilson).

## Bloque D — Analítica y remarketing

- [x] Evento GA4 `generate_lead` disparado junto al evento `Lead` de Meta en el chat y
      en `/cotizar` (y nuevo formulario /contact), solo con consentimiento.
- [ ] Auditar el píxel compartido con AgendaPro → píxel propio y audiencias limpias
      (requiere acceso al administrador de eventos de Meta).
- [ ] (Opcional) CAPI de Meta para eventos del servidor.

## Bloque E — Internacionalización ligera

- [ ] Landing en inglés con `hreflang` (es/en) y precios USD coherentes con `lib/pricing.ts`.
- [ ] Chat en inglés: la detección de idioma ya existe (P0); falta que las respuestas y el
      catálogo funcionen en EN.
- [ ] Overlap de horario y textos de contacto para clientes internacionales.

## Bloque F — Limpieza y rendimiento

- [x] Eliminar `react-tsparticles` y `tsparticles-slim` (sin referencias; 36 paquetes menos).
- [x] Auditoría de bundle tras la limpieza y regresión de Lighthouse: 100/100/100 en
      inicio, /cotizar y /testimonios.

## Bloque G — Portal del cliente y pagos (27 oct 2026)

Objetivo: que cada cliente vea el avance de su proyecto y sepa cuánto y cómo pagar sin
depender de correos sueltos ni de un CRM externo.

- [x] Base de datos del portal en la misma `DATABASE_URL` de Neon: `proyectos`, `hitos`,
      `pagos` y `config_pagos` (se crean solas en el primer uso).
- [x] `/panel/proyectos` (privado, misma contraseña): crear proyecto, token único, hitos con
      estado, pagos con monto/método/link de Wompi, y "Datos de cobro" (banco, cuenta,
      titular, NIT, nota).
- [x] `/proyecto/<token>`: portal del cliente con avance %, etapas, resumen de pagos,
      botón "Pagar con Wompi" y datos para transferencia + comprobante por WhatsApp.
- [x] `noindex`, `robots.txt` con `/proyecto/`, sin widgets públicos (chat, WhatsApp,
      cookies y analítica) en `/proyecto` y `/panel` vía `components/SoloSitioPublico.tsx`.
- [x] Los cobros NO son automáticos: Wilson genera el link en su panel de Wompi y marca
      cada pago como pagado. Webhook de Wompi queda como mejora futura.
- [x] Probado de punta a punta con Postgres local (Docker): crear proyecto, hitos, pagos,
      config, actualizar estados, token inválido 404, validaciones 400, sin sesión 401.
- [x] Lighthouse: `/panel/proyectos` y `/proyecto/<token>` en 100/100/100 (accesibilidad
      corregida: `<main>`, enlaces subrayados, nombre accesible de la marca).

## Bloque H — Agenda de llamadas con Cal.com (27 oct 2026)

Objetivo: que el cliente elija horario solo, sin ida y vuelta por WhatsApp, y que cada clic
quede medido.

- [x] Evento público `Llamada inicial` (15 min, Cal Video) en
      `https://cal.com/wvalencia/llamada-inicial`; disponibilidad y Google Calendar ya
      conectados por Wilson.
- [x] `CAL_URL` como fuente única en `lib/pricing.ts`.
- [x] `components/AgendarLlamada.jsx`: enlace externo (`target="_blank"` +
      `rel="noopener noreferrer"`) con 4 variantes visuales y evento GA4
      `schedule_call` con parámetro `ubicacion`.
- [x] CTAs en `/contact`, `/cotizar` (como alternativa al formulario) y `/gracias`
      (se corrigió "llamada de 30 min" a 15 min).
- [x] Botón en el bloque de lead guardado del chat (`ChatWidget`), tras capturar el lead.
- [x] Enlace de agenda en el prompt de propuestas (sección "Siguiente paso"), en el HTML
      descargable/enviable y en el bloque de aceptación.
- [x] Sin embed ni widget de Cal.com: se abre en pestaña nueva para no cargar scripts de
      terceros ni romper Lighthouse ni el consentimiento.
- [x] Verificado con red real: el clic dispara `schedule_call` con `ubicacion` =
      `contacto`, `cotizar` y `gracias` (GA4 `g/collect`). El botón del chat usa el mismo
      componente (`ubicacion: chat_lead`).

## Bloque I — Accesibilidad AA y dependencias (28 oct 2026)

Objetivo: que todo el sitio cumpla WCAG 2.1 AA de verdad (no solo la home) y que no quede
deuda de seguridad en dependencias.

- [x] Contraste: `text-gray-500`/`text-gray-600` sobre fondos oscuros pasaron a
      `text-gray-400` (7,4:1 sobre `#111`) en home, testimonios, panel, panel/leads,
      flowbill, minimo-studio, rpg, plataforma-educativa, PropuestaForm y PropuestaReview.
- [x] Botones verdes con texto blanco: `bg-green-600` → `bg-green-700` (5,0:1) en rpg y
      plataforma-educativa. El CTA deshabilitado de faebo (`bg-gray-700 text-gray-400`)
      pasó a `text-gray-200`.
- [x] `/about`: los iconos de tecnologías son decorativos (`aria-hidden="true"`); el nombre
      ya se lee en el texto de al lado.
- [x] `/projects`: las tarjetas bajan de `h3` a `h2` cuando la sección ya es `h1`
      (`headingLevel` en `ProjectCard`), sin saltar niveles.
- [x] Verificado con Lighthouse en las 21 rutas públicas + panel: **100/100 en
      accesibilidad**, local y en producción.
- [x] Dependencias: `next` y `eslint-config-next` 16.2.4 → **16.4.3**; `npm audit fix`
      bajó de 10 vulnerabilidades (1 crítica, 4 altas) a 4 bajas, y `resend` 4 → **6.35**
      dejó el audit en **0 vulnerabilities**. Envío de correo verificado con la clave real
      (dominio `pisarteoficial.com` listado y correo de prueba entregado).
- [x] Revisión funcional post-actualización: 25 rutas en 200 sin errores, 30 enlaces internos
      sin roturas, APIs del panel en 401 y enlaces de Cal.com intactos.

## Variables de entorno (Vercel)

| Variable | Estado | Para qué |
|---|---|---|
| `RESEND_API_KEY` | ✅ configurada | Envío de emails de leads |
| `NOTIFY_EMAIL` | opcional | Correo donde llegan los leads (default: wilson.arroyo12@gmail.com) |
| `PANEL_PASSWORD` | ✅ configurada | Contraseña de `/panel`, `/panel/leads` y `/panel/proyectos` |
| `DATABASE_URL` | ✅ configurada (Neon) | Leads, portal de clientes y datos de cobro |
| `EMAIL_FROM` | ⬜ futuro | Remitente propio cuando haya dominio |
| `NEXT_PUBLIC_SITE_URL` | ⬜ futuro | Dominio propio |
| `TELEGRAM_BOT_TOKEN` / `CALLMEBOT_*` | opcionales | Avisos push de leads |

## Pendiente de decisión de Wilson

- ~~Push de `main`~~ → hecho: P0 y P1 desplegados en Vercel.
- ~~Precio de mantenimiento~~ → aprobado: 3 planes publicados.
- ~~CRM~~ → hecho: dashboard propio `/panel/leads` activo con Neon (probado 27 oct).
- ~~Pasarela Colombia~~ → aprobado: transferencia + Wompi.
- ~~`DATABASE_URL` y `PANEL_PASSWORD`~~ → configuradas en Vercel.
- ~~Datos bancarios~~ → cargados en `/panel/proyectos` → "Datos de cobro" (28 oct).
- Cobros internacionales: comparación lista en `docs/pagos-internacionales.md`
  (recomendado Wise Business + link de Wompi como respaldo). Falta decidir.
- GA4: cuenta `400061503` creada. Falta marcar `generate_lead` y `schedule_call` como
  eventos clave (Admin → Eventos) y, si se quiere automatizar por API, el **ID de propiedad**.
- Métricas públicas, GitHub/LinkedIn, Cal.com y revisión legal del contrato/DPA.
- Dominio propio + `EMAIL_FROM`: cuando se compre, activa autorrespuesta y correo profesional.
