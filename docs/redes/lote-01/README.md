# Lote 01 — contenido de lanzamiento

Primer lote de contenido para **Facebook e Instagram** de Indexxel. Todo está en
español (es_CO) y respeta la paleta B y la tipografía del sitio (Inter + Playfair
Display).

**Qué resuelve este lote:** que la página no esté vacía el día que empieces a
pautar, y que cada pieza tenga un CTA medible.

---

## Estructura

```
lote-01/
├── 01-senales-excel/       carrusel · 7 láminas · 1080×1350
│   └── texto.md            copy, CTA, alt text, métricas
├── 02-metodo/              carrusel · 7 láminas · 1080×1350
│   └── texto.md
├── 03-caso-flowbill/       carrusel · 7 láminas · 1080×1350
│   └── texto.md
├── 04-reel-inventario/     reel · 9:16 · 22 s
│   ├── portada.png         miniatura
│   ├── tarjeta-gancho.png  tarjeta 0:02–0:05
│   ├── tarjeta-demo.png    tarjeta 0:17–0:19
│   ├── tarjeta-cierre.png  tarjeta 0:19–0:22
│   ├── rotulo-1..3.png     rótulos transparentes para el video
│   └── guion.md            guion, grabación, montaje, copy
└── perfil/                 imagen de perfil y portadas de destacadas
    ├── perfil-1024.png
    └── destacada-casos|precios|proceso|testimonios.png
```

Cada carrusel son **7 archivos PNG numerados**: se suben en ese orden, en una
sola publicación.

---

## Orden de publicación (10 días)

| Día | Pieza | Palabra clave | Por qué en ese orden |
|---|---|---|---|
| 1 | Carrusel **01 · 5 señales** | `ORDEN` | Diagnóstico: hace que el lector se reconozca antes de que le vendas algo. |
| 3 | Reel **04 · inventario** | `INVENTARIO` | Alcance. Lleva gente nueva al perfil justo después del primer post. |
| 6 | Carrusel **02 · método** | `MÉTODO` | Cuando ya te vio, responde la objeción real: "¿y si pago y desaparece?". |
| 9 | Carrusel **03 · caso** | `CASO` | La prueba, al final. Si va primero, parece demo; si va después, parece criterio. |

Huecos: publica **3 historias** entre cada pieza (detrás de cámaras, encuesta,
pregunta). Sin historias, el perfil se siente abandonado entre publicaciones.

Con estas 4 piezas + historias ya tienes material suficiente para encender la
primera campaña, si además publicas 5 posts más del calendario de 30 días
(`docs/redes/plan-contenido-30-dias.md`).

---

## Qué falta para publicar

- [ ] **Grabar 3 clips de pantalla** para el reel (5 + 4 + 3 s). Instrucciones en
      `04-reel-inventario/guion.md`.
- [ ] **Perfil configurado**: foto, nombre, bio, enlace. Guía paso a paso en
      `docs/redes/guia-primera-publicacion.md`.
- [ ] **Portada de Facebook** (`Portada Facebook Indexxel 820x312.png`).
- [ ] **Revisar los textos** y cambiarlos a tu voz donde suene a plantilla. El
      contenido tiene que sonar a ti, no a una agencia.

---

## Cómo regenerar las imágenes

```powershell
# Fuentes (solo si borraste docs/redes/fuentes)
node scripts/redes-fuentes.mjs

# Carruseles + reel
node scripts/redes-lote01.mjs

# Perfil y destacadas
node scripts/redes-perfil.mjs
```

Requiere Chrome instalado y `puppeteer-core` (ya está en `node_modules`). Para
cambiar un texto, edita `scripts/redes-lote01.mjs` y vuelve a ejecutarlo: no se
editan los PNG a mano.

---

## Reglas que no se negocian

1. **FlowBill, AgendaPro, VentaChat AI e InsightAI son demos**, no clientes. Se
   dicen así, siempre.
2. **No inventar métricas.** Nada de "70 % menos", "3x más rápido" si no hay una
   medición real.
3. **No nombrar clientes** (Pisarte, Mínimo Studio, FAEBO, ARISE, Plataforma
   Educativa) sin permiso escrito.
4. **Nada de capturas con datos personales.** Nombres, correos, cédulas y
   teléfonos reales se tapan o se cambian antes de grabar.
5. **Un solo CTA por pieza.** Si pides seguir, guardar, comentar y escribir, no
   hace nadie nada.
