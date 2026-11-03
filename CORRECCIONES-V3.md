# Correcciones v3 — 2 de noviembre de 2026

Parches aplicados sobre la rama `paleta-b` tras la verificación del informe.
Nada de esto requiere variables nuevas ni servicios externos: es código y contenido.

## Seguridad y spam (P0)

1. **Credenciales fuera de los casos de estudio** (P0-5) — flujo, plataforma-educativa
   y minimo-studio ya no publican usuarios/clave; queda "acceso de demostración a
   solicitud". **Acción fuera del código: rotar esas claves en los sistemas reales
   (`plataformaeducativa.co` es producción — cambiar Rector/Docente/Estudiante/Padre;
   también las cuentas demo de flowbill y minimo-studio). El correo
   `scastro@invandinas.com` quedó expuesto públicamente: conviene avisarle al cliente.
2. **Honeypot + rate limit resistente a flood** (P0-4) — campo oculto `sitio_web`
   en los 3 formularios públicos (contacto, cotizar, testimonios) con descarte
   silencioso en el servidor; el límite por IP ya no se autolimpia bajo flood
   (expulsa la entrada más antigua en vez de `clear()`), también en el chat.

## Legal / SEO

3. **`robots.ts`**: `Disallow: /panel` añadido (ya bloqueaba /api, /propuesta,
   /proyecto y /gracias).

## Corrección visual urgente (hallazgo nuevo)

4. **Las 9 páginas de caso recuperaron legibilidad**: con el tema claro, quedaron
   con `text-white` y sin fondo (texto blanco sobre claro). Se les devolvió su
   lienzo oscuro (`bg-[#0D1117]`) como contención. **Pendiente de diseño**: migrar
   estas 9 páginas a la paleta B como el resto del sitio.

## Conversión (P1)

5. **CTA de cierre en las 9 páginas de caso** — bloque "¿Quieres un sistema así
   para tu empresa?" con enlace a `/cotizar` y `/contact` al final de cada caso.

## Verificado como ya resuelto (sin cambios en v3)

- Paleta B aplicada en todo el sitio (0 hex del tema viejo en app/components/lib),
  tokens en `globals.css` + `lib/paleta.ts`, manifest y favicons nuevos,
  `themeColor`, OG por página.
- Métricas del hero honestas (9 casos / <24 h / 100 % remoto).
- CTA "Cotizar" en navbar (escritorio y móvil).
- `generate_lead` y `schedule_call` disparando con consentimiento.

## Pendiente que el código no puede resolver solo

- **Dominio `indexxel.com`**: al comprarlo → dominio en Vercel + `NEXT_PUBLIC_SITE_URL`
  y `EMAIL_FROM` en variables + SPF/DKIM/DMARC en Resend. Mientras tanto el
  fallback de `lib/pricing.ts` sigue apuntando a `pixescript.vercel.app`.
- **GA4**: marcar `generate_lead` y `schedule_call` como eventos clave
  (Admin → Eventos, cuenta 400061503).
- **Migración a paleta B de las 9 páginas de caso** (hoy contención oscura).
- **Limpieza de `public/`**: `vercel.svg`, `next.svg`, `globe.svg`, `window.svg`,
  `file.svg`, `logo.png`, `preview.png`, `preview.png.jpg` (0 referencias).
- Plantillas de correo en las rutas API aún usan colores del tema viejo
  (`#0B0B0B`/`#C2B280`) — cosmético.
- Métricas/validación de testimonios y cuentas sociales con la marca nueva.

## Complemento (mismo día)

6. **Las 7 rutas de correo ya leen `EMAIL_FROM`** — se uniformaron `propuesta`,
   `propuesta/aprobada` y `chat-diagnostics` (antes hardcodeadas). El checklist del
   PLAN-P1 ("cambiar a dominio propio será solo definir EMAIL_FROM") ahora es cierto
   para todas las rutas.
