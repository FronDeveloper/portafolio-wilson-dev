# Logo de Pixescript — prompts para generador de imágenes

> Paleta: violeta `#8B5CF6` → `#4C1D95`, blanco `#FFFFFF`, acento turquesa `#5EEAD4`.
> Concepto: **P en rejilla de píxeles**. Plano, sin sombras, legible a 32 px.

Los modelos de imagen entregan **mapas de bits**, no vectores. Genera la idea aquí, elige
una, y el logo final se reconstruye en SVG (ya hay una versión vectorial en
`components/Wordmark.tsx` que puedes usar tal cual o comparar).

---

## 1. Icono (el más importante)

```
Flat vector app icon, 1:1, centered. The letter P built from a 5x5 grid of small
rounded white squares (#FFFFFF) with thin gaps, on a rounded square tile with a
diagonal gradient from #8B5CF6 to #4C1D95. One solid teal square (#5EEAD4) as a
pixel accent at the lower right corner of the tile. Minimal, high contrast, crisp
edges, no 3D, no bevel, no shadow, no texture, flat colors only. Modern software
studio identity, Swiss design, no text, no letters other than the P, readable at
32x32 pixels.
```

**Variante monocroma** (para fondos claros, sellos, camisetas):

```
Same pixel-grid P, single color #0B0B0B on transparent background, flat vector,
no tile, no accent, sharp corners, 1:1, centered, minimal.
```

## 2. Lockup horizontal (icono + nombre)

```
Horizontal logo lockup on a deep near-black background (#0B0B0B): at the left a
rounded-square icon with a violet gradient (#8B5CF6 to #4C1D95) containing a
white pixel-grid letter P with a small teal (#5EEAD4) square accent; at the right
the word «Pixescript» in a clean geometric sans-serif, white, bold, tight
letter-spacing. Vertically centered, 3:1 aspect ratio, wide margins, flat vector
style, no shadows, no outlines, no extra text, no tagline.
```

## 3. Avatar para redes (recorte circular seguro)

```
Square 1:1 social avatar. Rounded-square violet gradient tile (#8B5CF6 to
#4C1D95) filling 82% of the canvas, centered white pixel-grid letter P, one teal
(#5EEAD4) pixel square accent. Everything important inside the central 60% so a
circular crop never cuts it. Flat vector, no text, no border, no shadow.
```

---

## Cómo usarlos bien

1. **Pide 4–8 variaciones** del prompt 1 y elige por legibilidad, no por belleza: reduce
   la imagen a 32 px y mira si sigue siendo una P.
2. **Evita el degradado dentro de la P**: en tamaños pequeños se ensucia. La P va blanca.
3. **Nada de texto generado por IA** dentro del logo: los modelos deforman letras.
   El nombre se compone con tipografía real (Inter, que ya usa el sitio).
4. **Vectoriza**: pasa el PNG ganador por un trazador (Vectorizer, Illustrator > Calco de
   imagen) o pide que se reconstruya a mano. Un logo de 1024 px no sirve como favicon.
5. **Prueba en los tres fondos** que ya usas: negro `#0B0B0B`, blanco y tarjeta `#111`.

## Paleta exacta

| Uso | Hex |
|---|---|
| Violeta claro (inicio del degradado) | `#8B5CF6` |
| Violeta oscuro (fin del degradado) | `#4C1D95` |
| Blanco (la P) | `#FFFFFF` |
| Turquesa (pixel de acento) | `#5EEAD4` |
| Fondo del sitio | `#0B0B0B` |
| Dorado de la marca (texto secundario) | `#C2B280` |
