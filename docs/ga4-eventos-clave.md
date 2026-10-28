# GA4: marcar los eventos clave del portafolio

> Propiedad: `544190298` · Cuenta: `400061503` · ID de medición del sitio: `G-09M3XYKZ1L`

## Por qué no aparecen todavía

GA4 **no permite crear** un evento clave desde cero: solo deja marcar con la estrella
eventos que la propiedad **ya recibió** al menos una vez. La pantalla
`Admin → Visualización de datos → Eventos` abre en la pestaña **Eventos clave**, que de
fábrica solo trae `purchase`, `qualify_lead` y `close_convert_lead`. Los eventos del sitio
(`generate_lead`, `schedule_call`) están en la otra pestaña: **Eventos recientes**.

Además, un nombre de evento nuevo puede tardar **hasta 24 h** en aparecer en esa lista
(aunque en **Tiempo real** se ve en segundos).

## Comprobar que el sitio y la propiedad son los mismos

1. GA4 → **Admin** → **Flujos de datos** → el flujo web del portafolio.
2. El **ID de medición** debe ser **`G-09M3XYKZ1L`**.
   - Si coincide: los eventos ya están llegando, solo falta marcarlos.
   - Si es otro: el sitio está enviando a otra propiedad y hay que cambiar `GA_ID` en
     `components/Analytics.tsx`.

Comprobación rápida: **Informes → Tiempo real**. Los últimos 30 minutos deben mostrar
`page_view`, `schedule_call` y `generate_lead`.

## Marcar los dos eventos (20 segundos)

1. **Admin → Visualización de datos → Eventos**.
2. Pestaña **Eventos recientes** → busca `schedule_call`.
3. Estrella a la izquierda del nombre → **Marcar como evento clave**.
4. Repite con `generate_lead`.

Con eso quedan disponibles como conversiones para Google Ads y como métrica en los informes.

## Qué manda el sitio (verificado en producción)

| Evento | Parámetros | Dónde se dispara |
|---|---|---|
| `page_view` | `page_location` | cada cambio de ruta |
| `form_start` | — | primer campo tocado en `/contact` o `/cotizar` |
| `generate_lead` | `form: contacto \| cotizar \| chat_alma` | envío exitoso del formulario o lead capturado por el chat |
| `schedule_call` | `ubicacion: contacto \| cotizar \| gracias \| chat_lead` | clic en el CTA de Cal.com |

## Si algún día se quiere automatizar

La Admin API de GA4 necesita una **cuenta de servicio** (Google Cloud → habilitar
"Google Analytics Admin API" → crear clave JSON → agregar el correo de la cuenta de
servicio como **Editor** en la propiedad `544190298`). Con eso se pueden crear los eventos
clave por código. No es necesario para hoy: son dos clics.
