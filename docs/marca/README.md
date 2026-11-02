# Activos de marca

| Archivo | Uso |
|---|---|
| `indexxel-avatar-1080.png` | Foto de perfil de Instagram, X, LinkedIn, GitHub y WhatsApp Business (1080×1080). |
| `indexxel-x.svg` | Icono vectorial de la marca (baldosa violeta + X de píxeles). Base para favicon, sellos y material impreso. |
| `indexxel-propuestas.png` | Comparación de las variantes evaluadas (referencia histórica). |
| `avatar-1080.png` | Avatar de la marca anterior (Pixescript). Ya no se usa. |

El logo del sitio no vive aquí: es `components/Wordmark.tsx` (baldosa + palabra, con la
doble x acentuada) y su geometría se comparte desde `lib/brand-mark.ts`. El favicon y el
apple-icon se generan solos desde `app/icon.tsx` y `app/apple-icon.tsx`.

Regla: **no usar imágenes generadas por IA como favicon ni como logo del sitio.**
Son mapas de bits, con sombras y detalles que desaparecen a 16–32 px. La marca es
geometría: cuatro bloques y un cruce, dibujados en SVG.
