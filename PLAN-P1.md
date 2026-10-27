# Plan P1 — Portafolio Wilson Valencia

Objetivo: convertir el sitio en un proceso comercial repetible — captura unificada, seguimiento
con agenda y propuesta, correo entregable con dominio propio y confianza honesta — sin subir
precios ni prometer de más.

Criterios de aceptación globales:

- `npx tsc --noEmit` y `npx next build` terminan sin errores.
- Los 3 puntos de captura (chat, `/cotizar`, `/contact`) alimentan un solo pipeline y Wilson
  recibe notificaciones con el mismo formato, con origen y UTM.
- El cliente recibe autorrespuesta inmediata desde un correo del dominio propio
  (ya no `onboarding@resend.dev`).
- Toda llamada agendada termina con recap por email.
- Propuesta PDF y links de pago con política 50/50 listos para usarse en una venta real.
- No se publican testimonios ni métricas sin validar.
- Lighthouse mantiene 100/100/100 y el bundle no crece (se eliminan dependencias muertas).

Ya cubierto por P0 (no repetir): `force-dynamic`/ISR, reducción de fuentes, pausa de partículas
con `prefers-reduced-motion`, consentimiento y cookies, UTM persistidos 90 días, páginas legales,
guardrails y reintentos del chat.

## Bloque A — Marca y entregabilidad (dominio + correo)

> Nota: el dominio gratuito `*.vercel.app` no permite verificar Resend ni tener correo propio
> (no se le pueden agregar registros SPF/DKIM/DMARC). Mientras no haya dominio, los correos
> siguen saliendo de `onboarding@resend.dev` y la autorrespuesta a clientes no es viable.

- [ ] Preparar `EMAIL_FROM` en el código para que cambiar de remitente sea solo una variable de entorno.
- [ ] (Requiere dominio) Comprar dominio propio, configurar `NEXT_PUBLIC_SITE_URL` y correo profesional.
- [ ] (Requiere dominio) Verificar el dominio en Resend (SPF/DKIM/DMARC) y comprobar entrega en Gmail/Outlook.
- [ ] OG image propia y metadatos finales (compartir en WhatsApp debe verse bien).

## Bloque B — Pipeline comercial único

- [ ] Migrar `/contact` de `emailjs` al pipeline propio (API + Resend) y eliminar `@emailjs/browser`.
- [ ] Unificar el formato de notificación interna: origen (chat/cotizar/contacto), contacto, presupuesto y UTM.
- [ ] Autorrespuesta inmediata al cliente con el siguiente paso y enlace a la agenda.
- [ ] Dashboard propio `/admin` en este mismo proyecto (con login), controlado por Wilson sin
      herramientas externas: leads con estado (nuevo → calificado → llamada → propuesta → cerrado),
      notas, origen y UTM.
- [ ] Agenda online (Cal.com) + guion de llamada de 15 min + recap automático por email.
- [ ] Plantilla de propuesta PDF: alcance, exclusiones, hitos, pagos, garantía, PI y firma.
- [ ] Cobros en Colombia: Transferencia y Wompi, con la política 50/50 ya escrita en `/terminos`.
      (Internacional por definir: Wise/PayPal).
- [ ] Definir tarifa horaria y el plan de mantenimiento definitivo
      (hoy queda como referencia $350.000 COP / $90 USD en `lib/pricing.ts`).
- [ ] Chat: descalificación amable de proyectos fuera de alcance, resumen del lead a Wilson
      y botón de handoff a WhatsApp/agenda.

## Bloque C — Confianza honesta

- [ ] Eliminar `components/Testimonials.jsx` (sin usar, datos no validados).
- [ ] Crear el flujo para testimonios reales: formulario con consentimiento → notificación a
      Wilson → publicación manual solo tras su aprobación (nada se publica solo).
- [ ] Validar o retirar métricas públicas sin fundamento (auditoría §9.3).
- [ ] Alinear GitHub y LinkedIn con el posicionamiento del portafolio.

## Bloque D — Analítica y remarketing

- [ ] Eventos GA4 estándar (p. ej. `generate_lead`) equivalentes al evento `Lead` de Meta.
- [ ] Auditar el píxel compartido con AgendaPro → píxel propio y audiencias limpias.
- [ ] (Opcional) CAPI de Meta para eventos del servidor.

## Bloque E — Internacionalización ligera

- [ ] Landing en inglés con `hreflang` (es/en) y precios USD coherentes con `lib/pricing.ts`.
- [ ] Chat en inglés: la detección de idioma ya existe (P0); falta que las respuestas y el
      catálogo funcionen en EN.
- [ ] Overlap de horario y textos de contacto para clientes internacionales.

## Bloque F — Limpieza y rendimiento

- [ ] Eliminar `react-tsparticles` y `tsparticles-slim` (sin referencias en el código).
- [ ] Auditoría de bundle tras la limpieza y regresión de Lighthouse (100/100/100).

## Pendiente de decisión de Wilson

- ~~Hacer push de `main`~~ → aprobado: se despliega P0 en Vercel al hacer push.
- Dominio propio: aplazado. Consecuencias aceptadas por ahora: correo desde
  `onboarding@resend.dev` y sin autorrespuesta a clientes hasta comprar dominio.
- Plan de mantenimiento: aprobar precios sugeridos (ver conversación) antes de publicarlos;
  hoy quedan como referencia $350.000 COP / $90 USD en `lib/pricing.ts`.
- Cobros internacionales (Wise/PayPal/Stripe): definir después de los de Colombia
  (Transferencia + Wompi ✅).
- Crear cuenta en Wompi y de dónde salen las credenciales para los links de pago.
- Métricas públicas: validar o retirar.
- Revisión legal del contrato y DPA por un abogado.
