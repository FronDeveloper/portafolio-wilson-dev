# Activos de marca

| Archivo | Uso |
|---|---|
| `avatar-1080.png` | Foto de perfil de Instagram, X, LinkedIn, GitHub y WhatsApp Business (1080×1080). |

El logo del sitio no vive aquí: es SVG en `components/Logo.tsx` y su geometría
compartida en `lib/brand-mark.ts`. El favicon y el apple-icon se generan solos
desde `app/icon.tsx` y `app/apple-icon.tsx`.

Regla: **no usar imágenes generadas por IA como favicon ni como logo del sitio.**
Son mapas de bits, con sombras y detalles que desaparecen a 16–32 px.
