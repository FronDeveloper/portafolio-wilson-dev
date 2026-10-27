import LegalLayout from "@/components/LegalLayout";
import { ConsentReset } from "@/components/ConsentReset";

export const metadata = {
  title: "Política de privacidad y tratamiento de datos",
  description:
    "Cómo Wilson Valencia recolecta, usa y protege tus datos personales, y cómo ejercer tus derechos conforme a la Ley 1581 de 2012 de Colombia.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <LegalLayout title="Política de privacidad" updated="26 de octubre de 2026">
      <section>
        <h2>1. Responsable del tratamiento</h2>
        <p>
          Wilson Valencia, desarrollador de software independiente con domicilio
          en Medellín, Colombia. Correo:{" "}
          <a href="mailto:wilson.arroyo12@gmail.com">wilson.arroyo12@gmail.com</a>.
          WhatsApp: +57 301 282 1174.
        </p>
        <p>
          Esta política aplica al sitio https://wvalencia-dev.vercel.app, al
          asistente virtual Alma y a los formularios de cotización y propuestas.
        </p>
      </section>

      <section>
        <h2>2. Qué datos recolecto</h2>
        <ul>
          <li>
            <strong>Datos de contacto:</strong> nombre, correo electrónico y
            WhatsApp que escribes en los formularios o en el chat.
          </li>
          <li>
            <strong>Datos del proyecto:</strong> descripción de tu necesidad,
            tipo de proyecto, presupuesto aproximado y cualquier detalle que
            decidas compartir.
          </li>
          <li>
            <strong>Conversaciones con Alma:</strong> los mensajes que escribes en
            el chat. Se guardan en el almacenamiento local de tu navegador y, si
            dejas tu contacto, se envían por correo a Wilson junto con el aviso
            del lead.
          </li>
          <li>
            <strong>Datos técnicos:</strong> dirección IP, tipo de dispositivo y
            navegador, páginas visitadas y parámetros de campaña (UTM), usados
            para seguridad y para saber de dónde llegan las solicitudes.
          </li>
        </ul>
        <p>
          No solicito datos sensibles (salud, biometría, origen étnico,
          convicciones políticas o religiosas, datos financieros completos). No
          pido contraseñas ni claves de acceso de tus plataformas.
        </p>
      </section>

      <section>
        <h2>3. Para qué los uso</h2>
        <ul>
          <li>Responder tu solicitud y preparar una propuesta comercial.</li>
          <li>Comunicarme contigo por correo o WhatsApp sobre el proyecto.</li>
          <li>Ejecutar, facturar y dar soporte a los servicios contratados.</li>
          <li>Mejorar el contenido y la experiencia del sitio.</li>
          <li>Prevenir abuso, spam y accesos no autorizados.</li>
        </ul>
        <p>
          No vendo tus datos ni los uso para enviarte publicidad de terceros.
        </p>
      </section>

      <section>
        <h2>4. Base legal y autorización</h2>
        <p>
          Trato tus datos con tu autorización previa, expresa e informada, que
          otorgas al marcar la casilla de consentimiento en los formularios o al
          dejar tu contacto en el chat. También puedo tratarlos para cumplir
          obligaciones legales o contractuales cuando corresponda, conforme a la
          Ley 1581 de 2012 y al Decreto 1377 de 2013 de Colombia.
        </p>
      </section>

      <section>
        <h2>5. Con quién se comparten</h2>
        <p>
          Para operar el sitio uso proveedores que actúan como encargados del
          tratamiento o responsables independientes:
        </p>
        <ul>
          <li>
            <strong>Vercel:</strong> alojamiento y registros técnicos del sitio.
          </li>
          <li>
            <strong>Resend:</strong> envío de correos de notificación de leads y
            propuestas.
          </li>
          <li>
            <strong>Groq y OpenRouter:</strong> proveedores de modelos de
            inteligencia artificial que procesan los mensajes para generar las
            respuestas de Alma. No se les envían datos de pago.
          </li>
          <li>
            <strong>Google Analytics y Meta:</strong> analítica y medición de
            campañas, únicamente si aceptas las cookies analíticas.
          </li>
        </ul>
        <p>
          Algunos de estos proveedores pueden almacenar datos fuera de Colombia.
          En esos casos se aplican sus políticas y salvaguardas contractuales.
          También puedo revelar información si una autoridad competente lo
          exige.
        </p>
      </section>

      <section>
        <h2>6. Cuánto tiempo los conservo</h2>
        <ul>
          <li>
            <strong>Solicitudes y leads:</strong> hasta 2 años desde el último
            contacto, salvo que pidas eliminarlos antes.
          </li>
          <li>
            <strong>Conversación del chat en tu navegador:</strong> 7 días o
            hasta que la borres con el botón de la papelera.
          </li>
          <li>
            <strong>Datos de analítica:</strong> según la configuración de Google
            Analytics y Meta (normalmente hasta 14 meses).
          </li>
          <li>
            <strong>Información contractual y contable:</strong> el tiempo que
            exija la ley colombiana.
          </li>
        </ul>
      </section>

      <section id="cookies">
        <h2>7. Cookies y almacenamiento local</h2>
        <p>
          El sitio usa almacenamiento técnico necesario para recordar tu
          conversación con Alma, tu preferencia de cookies y los parámetros de
          campaña. Esto no te identifica personalmente.
        </p>
        <p>
          La analítica (Google Analytics y Meta Pixel) está desactivada por
          defecto y solo se carga si pulsas “Aceptar analítica”. Puedes cambiar
          tu decisión en cualquier momento:
        </p>
        <ConsentReset />
        <p>
          También puedes borrar las cookies y el almacenamiento local desde la
          configuración de tu navegador.
        </p>
      </section>

      <section>
        <h2>8. Tus derechos</h2>
        <p>
          Como titular de los datos puedes conocer, actualizar, rectificar y
          suprimir tu información, revocar la autorización y presentar quejas
          ante la Superintendencia de Industria y Comercio (SIC).
        </p>
        <p>
          Para ejercerlos escríbeme a{" "}
          <a href="mailto:wilson.arroyo12@gmail.com">
            wilson.arroyo12@gmail.com
          </a>{" "}
          con el asunto “Derechos de datos”, indicando tu nombre y el derecho que
          deseas ejercer. Responderé en los términos legales aplicables.
        </p>
      </section>

      <section>
        <h2>9. Seguridad</h2>
        <p>
          Aplico medidas razonables de seguridad técnica y organizativa para
          proteger la información. Ningún sistema es infalible: si detecto un
          incidente que afecte tus datos, te informaré y tomaré las medidas
          necesarias.
        </p>
      </section>

      <section>
        <h2>10. Menores de edad</h2>
        <p>
          El sitio está dirigido a personas mayores de 18 años con capacidad para
          contratar. No recolecto conscientemente datos de menores.
        </p>
      </section>

      <section>
        <h2>11. Cambios a esta política</h2>
        <p>
          Puedo actualizar esta política para reflejar cambios en el sitio o en
          la ley. La versión vigente es la publicada en esta página, con su fecha
          de actualización.
        </p>
      </section>
    </LegalLayout>
  );
}
