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
- [ ] OG image propia y metadatos finales (compartir en WhatsApp debe verse bien).

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
- [ ] Plantilla de propuesta formal: el panel ya genera borrador IA y descarga HTML
      imprimible a PDF; falta la plantilla con exclusiones, garantía, PI y firma.
- [ ] Autorrespuesta al cliente → **requiere dominio propio en Resend** (aplazado).
- [ ] Agenda online (Cal.com) + guion de llamada de 15 min + recap por email (pendiente
      cuenta de Cal.com de Wilson).
- [ ] Botón de handoff dentro del chat (el botón verde global de WhatsApp ya existe).

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

## Variables de entorno (Vercel)

| Variable | Estado | Para qué |
|---|---|---|
| `RESEND_API_KEY` | ✅ configurada | Envío de emails de leads |
| `NOTIFY_EMAIL` | opcional | Correo donde llegan los leads (default: wilson.arroyo12@gmail.com) |
| `PANEL_PASSWORD` | verificar | Contraseña de `/panel` y `/panel/leads` |
| `DATABASE_URL` | ⬜ agregar | Activa el panel de leads (Neon/Supabase gratis) |
| `EMAIL_FROM` | ⬜ futuro | Remitente propio cuando haya dominio |
| `NEXT_PUBLIC_SITE_URL` | ⬜ futuro | Dominio propio |
| `TELEGRAM_BOT_TOKEN` / `CALLMEBOT_*` | opcionales | Avisos push de leads |

## Pendiente de decisión de Wilson

- ~~Push de `main`~~ → hecho: P0 desplegado en Vercel.
- ~~Precio de mantenimiento~~ → aprobado: 3 planes publicados.
- ~~CRM~~ → aprobado: dashboard propio `/panel/leads` (solo falta `DATABASE_URL`).
- ~~Pasarela Colombia~~ → aprobado: transferencia + Wompi.
- Crear cuenta gratis en Neon (o Supabase), copiar `DATABASE_URL` y agregarla en Vercel.
- Verificar que `PANEL_PASSWORD` esté configurada en Vercel.
- Cobros internacionales (Wise/PayPal/Stripe): definir cuando haya primer cliente.
- Métricas públicas, GitHub/LinkedIn, Cal.com y revisión legal del contrato/DPA.
