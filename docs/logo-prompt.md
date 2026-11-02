# Logo de Indexxel — prompts para generador de imágenes

> Paleta: violeta `#8B5CF6` → `#4C1D95`, blanco `#FFFFFF`, acento turquesa `#5EEAD4`.
> Concepto: **X de píxeles** sobre baldosa. Plano, sin sombras, legible a 16 px.

El logo real es vectorial y ya existe:

- `components/Wordmark.tsx` — logotipo para el sitio (baldosa + palabra).
- `docs/marca/indexxel-x.svg` — icono suelto.
- `app/icon.tsx` / `app/apple-icon.tsx` — favicon y apple-icon generados.

Este documento sirve solo si quieres explorar variaciones o llevar la idea a otro
soporte (camiseta, sello, portada). Los modelos de imagen entregan **mapas de bits**:
elige una idea y se reconstruye en SVG; nunca se usa el bitmap como favicon.

---

## 1. Icono (el más importante)

```
Flat vector app icon, 1:1, centered. The letter X built from five square blocks on a
3x3 grid: four pure white blocks (#FFFFFF) at the corners and one teal block
(#5EEAD4) at the exact crossing point. Thick gaps between blocks so the X reads as a
diagonal cross, not as a square. Rounded square tile with a diagonal gradient from
#8B5CF6 to #4C1D95. Minimal, high contrast, crisp edges, no 3D, no bevel, no shadow,
no texture, no gradient mesh, flat colors only. Modern software studio identity,
Swiss design, no text, no letters other than the X, readable at 16x16 pixels.
```

**Variante monocroma** (fondos claros, sellos, camisetas):

```
Same pixel-grid X, single color #0B0B0B on transparent background, flat vector,
no tile, no accent, sharp corners, 1:1, centered, minimal.
```

## 2. Logotipo horizontal

```
Horizontal lockup on a dark background (#0B0B0B): at the left, the pixel-grid X tile
described above; at the right, the word "Indexxel" in a clean geometric sans-serif
(Inter or similar), white, bold, tight tracking. The two letters "xx" of the word are
teal (#5EEAD4); the rest is white. Generous spacing between tile and word, optical
alignment to the cap height. Flat vector, no shadows, no outlines, no decorative
elements beyond the tile.
```

## 3. Avatar para redes (1080×1080)

```
Square 1:1 social avatar, solid #0B0B0B background, centered pixel-grid X tile at
about 70% of the canvas, generous margin so circular crops never cut the tile. Flat,
high contrast, no text, no shadows.
```

## 4. Reglas de uso

- La X nunca se deforma ni se rota; la baldosa no cambia de proporción.
- El acento turquesa es una sola celda: no se repite en varios bloques.
- Sobre fondo claro, el acento pasa a violeta `#7C3AED` (el turquesa no tiene
  contraste suficiente).
- Mínimo digital: 16 px para el icono, 15 px de texto para el logotipo.
