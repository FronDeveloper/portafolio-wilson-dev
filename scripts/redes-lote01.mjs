/**
 * Genera las piezas del lote 1 de redes (3 carruseles + portada de reel).
 *
 *   node scripts/redes-lote01.mjs
 *
 * Salida: docs/redes/lote-01/<pieza>/NN.png (1080×1350, 4:5) y
 *         docs/redes/lote-01/04-reel-inventario/portada.png (1080×1920, 9:16).
 *
 * Todo se dibuja en HTML y se captura con Chrome, así el texto usa las mismas
 * fuentes del sitio (Inter y Playfair) y queda nítido a tamaño real.
 */

import puppeteer from "puppeteer-core";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const RAIZ = "C:/Users/Asus/wilson-portfolio";
const SALIDA = path.join(RAIZ, "docs/redes/lote-01");
const FUENTES = path.join(RAIZ, "docs/redes/fuentes");

const PALETA = {
  navy: "#0F294E",
  azul: "#1D4ED8",
  azulClaro: "#4D94F0",
  fondo: "#F4F7FB",
  blanco: "#FFFFFF",
  tenue: "#52657E",
  borde: "#D8E1EC",
};

// ── Fuentes embebidas ────────────────────────────────────────────────────────

async function fuente(nombre) {
  const datos = await readFile(path.join(FUENTES, nombre));
  return `data:font/woff2;base64,${datos.toString("base64")}`;
}

const caras = [
  ["Inter", 400, "inter-400.woff2"],
  ["Inter", 500, "inter-500.woff2"],
  ["Inter", 600, "inter-600.woff2"],
  ["Inter", 700, "inter-700.woff2"],
  ["Inter", 800, "inter-800.woff2"],
  ["Playfair Display", 700, "playfair-700.woff2"],
];

const cssFuentes = (
  await Promise.all(
    caras.map(
      async ([familia, peso, archivo]) =>
        `@font-face{font-family:'${familia}';font-style:normal;font-weight:${peso};src:url(${await fuente(archivo)}) format('woff2');}`
    )
  )
).join("\n");

// ── Marca ────────────────────────────────────────────────────────────────────

/** Baldosa [x] para fondos claros. */
function marcaClara(lado = 46) {
  return `<svg width="${lado}" height="${lado}" viewBox="0 0 64 64" aria-hidden="true">
    <rect width="64" height="64" rx="12.25" fill="${PALETA.navy}"/>
    <path d="M 29.375 17 H 16.875 V 48.5 H 29.375" stroke="#fff" stroke-width="3.75" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 34.625 17 H 47.125 V 48.5 H 34.625" stroke="#fff" stroke-width="3.75" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 40.625 23.875 L 23.375 41.125" stroke="#fff" stroke-width="5.25" fill="none"/>
    <path d="M 23.375 23.875 L 40.625 41.125" stroke="${PALETA.azulClaro}" stroke-width="5.25" fill="none"/>
  </svg>`;
}

/** Sobre azul noche la baldosa se funde: se usa la X suelta. */
function marcaOscura(lado = 52) {
  return `<svg width="${lado}" height="${lado}" viewBox="0 0 64 64" aria-hidden="true">
    <path d="M 40.625 23.875 L 23.375 41.125" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M 23.375 23.875 L 40.625 41.125" stroke="${PALETA.azulClaro}" stroke-width="7" fill="none" stroke-linecap="round"/>
  </svg>`;
}

const marca = (oscuro) => `
  <div class="marca">
    ${oscuro ? marcaOscura() : marcaClara()}
    <span class="marca-texto">Indexxel</span>
  </div>`;

// ── Plantillas ───────────────────────────────────────────────────────────────

const CSS = `
  * { margin:0; padding:0; box-sizing:border-box; }
  body { margin:0; }
  .slide {
    position:relative; width:1080px; height:1350px; overflow:hidden;
    display:flex; flex-direction:column; padding:76px 88px 70px;
    font-family:'Inter', system-ui, sans-serif;
    -webkit-font-smoothing:antialiased;
  }
  .claro { background:${PALETA.fondo}; color:${PALETA.navy}; }
  .oscuro { background:linear-gradient(158deg,#16365f 0%, ${PALETA.navy} 52%, #0a1d36 100%); color:#fff; }
  .oscuro::before {
    content:''; position:absolute; inset:0;
    background-image:
      repeating-linear-gradient(0deg, rgba(255,255,255,.055) 0 1px, transparent 1px 54px),
      repeating-linear-gradient(90deg, rgba(255,255,255,.055) 0 1px, transparent 1px 54px);
  }
  .oscuro::after {
    content:''; position:absolute; width:820px; height:820px; right:-280px; top:-260px;
    background:radial-gradient(circle, rgba(77,148,240,.30) 0%, rgba(77,148,240,0) 68%);
  }
  .slide > * { position:relative; z-index:1; }

  .barra { position:absolute; z-index:2; top:0; left:0; right:0; height:7px; background:rgba(15,41,78,.10); }
  .oscuro .barra { background:rgba(255,255,255,.14); }
  .barra span { display:block; height:100%; background:${PALETA.azul}; }
  .oscuro .barra span { background:${PALETA.azulClaro}; }

  header { display:flex; align-items:center; justify-content:space-between; }
  .marca { display:flex; align-items:center; gap:16px; }
  .marca-texto { font-size:40px; font-weight:700; letter-spacing:-.02em; }
  .folio { font-size:22px; font-weight:600; letter-spacing:.18em; color:${PALETA.tenue}; }
  .oscuro .folio { color:rgba(255,255,255,.62); }

  main { flex:1; display:flex; flex-direction:column; justify-content:center; }
  /* En las láminas de contenido el bloque se ancla arriba: así el número y el
     título quedan a la misma altura en todas y el carrusel no "salta" al pasar. */
  main.arriba { justify-content:flex-start; padding-top:104px; }

  .kicker { font-size:23px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:${PALETA.azulClaro}; }
  .regla { width:78px; height:5px; background:${PALETA.azulClaro}; border-radius:99px; margin:30px 0 34px; }
  .titular { font-family:'Playfair Display', Georgia, serif; font-size:94px; line-height:1.06; font-weight:700; letter-spacing:-.02em; }
  .bajada { margin-top:38px; font-size:37px; line-height:1.42; color:rgba(255,255,255,.80); max-width:820px; }

  .etiqueta { font-size:22px; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:${PALETA.azul}; }
  .numero { font-size:108px; font-weight:800; line-height:.9; color:${PALETA.azul}; letter-spacing:-.04em; }
  .titulo { margin-top:26px; font-size:62px; line-height:1.1; font-weight:700; letter-spacing:-.025em; }
  .cuerpo { margin-top:26px; font-size:38px; line-height:1.45; color:${PALETA.tenue}; max-width:880px; }
  .cuerpo strong { color:${PALETA.navy}; font-weight:600; }

  .lista { display:flex; flex-direction:column; gap:22px; margin-top:8px; }
  .fila { display:flex; gap:22px; align-items:flex-start; }
  .punto { flex:none; width:16px; height:16px; border-radius:99px; background:${PALETA.azulClaro}; margin-top:16px; }
  .fila p { font-size:36px; line-height:1.4; color:${PALETA.tenue}; }

  .imagen-marco { border-radius:18px; overflow:hidden; border:1px solid ${PALETA.borde}; box-shadow:0 24px 60px rgba(15,41,78,.16); background:#fff; }
  .barra-nav { display:flex; align-items:center; gap:9px; padding:15px 18px; background:#eef2f8; border-bottom:1px solid ${PALETA.borde}; }
  .circulo { width:13px; height:13px; border-radius:99px; }
  .url { margin-left:12px; font-size:20px; color:${PALETA.tenue}; background:#fff; border:1px solid ${PALETA.borde}; border-radius:8px; padding:6px 16px; }
  .imagen-marco img { display:block; width:100%; }

  .boton { align-self:flex-start; display:inline-flex; align-items:center; gap:20px; margin-top:44px; background:${PALETA.azul}; color:#fff; font-size:38px; font-weight:700; padding:27px 48px; border-radius:99px; }
  .nota { margin-top:26px; font-size:29px; line-height:1.5; color:rgba(255,255,255,.70); max-width:800px; }
  .nota-oscura { margin-top:24px; font-size:29px; line-height:1.5; color:${PALETA.tenue}; }

  footer { display:flex; align-items:center; justify-content:space-between; font-size:24px; font-weight:500; color:${PALETA.tenue}; }
  .oscuro footer { color:rgba(255,255,255,.55); }
  .desliza { display:flex; align-items:center; gap:14px; font-size:26px; font-weight:600; color:#fff; }
  .flecha { display:grid; place-items:center; width:52px; height:52px; border-radius:99px; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.22); font-size:26px; }

  .chips { display:flex; flex-wrap:wrap; gap:16px; margin-top:34px; }
  .chip { font-size:27px; font-weight:600; color:${PALETA.navy}; background:#fff; border:1px solid ${PALETA.borde}; border-radius:99px; padding:14px 26px; }
`;

function slide({ tema = "claro", indice, total, contenido, pie, posicion }) {
  const oscuro = tema === "oscuro";
  const progreso = (indice / total) * 100;
  const anclaje = posicion ?? (tema === "claro" ? "arriba" : "");
  return `<div class="slide ${tema}">
    <div class="barra"><span style="width:${progreso}%"></span></div>
    <header>${marca(oscuro)}<span class="folio">${String(indice).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span></header>
    <main class="${anclaje}">${contenido}</main>
    <footer>${pie ?? `<span>indexxel.com</span><span>@indexxel</span>`}</footer>
  </div>`;
}

// ── Carrusel 1: 5 señales ────────────────────────────────────────────────────

const senales = [
  ["Vendes algo que el sistema dice que tienes… y no está.", "El inventario se descuadra y lo descubres cuando el cliente ya pagó. Ahí toca pedir disculpas o devolver plata."],
  ["Dos personas editan el mismo archivo. Una sobrescribe a la otra.", "El dato bueno se pierde y nadie sabe cuál es la versión final. Se decide con información vieja."],
  ["Para saber cuánto ganaste el mes pasado, alguien se queda hasta tarde.", "Si el cierre del mes depende de una persona, el negocio depende de esa persona. Y esa persona se enferma, se va o se cansa."],
  ["El inventario se cuadra “a ojo” cada diciembre.", "Un conteo anual no corrige doce meses de errores. Solo los descubre todos de golpe."],
  ["Todo pedido recibe la misma respuesta: “ya te averiguo”.", "El cliente no ve el estado de su pedido. Te escribe tres veces y termina comprando donde sí le responden."],
];

const carrusel1 = {
  carpeta: "01-senales-excel",
  total: 7,
  slides: [
    slide({
      tema: "oscuro",
      indice: 1,
      total: 7,
      contenido: `<p class="kicker">Para negocios que ya no caben en Excel</p>
        <div class="regla"></div>
        <h1 class="titular">5 señales de que tu negocio ya no aguanta el Excel</h1>
        <p class="bajada">Si te reconoces en dos o más, el problema no es el archivo. Es que el negocio creció y la herramienta se quedó.</p>`,
      pie: `<span class="desliza">Desliza <span class="flecha">→</span></span><span>indexxel.com</span>`,
    }),
    ...senales.map(([titulo, cuerpo], i) =>
      slide({
        indice: i + 2,
        total: 7,
        contenido: `<p class="etiqueta">Señal ${i + 1} de 5</p>
          <div class="numero">0${i + 1}</div>
          <h2 class="titulo">${titulo}</h2>
          <p class="cuerpo">${cuerpo}</p>`,
      })
    ),
    slide({
      tema: "oscuro",
      indice: 7,
      total: 7,
      contenido: `<p class="kicker">El diagnóstico</p>
        <div class="regla"></div>
        <h2 class="titular" style="font-size:82px">Si te reconociste en dos o más, no necesitas más Excel.</h2>
        <p class="bajada">Necesitas un sistema que te diga qué tienes, qué vendiste y qué te deben, sin depender de la memoria de nadie.</p>
        <div class="boton">Escríbeme «ORDEN» <span>→</span></div>
        <p class="nota">Te digo por dónde empezar. Sin costo y sin compromiso.</p>`,
    }),
  ],
};

// ── Carrusel 2: método ───────────────────────────────────────────────────────

const pasos = [
  ["Me cuentas el problema", "Quince minutos. Sin costo, sin compromiso y sin discurso de ventas. Si tu caso no es para mí, te lo digo ahí mismo."],
  ["Recibes alcance y precio por escrito", "En menos de 24 horas: qué incluye, qué no incluye, cuánto cuesta y en cuánto tiempo. Sin “te paso el dato luego”."],
  ["Anticipo del 50 % y arrancamos", "Transferencia o Wompi. Cada pago lo confirmo yo, no un robot. El otro 50 % se paga contra entrega funcionando."],
  ["Ves el avance cada semana", "Demo real sobre el sistema, no capturas de pantalla. Lo que no te gusta se corrige cuando todavía es barato corregirlo."],
  ["Entrega con documentación", "Te quedas con el código, las credenciales y una guía para operar el sistema. No te dejo amarrado a mí."],
];

const carrusel2 = {
  carpeta: "02-metodo",
  total: 7,
  slides: [
    slide({
      tema: "oscuro",
      indice: 1,
      total: 7,
      contenido: `<p class="kicker">Cómo se trabaja con Indexxel</p>
        <div class="regla"></div>
        <h1 class="titular">Cómo es trabajar conmigo, en 5 pasos</h1>
        <p class="bajada">Sin sorpresas, sin letra menuda y sin pagar el 100 % por adelantado. Así se ve un proyecto de principio a fin.</p>`,
      pie: `<span class="desliza">Desliza <span class="flecha">→</span></span><span>indexxel.com</span>`,
    }),
    ...pasos.map(([titulo, cuerpo], i) =>
      slide({
        indice: i + 2,
        total: 7,
        contenido: `<p class="etiqueta">Paso ${i + 1} de 5</p>
          <div class="numero">0${i + 1}</div>
          <h2 class="titulo">${titulo}</h2>
          <p class="cuerpo">${cuerpo}</p>`,
      })
    ),
    slide({
      tema: "oscuro",
      indice: 7,
      total: 7,
      contenido: `<p class="kicker">Sin letra menuda</p>
        <div class="regla"></div>
        <h2 class="titular" style="font-size:84px">Así se ve un proyecto cuando quien lo construye también te lo explica.</h2>
        <p class="bajada">Hablas con la persona que programa, no con un vendedor que después desaparece.</p>
        <div class="boton">Agenda los 15 minutos <span>→</span></div>
        <p class="nota">indexxel.com · Respondo en menos de 24 horas.</p>`,
    }),
  ],
};

// ── Carrusel 3: caso FlowBill ────────────────────────────────────────────────

const flowbill = `data:image/jpeg;base64,${(
  await readFile(path.join(RAIZ, "public/images/flowbill.jpg"))
).toString("base64")}`;

const carrusel3 = {
  carpeta: "03-caso-flowbill",
  total: 7,
  slides: [
    slide({
      tema: "oscuro",
      indice: 1,
      total: 7,
      contenido: `<p class="kicker">Caso · Gestión de agencias</p>
        <div class="regla"></div>
        <h1 class="titular">Una agencia facturaba en Word. Así se veía su mes.</h1>
        <p class="bajada">Tres versiones de la verdad: proyectos en Excel, facturas sueltas y clientes preguntando por WhatsApp.</p>`,
      pie: `<span class="desliza">Desliza <span class="flecha">→</span></span><span>indexxel.com</span>`,
    }),
    slide({
      indice: 2,
      total: 7,
      contenido: `<p class="etiqueta">El problema</p>
        <h2 class="titulo">Nadie sabía cuánto había facturado hasta que era tarde.</h2>
        <p class="cuerpo">Cada área llevaba su archivo. El proyecto vivía en un Excel, la factura en Word y la conversación en WhatsApp. Cuando el cliente preguntaba por su entrega, había que preguntarle a tres personas.</p>`,
    }),
    slide({
      indice: 3,
      total: 7,
      contenido: `<p class="etiqueta">La decisión</p>
        <h2 class="titulo">No hacía falta una app nueva. Hacía falta un solo lugar.</h2>
        <p class="cuerpo">Unifiqué proyecto, factura y cliente en el mismo sistema: tablero Kanban, facturación con IVA y un portal donde el cliente ve su avance sin escribir por WhatsApp.</p>`,
    }),
    slide({
      indice: 4,
      total: 7,
      posicion: "",
      contenido: `<p class="etiqueta" style="margin-bottom:26px">El sistema</p>
        <div class="imagen-marco">
          <div class="barra-nav">
            <span class="circulo" style="background:#ff5f57"></span>
            <span class="circulo" style="background:#febc2e"></span>
            <span class="circulo" style="background:#28c840"></span>
            <span class="url">flowbill-web.vercel.app</span>
          </div>
          <img src="${flowbill}" alt="Tablero de FlowBill con proyectos y facturación" />
        </div>
        <p class="nota-oscura">Tablero de proyectos, facturación y estado del cliente en una sola pantalla.</p>`,
    }),
    slide({
      indice: 5,
      total: 7,
      contenido: `<p class="etiqueta">Lo que cambia</p>
        <h2 class="titulo">El mes deja de cerrarse a mano.</h2>
        <div class="chips">
          <span class="chip">Facturación en el mismo tablero</span>
          <span class="chip">El cliente ve su avance</span>
          <span class="chip">Un solo dato, no tres versiones</span>
        </div>
        <p class="cuerpo" style="margin-top:38px">No es magia ni inteligencia artificial. Es dejar de perseguir la información en tres sitios distintos.</p>`,
    }),
    slide({
      indice: 6,
      total: 7,
      contenido: `<p class="etiqueta">Transparencia</p>
        <h2 class="titulo">Esto es una demo funcional, no un cliente real.</h2>
        <p class="cuerpo">La construí para mostrar el tipo de sistema que adapto a cada negocio. Los nombres y los datos son de ejemplo. Prefiero decirlo antes de que alguien lo pregunte.</p>`,
    }),
    slide({
      tema: "oscuro",
      indice: 7,
      total: 7,
      contenido: `<p class="kicker">Tu caso</p>
        <div class="regla"></div>
        <h2 class="titular" style="font-size:84px">Si tu operación se parece a esto, se puede ordenar.</h2>
        <p class="bajada">No necesitas contratar un equipo de veinte personas. Necesitas el sistema correcto y a alguien que lo entienda.</p>
        <div class="boton">Cuéntame tu caso <span>→</span></div>
        <p class="nota">indexxel.com · Cotización en menos de 24 horas.</p>`,
    }),
  ],
};

// ── Portada del reel ─────────────────────────────────────────────────────────

const portadaReel = `<div class="slide oscuro" style="height:1920px; padding:120px 92px 110px">
  <div class="barra"><span style="width:100%"></span></div>
  <header>${marca(true)}<span class="folio">INVENTARIO</span></header>
  <main>
    <p class="kicker">Inventario · Antes y después</p>
    <div class="regla"></div>
    <h1 class="titular" style="font-size:118px; line-height:1.02">Tu inventario no vive en un cuaderno.</h1>
    <p class="bajada" style="font-size:44px; max-width:860px">Vive en un sistema que te dice qué tienes, qué se movió y qué falta — antes de que el cliente pregunte.</p>
  </main>
  <footer><span>indexxel.com</span><span>@indexxel</span></footer>
</div>`;

/** Tarjetas a pantalla completa (9:16) para montar el reel en el editor. */
const tarjetaReel = (contenido) => `<div class="slide oscuro" style="height:1920px; padding:150px 92px 300px">
  <div class="barra"><span style="width:100%"></span></div>
  <header>${marca(true)}<span class="folio">INVENTARIO</span></header>
  <main>${contenido}</main>
  <footer><span>indexxel.com</span><span>@indexxel</span></footer>
</div>`;

const tarjetaGancho = tarjetaReel(`
  <p class="kicker">Antes</p>
  <div class="regla"></div>
  <h1 class="titular" style="font-size:112px; line-height:1.03">Tu inventario no vive en un cuaderno.</h1>
  <p class="bajada" style="font-size:42px">Y no debería vivir en un Excel que solo entiende una persona.</p>`);

const tarjetaDemo = tarjetaReel(`
  <p class="kicker">Transparencia</p>
  <div class="regla"></div>
  <h1 class="titular" style="font-size:104px; line-height:1.04">Esto es una demo de lo que construyo.</h1>
  <p class="bajada" style="font-size:42px">Los datos son de ejemplo. El sistema es real.</p>`);

const tarjetaCierre = tarjetaReel(`
  <p class="kicker">Tu negocio</p>
  <div class="regla"></div>
  <h1 class="titular" style="font-size:98px; line-height:1.05">Si tu inventario vive en papel, se puede ordenar.</h1>
  <div class="boton">Escríbeme «INVENTARIO» <span>→</span></div>
  <p class="nota">indexxel.com · Cotización en menos de 24 horas.</p>`);

/**
 * Rótulos con fondo transparente para poner encima del video del sistema.
 * Se colocan arriba del área donde va la captura (16:9 centrada).
 */
const rotulo = (texto) => `<div style="position:relative; width:1080px; height:1920px; background:transparent;
    font-family:'Inter', system-ui, sans-serif;">
  <div style="position:absolute; top:352px; left:0; right:0; display:flex; justify-content:center; padding:0 90px;">
    <span style="display:block; max-width:880px; text-align:center; background:rgba(15,41,78,.93);
      color:#fff; font-size:50px; font-weight:600; line-height:1.2; padding:26px 44px;
      border-radius:28px; border:1px solid rgba(255,255,255,.20);">${texto}</span>
  </div>
</div>`;

// ── Render ───────────────────────────────────────────────────────────────────

const navegador = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--font-render-hinting=none"],
});

async function render(html, archivo, alto, { transparente = false } = {}) {
  const pagina = await navegador.newPage();
  await pagina.setViewport({ width: 1080, height: alto, deviceScaleFactor: 1 });
  await pagina.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><style>${cssFuentes}\n${CSS}</style></head><body${transparente ? ' style="background:transparent"' : ""}>${html}</body></html>`,
    { waitUntil: "load" }
  );
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.screenshot({ path: archivo, omitBackground: transparente });
  await pagina.close();
}

for (const carrusel of [carrusel1, carrusel2, carrusel3]) {
  const carpeta = path.join(SALIDA, carrusel.carpeta);
  await mkdir(carpeta, { recursive: true });
  for (const [i, html] of carrusel.slides.entries()) {
    await render(html, path.join(carpeta, `${String(i + 1).padStart(2, "0")}.png`), 1350);
  }
  console.log(carrusel.carpeta, carrusel.slides.length, "láminas");
}

const carpetaReel = path.join(SALIDA, "04-reel-inventario");
await mkdir(carpetaReel, { recursive: true });
await render(portadaReel, path.join(carpetaReel, "portada.png"), 1920);
for (const [nombre, html] of [
  ["tarjeta-gancho", tarjetaGancho],
  ["tarjeta-demo", tarjetaDemo],
  ["tarjeta-cierre", tarjetaCierre],
]) {
  await render(html, path.join(carpetaReel, `${nombre}.png`), 1920);
}
console.log("04-reel-inventario portada + 3 tarjetas");

for (const [nombre, texto] of [
  ["rotulo-1", "Qué tienes.<br>Qué se movió.<br>Qué falta."],
  ["rotulo-2", "Antes de que el<br>cliente pregunte."],
  ["rotulo-3", "Cada venta<br>descuenta sola."],
]) {
  await render(rotulo(texto), path.join(carpetaReel, `${nombre}.png`), 1920, {
    transparente: true,
  });
}
console.log("04-reel-inventario rótulos");

await navegador.close();
console.log("listo en", SALIDA);
