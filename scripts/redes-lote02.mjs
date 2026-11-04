/**
 * Genera las piezas del lote 2 de redes: chatbots con IA para WhatsApp.
 *
 *   node scripts/redes-lote02.mjs
 *
 * Salida:
 *   docs/redes/lote-02/01-por-que-falla/01..07.png   carrusel 4:5
 *   docs/redes/lote-02/02-menu-o-ia/01..07.png       carrusel 4:5
 *   docs/redes/lote-02/03-caso-bot/01..08.png        carrusel 4:5 con capturas
 *   docs/redes/lote-02/04-reel-handoff/*.png         portada + frames 9:16
 *
 * El tema (fuentes, paleta, plantillas y render) vive en scripts/lib/redes-tema.mjs.
 * Las capturas de _fuentes/ son reales: salen de la demo VentaChat AI corriendo
 * en local, con los teléfonos tapados. La tienda NovaCell es ficticia.
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";
import {
  RAIZ,
  slide,
  marca,
  render,
  cerrarNavegador,
  imagenBase64,
} from "./lib/redes-tema.mjs";

const SALIDA = path.join(RAIZ, "docs/redes/lote-02");
const FUENTES = path.join(SALIDA, "_fuentes");

const chatIA = await imagenBase64(path.join(FUENTES, "chat-ia.png"));
const chatHumano = await imagenBase64(path.join(FUENTES, "chat-humano.png"));
const panelChat = await imagenBase64(path.join(FUENTES, "panel-chat.png"));

const PIE_DESLIZA = `<span class="desliza">Desliza <span class="flecha">→</span></span><span>indexxel.com</span>`;

/** Caja de comparación para las láminas de ejemplo. */
const caja = (etiqueta, texto, color = "#4D94F0") => `
  <div style="background:#fff; border:1px solid #D8E1EC; border-left:6px solid ${color};
    border-radius:14px; padding:20px 26px; font-size:30px; line-height:1.38; color:#52657E">
    <strong style="color:#0F294E; font-weight:600">${etiqueta}</strong> · ${texto}
  </div>`;

// ── Carrusel 1: por qué contesta mal ─────────────────────────────────────────

const carrusel1 = {
  carpeta: "01-por-que-falla",
  total: 7,
  slides: [
    slide({
      tema: "oscuro",
      indice: 1,
      total: 7,
      contenido: `<p class="kicker">Chatbots con IA</p>
        <div class="regla"></div>
        <h1 class="titular">Tu chatbot no responde mal. Está mal alimentado.</h1>
        <p class="bajada">La IA no adivina: repite lo que le enseñaron. Y cuando no sabe, improvisa con seguridad.</p>`,
      pie: PIE_DESLIZA,
    }),
    slide({
      indice: 2,
      total: 7,
      contenido: `<p class="etiqueta">El origen</p>
        <div class="numero">01</div>
        <h2 class="titulo">La IA no sabe de tu negocio. Solo sabe lo que le diste.</h2>
        <p class="cuerpo">Un modelo como ChatGPT conoce el mundo, pero no tu catálogo, tus horarios ni tu forma de cobrar. Si esa información no está cargada, la completa con lo que le parece.</p>`,
    }),
    slide({
      indice: 3,
      total: 7,
      contenido: `<p class="etiqueta">El origen</p>
        <div class="numero">02</div>
        <h2 class="titulo">Le diste el catálogo. No le diste las reglas.</h2>
        <p class="cuerpo">Qué se puede prometer, qué no, hasta dónde dar descuento, cuándo pedir el número o la dirección. Sin reglas escritas, el bot decide por ti — y no siempre decide bien.</p>`,
    }),
    slide({
      indice: 4,
      total: 7,
      contenido: `<p class="etiqueta">El origen</p>
        <div class="numero">03</div>
        <h2 class="titulo" style="font-size:56px">No distingue un dato de una suposición.</h2>
        <div style="display:flex; flex-direction:column; gap:14px; margin-top:28px">
          ${caja("Cliente", "«¿el iPhone 12 tiene garantía?»", "#52657E")}
          ${caja("Bot mal alimentado", "«Sí, un año. Cubre daños accidentales»", "#C2410C")}
          ${caja("Realidad", "6 meses. No cubre daños.", "#1D4ED8")}
        </div>
        <p class="cuerpo" style="margin-top:26px; font-size:32px">Si esa ficha no está cargada, la IA rellena el hueco. Con seguridad. Y con mentiras.</p>`,
    }),
    slide({
      indice: 5,
      total: 7,
      contenido: `<p class="etiqueta">El origen</p>
        <div class="numero">04</div>
        <h2 class="titulo">Tampoco sabe cuándo callarse.</h2>
        <p class="cuerpo">Insiste con el menú, da vueltas o inventa una solución cuando el cliente ya está molesto. Un bot sin salida a una persona quema la conversación que ibas a ganar.</p>`,
    }),
    slide({
      indice: 6,
      total: 7,
      contenido: `<p class="etiqueta">El origen</p>
        <div class="numero">05</div>
        <h2 class="titulo">Y no recuerda lo que ya le dijeron.</h2>
        <p class="cuerpo">Pregunta tres veces lo mismo. El cliente repite, se cansa y se va. La memoria no es un lujo: es parte de la atención.</p>`,
    }),
    slide({
      tema: "oscuro",
      indice: 7,
      total: 7,
      contenido: `<p class="kicker">Lo que sí funciona</p>
        <div class="regla"></div>
        <h2 class="titular" style="font-size:80px">Un bot bueno no es el que más habla. Es el que tiene la información correcta.</h2>
        <p class="bajada">Antes de automatizar, hay que ordenar el catálogo, las reglas y las excepciones. Eso es la mayor parte del trabajo.</p>
        <div class="boton">Escríbeme «BOT» <span>→</span></div>
        <p class="nota">Te digo qué datos necesita tu negocio antes de automatizar nada. Sin costo.</p>`,
    }),
  ],
};

// ── Carrusel 2: menú, IA o híbrido ───────────────────────────────────────────

const carrusel2 = {
  carpeta: "02-menu-o-ia",
  total: 7,
  slides: [
    slide({
      tema: "oscuro",
      indice: 1,
      total: 7,
      contenido: `<p class="kicker">Menú · IA · Híbrido</p>
        <div class="regla"></div>
        <h1 class="titular">¿Menú de botones o IA? La respuesta es las dos.</h1>
        <p class="bajada">Cada una resuelve una parte distinta de la conversación. Elegir solo una es lo que hace que el bot se sienta tonto.</p>`,
      pie: PIE_DESLIZA,
    }),
    slide({
      indice: 2,
      total: 7,
      contenido: `<p class="etiqueta">Opción 1</p>
        <div class="numero">A</div>
        <h2 class="titulo" style="font-size:56px">Menú de botones: rápido, barato y predecible.</h2>
        <p class="cuerpo">Sirve para lo que siempre se pregunta igual: horario, ubicación, estado del pedido. No inventa nada. Pero si el cliente escribe «hola, necesito saber si me arreglan el celular», el menú no entiende.</p>`,
    }),
    slide({
      indice: 3,
      total: 7,
      contenido: `<p class="etiqueta">Opción 2</p>
        <div class="numero">B</div>
        <h2 class="titulo" style="font-size:56px">IA: entiende la frase, no siempre el negocio.</h2>
        <p class="cuerpo">Responde en lenguaje natural y aguanta preguntas raras. Sin límites ni datos, contesta con seguridad cosas que no son ciertas. La IA no tiene miedo a equivocarse.</p>`,
    }),
    slide({
      indice: 4,
      total: 7,
      contenido: `<p class="etiqueta">Lo que hago</p>
        <div class="numero">A+B</div>
        <h2 class="titulo" style="font-size:58px">Híbrido: menú para lo repetido, IA para lo demás.</h2>
        <p class="cuerpo">El bot abre con opciones claras. Si el cliente se sale del guion, la IA responde con tu información. Si la IA no sabe, deriva a una persona. Cada pieza hace lo que sabe hacer.</p>`,
    }),
    slide({
      indice: 5,
      total: 7,
      contenido: `<p class="etiqueta">En la práctica</p>
        <h2 class="titulo" style="font-size:54px">Así se siente una conversación híbrida.</h2>
        <div class="lista" style="margin-top:30px">
          <div class="fila"><span class="punto"></span><p><strong>«1» para horarios</strong> → menú de botones. Cero riesgo.</p></div>
          <div class="fila"><span class="punto"></span><p><strong>«¿Tienen iPhone 12 con garantía?»</strong> → IA con tu ficha de producto.</p></div>
          <div class="fila"><span class="punto"></span><p><strong>«Prefiero hablar con alguien»</strong> → derivación inmediata.</p></div>
          <div class="fila"><span class="punto"></span><p><strong>«No entiendo»</strong> → vuelve al menú, sin repetir todo.</p></div>
        </div>`,
    }),
    slide({
      indice: 6,
      total: 7,
      contenido: `<p class="etiqueta">Requisitos</p>
        <h2 class="titulo" style="font-size:54px">Lo que necesitas para que funcione.</h2>
        <div class="lista" style="margin-top:30px">
          <div class="fila"><span class="punto"></span><p>Catálogo y precios reales, no de memoria.</p></div>
          <div class="fila"><span class="punto"></span><p>Reglas de qué se puede prometer y qué no.</p></div>
          <div class="fila"><span class="punto"></span><p>Tono, nombre del negocio y horarios.</p></div>
          <div class="fila"><span class="punto"></span><p>Una salida a humano, siempre visible.</p></div>
          <div class="fila"><span class="punto"></span><p>Alguien que revise las conversaciones cada semana.</p></div>
        </div>`,
    }),
    slide({
      tema: "oscuro",
      indice: 7,
      total: 7,
      contenido: `<p class="kicker">La decisión</p>
        <div class="regla"></div>
        <h2 class="titular" style="font-size:78px">No es elegir entre menú e IA. Es decidir qué automatizas primero.</h2>
        <p class="bajada">Casi siempre se empieza por las preguntas que más se repiten. Lo demás se agrega cuando el bot ya responde bien.</p>
        <div class="boton">Escríbeme «BOT» <span>→</span></div>
        <p class="nota">Te armo el flujo en una llamada de 15 minutos. Sin costo.</p>`,
    }),
  ],
};

// ── Carrusel 3: caso de la demo VentaChat AI ─────────────────────────────────

const carrusel3 = {
  carpeta: "03-caso-bot",
  total: 8,
  slides: [
    slide({
      tema: "oscuro",
      indice: 1,
      total: 8,
      contenido: `<p class="kicker">Demo · Chatbot con IA</p>
        <div class="regla"></div>
        <h1 class="titular">Así responde un bot cuando sí está alimentado.</h1>
        <p class="bajada">Pregunta real, respuesta real. La conversación de abajo la acabo de tener con la demo que construí.</p>`,
      pie: PIE_DESLIZA,
    }),
    slide({
      indice: 2,
      total: 8,
      contenido: `<p class="etiqueta">Antes de seguir</p>
        <h2 class="titulo" style="font-size:56px">Esto es una demo, no un cliente.</h2>
        <p class="cuerpo">VentaChat AI es un producto que construí para mostrar el tipo de bot que adapto a cada negocio. La tienda NovaCell es ficticia. Los datos son de ejemplo; el sistema es real. Prefiero decirlo antes de que alguien lo pregunte.</p>`,
    }),
    slide({
      indice: 3,
      total: 8,
      posicion: "arriba",
      contenido: `<p class="etiqueta" style="text-align:center">Pregunta real</p>
        <div style="display:flex; justify-content:center; margin-top:6px">
          <div class="telefono" style="width:520px; margin:0">
            <img src="${chatIA}" alt="Conversación de WhatsApp: el cliente pregunta por la garantía de un iPhone 12 y el bot responde con la ficha del producto" />
          </div>
        </div>
        <p class="nota-oscura" style="text-align:center; margin-top:18px">«¿Y si me falla a los dos meses?» → responde con la garantía real y aclara que está fuera de horario.</p>`,
    }),
    slide({
      indice: 4,
      total: 8,
      contenido: `<p class="etiqueta">Lo que tuvo que saber</p>
        <div class="numero">4</div>
        <h2 class="titulo" style="font-size:52px">Para responder así no hizo falta magia. Hizo falta información.</h2>
        <div class="lista" style="margin-top:26px">
          <div class="fila"><span class="punto"></span><p>Ficha del producto: modelo, condición y garantía de 6 meses.</p></div>
          <div class="fila"><span class="punto"></span><p>Horario de atención y qué responder fuera de horario.</p></div>
          <div class="fila"><span class="punto"></span><p>Qué no puede prometer: reparaciones gratis ni plazos que no existen.</p></div>
          <div class="fila"><span class="punto"></span><p>Cuándo pasar a una persona y cómo avisarle al dueño.</p></div>
        </div>`,
    }),
    slide({
      indice: 5,
      total: 8,
      posicion: "arriba",
      contenido: `<p class="etiqueta" style="text-align:center">Derivación</p>
        <div style="display:flex; justify-content:center; margin-top:6px">
          <div class="telefono" style="width:520px; margin:0">
            <img src="${chatHumano}" alt="Conversación de WhatsApp: el cliente pide hablar con una persona y el bot pausa el asistente para que atienda el dueño" />
          </div>
        </div>
        <p class="nota-oscura" style="text-align:center; margin-top:18px">«Prefiero hablar con una persona» → el bot no insiste: avisa, se pausa y deja el chat listo para el dueño.</p>`,
    }),
    slide({
      indice: 6,
      total: 8,
      contenido: `<p class="etiqueta">El registro</p>
        <h2 class="titulo" style="font-size:54px">Todo queda registrado.</h2>
        <p class="cuerpo" style="margin-top:16px; font-size:33px">Quién escribió, qué preguntó, qué respondió la IA y cuándo se derivó. Sin ese registro no se puede mejorar.</p>
        <div class="imagen-marco" style="width:660px; margin:22px auto 0; flex:none">
          <img src="${panelChat}" alt="Panel de VentaChat AI: conversación con etiquetas de respuesta por IA y derivación a humano" />
        </div>`,
    }),
    slide({
      indice: 7,
      total: 8,
      contenido: `<p class="etiqueta">Lo que cambia</p>
        <h2 class="titulo" style="font-size:54px">El WhatsApp deja de depender de una sola persona.</h2>
        <p class="cuerpo" style="margin-top:20px; font-size:34px">No se trata de reemplazar al dueño. Se trata de que el bot resuelva lo repetido y le pase solo lo que necesita criterio.</p>
        <div class="chips">
          <span class="chip">Atiende fuera de horario sin inventar</span>
          <span class="chip">El dueño recibe solo lo que importa</span>
          <span class="chip">Cada chat deja un dato para mejorar</span>
        </div>`,
    }),
    slide({
      tema: "oscuro",
      indice: 8,
      total: 8,
      contenido: `<p class="kicker">Tu negocio</p>
        <div class="regla"></div>
        <h2 class="titular" style="font-size:74px">Si tu WhatsApp recibe las mismas preguntas todos los días, se puede automatizar sin perder el trato humano.</h2>
        <div class="boton">Escríbeme «DEMO» <span>→</span></div>
        <p class="nota">Te muestro esta demo y te digo qué adaptaría a tu negocio. Sin costo.</p>`,
    }),
  ],
};

// ── Reel: el bot que sabe callarse ───────────────────────────────────────────

const marcoReel = (contenido, { tema = "oscuro", folio = "CHATBOT" } = {}) => {
  const oscuro = tema === "oscuro";
  return `<div class="slide ${tema}" style="height:1920px; padding:120px 92px 100px">
    <div class="barra"><span style="width:100%"></span></div>
    <header>${marca(oscuro)}<span class="folio">${folio}</span></header>
    <main style="justify-content:center">${contenido}</main>
    <footer><span>indexxel.com</span><span>@indexxel</span></footer>
  </div>`;
};

const portada = marcoReel(`
  <p class="kicker">Demo · WhatsApp con IA</p>
  <div class="regla"></div>
  <h1 class="titular" style="font-size:112px; line-height:1.03">El bot que sabe callarse.</h1>
  <p class="bajada" style="font-size:44px; max-width:860px">Responde con tu información. Y cuando no sabe, pasa a una persona. Eso es lo difícil.</p>`);

const frameGancho = marcoReel(`
  <p class="kicker">El problema</p>
  <div class="regla"></div>
  <h1 class="titular" style="font-size:104px; line-height:1.04">Un bot que responde todo… es un problema.</h1>
  <p class="bajada" style="font-size:42px">Contestar por contestar quema la conversación. Y el cliente no vuelve.</p>`);

const frameDatos = marcoReel(
  `
  <p class="etiqueta" style="text-align:center">Respuesta real</p>
  <h2 class="titulo" style="text-align:center; font-size:46px; margin-top:12px">«¿Y si me falla a los dos meses?»</h2>
  <div style="display:flex; justify-content:center; margin-top:24px">
    <div class="telefono" style="width:600px; margin:0">
      <img src="${chatIA}" alt="Chat real de la demo: pregunta por la garantía de un iPhone 12 y respuesta con la ficha del producto" />
    </div>
  </div>
  <p class="nota-oscura" style="text-align:center; margin-top:26px; font-size:32px">Respondió con la garantía real y el horario. Sin inventar.</p>`,
  { tema: "claro" }
);

const frameLimite = marcoReel(`
  <p class="kicker">El límite</p>
  <div class="regla"></div>
  <h1 class="titular" style="font-size:106px; line-height:1.04">Pero un bot no puede resolverlo todo.</h1>
  <p class="bajada" style="font-size:44px">Y está bien. Fingir que sí es peor que decir «te paso con una persona».</p>`);

const frameHumano = marcoReel(
  `
  <p class="etiqueta" style="text-align:center">Derivación</p>
  <h2 class="titulo" style="text-align:center; font-size:44px; margin-top:12px">«Prefiero hablar con una persona.»</h2>
  <div style="display:flex; justify-content:center; margin-top:24px">
    <div class="telefono" style="width:600px; margin:0">
      <img src="${chatHumano}" alt="Chat real de la demo: el bot avisa que pasa con un asesor humano y queda pausado" />
    </div>
  </div>
  <p class="nota-oscura" style="text-align:center; margin-top:26px; font-size:32px">El bot avisa, se pausa y deja el chat listo para el dueño.</p>`,
  { tema: "claro" }
);

const frameRegistro = marcoReel(`
  <p class="kicker">El registro</p>
  <div class="regla"></div>
  <h1 class="titular" style="font-size:88px; line-height:1.05">Todo queda registrado.</h1>
  <p class="bajada" style="font-size:38px">Qué preguntó, qué respondió la IA y cuándo se derivó. Sin eso no se puede mejorar.</p>
  <div class="imagen-marco" style="width:720px; margin:34px auto 0">
    <img src="${panelChat}" alt="Panel de la demo con la conversación completa y las etiquetas de IA y derivación" />
  </div>`);

const frameCierre = marcoReel(`
  <p class="kicker">Tu negocio</p>
  <div class="regla"></div>
  <h1 class="titular" style="font-size:96px; line-height:1.05">¿Automatizamos tu WhatsApp?</h1>
  <p class="bajada" style="font-size:42px">Empiezo por las preguntas que más te repiten. Lo demás se agrega cuando el bot ya responde bien.</p>
  <div class="boton">Escríbeme «BOT» <span>→</span></div>
  <p class="nota">indexxel.com · Respuesta en menos de 24 horas.</p>`);

// ── Render ───────────────────────────────────────────────────────────────────

for (const carrusel of [carrusel1, carrusel2, carrusel3]) {
  const carpeta = path.join(SALIDA, carrusel.carpeta);
  await mkdir(carpeta, { recursive: true });
  for (const [i, html] of carrusel.slides.entries()) {
    await render(html, path.join(carpeta, `${String(i + 1).padStart(2, "0")}.png`), 1350);
  }
  console.log(carrusel.carpeta, carrusel.slides.length, "láminas");
}

const carpetaReel = path.join(SALIDA, "04-reel-handoff");
await mkdir(carpetaReel, { recursive: true });
for (const [nombre, html] of [
  ["portada", portada],
  ["frame-01-gancho", frameGancho],
  ["frame-02-datos", frameDatos],
  ["frame-03-limite", frameLimite],
  ["frame-04-humano", frameHumano],
  ["frame-05-registro", frameRegistro],
  ["frame-06-cierre", frameCierre],
]) {
  await render(html, path.join(carpetaReel, `${nombre}.png`), 1920);
}
console.log("04-reel-handoff portada + 6 frames");

await cerrarNavegador();
console.log("listo en", SALIDA);
