# Reel — "Tu inventario no vive en un cuaderno"

**Formato:** 1080 × 1920 px (9:16) · 30 fps · **22 segundos**
**Objetivo:** alcance. Es la pieza que lleva gente nueva al perfil.
**Palabra clave del CTA:** `INVENTARIO`
**Audio:** voz en off **opcional**. El reel funciona sin voz, solo con los rótulos.

---

## Archivos que ya tienes

```
04-reel-inventario/portada.png          miniatura del reel (se sube aparte)
04-reel-inventario/tarjeta-gancho.png   tarjeta inicial (0:00–0:05)
04-reel-inventario/tarjeta-demo.png     "esto es una demo" (0:17–0:19)
04-reel-inventario/tarjeta-cierre.png   cierre + CTA (0:19–0:22)
04-reel-inventario/rotulo-1.png         rótulo sobre el video (0:05–0:10)
04-reel-inventario/rotulo-2.png         rótulo sobre el video (0:10–0:14)
04-reel-inventario/rotulo-3.png         rótulo sobre el video (0:14–0:17)
```

Los rótulos tienen **fondo transparente** y están en PNG: se arrastran encima del
video en el editor y ya quedan con la tipografía y el color de la marca. No hay
que buscar la fuente.

**Lo único que falta grabar:** tres clips cortos de la pantalla del sistema
(5 s + 4 s + 3 s). Todo lo demás ya está hecho.

---

## Guion, plano por plano

| Tiempo | Imagen | Rótulo / tarjeta | Qué pasa en pantalla |
|---|---|---|---|
| 0:00–0:02 | Cuaderno con números tachados (o tu Excel real) | *(ninguno)* | Plano fijo, zoom muy lento |
| 0:02–0:05 | `tarjeta-gancho.png` | "Tu inventario no vive en un cuaderno." | Aparece con un *fade* de 0,2 s |
| 0:05–0:10 | Clip 1: dashboard | `rotulo-1.png` | El cursor recorre las tarjetas de resumen |
| 0:10–0:14 | Clip 2: pestaña Inventario | `rotulo-2.png` | Scroll lento por productos; se detiene en el stock bajo |
| 0:14–0:17 | Clip 3: registrar un movimiento | `rotulo-3.png` | Se registra la venta y cambia el stock |
| 0:17–0:19 | `tarjeta-demo.png` | "Esto es una demo de lo que construyo." | Corte seco |
| 0:19–0:22 | `tarjeta-cierre.png` | "Escríbeme «INVENTARIO»" | Se queda fija; el reel termina |

> **Plan B, si no quieres grabar el cuaderno:** elimina el plano 0:00–0:02 y deja
> la tarjeta de gancho de 0:00 a 0:03. El reel dura 20 s y funciona igual.

---

## Texto en pantalla (literal)

```
Tu inventario no vive en un cuaderno.
Y no debería vivir en un Excel que solo entiende una persona.

Qué tienes.
Qué se movió.
Qué falta.

Antes de que el cliente pregunte.

Cada venta descuenta sola.

Esto es una demo de lo que construyo.
Los datos son de ejemplo. El sistema es real.

Si tu inventario vive en papel, se puede ordenar.
Escríbeme «INVENTARIO»
indexxel.com · Cotización en menos de 24 horas.
```

⚠️ **Verifica el rótulo 3 antes de publicar.** Solo vale si al registrar la venta el
stock baja de verdad. Si en la demo el stock se cambia a mano, reemplaza ese
rótulo por **"Cada movimiento queda registrado."** No prometas automatización que
el video no muestra.

---

## Voz en off (opcional, 20 s)

Si la grabas, que sea con tu voz y sin leer: mira el guion una vez y dilo como se
lo contarías a un cliente.

```text
Tu inventario no vive en un cuaderno.
Vive en un sistema que te dice qué tienes, qué se movió y qué falta.
Antes de que el cliente pregunte.
Esto es una demo de lo que construyo.
Si tu inventario vive en papel, se puede ordenar.
Escríbeme.
```

Si no grabas voz: deja el audio original del video **en silencio** y usa solo
música. Los rótulos ya cuentan la historia.

---

## Cómo grabar la pantalla (10 minutos)

1. Abre Chrome en `https://vitainsight.vercel.app` (el dashboard de inventario).
2. Pulsa `Ctrl + 0` para volver al zoom al 100 % y `Ctrl + Shift + B` para ocultar
   la barra de marcadores.
3. Recorta la ventana a 16:9 (1280 × 720 está bien; se ve nítido al montarlo en
   1080 de ancho).
4. Graba con **Xbox Game Bar** (`Win + G` → botón grabar, o `Win + Alt + R`).
   También sirve OBS si ya lo tienes. Guarda en `.mp4`.
5. Graba **tres clips separados**, moviendo el cursor despacio y dejando **un
   segundo quieto** al final de cada uno (eso te da margen para cortar):

| Clip | Qué grabas | Duración grabada |
|---|---|---|
| 1 | Dashboard: mueve el cursor por las tarjetas de ventas del mes y el gráfico | 7 s |
| 2 | Entra a **Inventario**: baja despacio por la lista y detente en un producto con stock bajo | 7 s |
| 3 | **Registrar venta** o movimiento: completa y guarda; muestra cómo cambia el stock | 6 s |

**Trucos que se notan:**

- Nada de notificaciones: activa "No molestar" antes de grabar.
- Cierra pestañas y cualquier dato personal (correos, nombres reales).
- Si el dashboard tiene datos de ejemplo con nombres de personas, cambia antes de
  grabar o elige una vista sin nombres.
- Graba de noche o con luz estable si incluyes el cuaderno: el pulso se nota menos.
- 3 tomas de cada clip. Se elige la mejor; no se "arregla" en edición.

---

## Cómo montarlo en CapCut (15 minutos)

1. **Nuevo proyecto → 9:16.** Importa los 3 clips, las 3 tarjetas y los 3 rótulos.
2. **Fondo:** en el proyecto, pon el color de fondo en `#0F294E` (azul noche). Así
   los clips 16:9 no quedan con franjas negras.
3. Coloca el **clip 1** en la línea de tiempo, escálalo al 100 % del ancho (1080) y
   centrado. Recorta a 5 s.
4. Encima, en una pista nueva, pon `rotulo-1.png` durante esos 5 s. Repite con el
   clip 2 + `rotulo-2` y el clip 3 + `rotulo-3`.
5. **Transiciones:** solo dos *fade* de 0,2 s (cuaderno → tarjeta, tarjeta → video).
   Entre clips de pantalla, **corte seco**: el *fade* hace que parezca lento.
6. **Tarjetas:** `tarjeta-gancho` de 0:02 a 0:05, `tarjeta-demo` de 0:17 a 0:19,
   `tarjeta-cierre` de 0:19 a 0:22. A la tarjeta de gancho aplícale un zoom mínimo
   (100 → 104 %) para que no se sienta congelada.
7. **Música:** biblioteca de Instagram o CapCut, filtrar por *instrumental*. Busca
   algo tipo "minimal corporate", 90–110 BPM, sin voz. Baja a **20–30 %** para que
   no compita. Evita audios con derechos: el reel se silencia en países donde no
   hay licencia.
8. **Exporta** 1080 × 1920, 30 fps, calidad alta.

**Antes de subir:** míralo en el celular, sin audífonos, a volumen bajo. Si no se
entiende sin sonido, el problema son los rótulos.

---

## Portada

`portada.png` **no es un fotograma**: se sube aparte.

En Instagram: al publicar → **Editar portada → Subir desde galería** →
`portada.png`. En el perfil se recorta a 4:5 desde el centro; el texto de la
portada está dentro de esa zona, así que se lee completa en la cuadrícula.

---

## Texto de la publicación

```text
Tu inventario no vive en un cuaderno.

Vive en un sistema que te dice qué tienes, qué se movió y qué falta — antes de
que el cliente pregunte.

Esto es una demo de lo que construyo. Los datos son de ejemplo; el sistema es
real.

Si tu inventario vive en papel, en un Excel que solo entiende una persona o en la
cabeza del que lleva 10 años en la empresa, se puede ordenar.

Escríbeme «INVENTARIO» por DM y te digo qué tan complejo sería en tu caso.
Sin costo.

—
Indexxel · Software a la medida
indexxel.com
```

---

## Primer comentario

```text
La parte que casi nadie muestra: el inventario no se ordena con una app, se
ordena decidiendo qué se cuenta, cuándo y quién lo puede mover.

¿Cómo lo llevas hoy: cuaderno, Excel o sistema?

#softwareamedida #inventario #pymescolombia #emprendedorescolombia #negocioscolombia #medellin #sistemasdegestion #retail #indexxel #controlinterno
```

---

## Cuándo publicar

- **Martes, 6:30–7:30 p. m.** Los reels de pantalla funcionan mejor cuando la
  gente está en el transporte o terminando la jornada.
- Después de publicarlo, compártelo en historias con el texto
  **"Nuevo reel 👇"** y un sticker de enlace al perfil. Eso empuja las primeras
  reproducciones, que son las que deciden el alcance.

---

## Qué mirar a las 48 horas

| Métrica | Qué significa | Referencia sana |
|---|---|---|
| **Retención a los 3 s** | el gancho funciona | > 60 % |
| **Retención media** | el video sostiene | > 35 % |
| **Reproducciones** | alcance | más que tus carruseles |
| **DMs con «INVENTARIO»** | convierte | 1–3 la primera semana |
| **Visitas al perfil** | el reel trajo gente nueva | sube frente al promedio |

Si la retención a los 3 s es baja, el problema es la primera imagen: cambia la
tarjeta de gancho por el clip del cuaderno desde el segundo 0. Si la retención
cae en el minuto 0:10, el clip de inventario es demasiado largo: recórtalo 2 s.

---

## Errores que arruinan este reel

1. **Empezar con el logo.** Es el error más común. La marca va en la tarjeta de
   cierre, no en el primer fotograma.
2. **Poner música con letra.** Compite con los rótulos y distrae.
3. **Rótulos abajo.** La interfaz de Instagram tapa la parte inferior: por eso los
   rótulos van arriba y las tarjetas tienen el texto centrado.
4. **Grabar con notificaciones o datos reales.** Un nombre de cliente en pantalla
   es un problema de privacidad, no un detalle.
5. **Olvidar el "esto es una demo".** Es lo que te permite mostrar un sistema que
   no es de un cliente sin mentir.
6. **Publicarlo en cuadrado o 16:9.** Un reel vertical pierde alcance si tiene
   franjas negras.
