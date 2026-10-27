import LegalLayout from "@/components/LegalLayout";

export const metadata = {
  title: "Términos y condiciones del servicio",
  description:
    "Condiciones de cotización, contratación, pagos, entregas, soporte y propiedad intelectual de los servicios de desarrollo de Wilson Valencia.",
  alternates: { canonical: "/terminos" },
};

export default function TerminosPage() {
  return (
    <LegalLayout title="Términos y condiciones" updated="26 de octubre de 2026">
      <section>
        <h2>1. Quién presta el servicio</h2>
        <p>
          Wilson Valencia, desarrollador de software independiente con domicilio
          en Medellín, Colombia. Correo:{" "}
          <a href="mailto:wilson.arroyo12@gmail.com">wilson.arroyo12@gmail.com</a>.
          WhatsApp: +57 301 282 1174.
        </p>
        <p>
          Estos términos aplican a las cotizaciones, propuestas y servicios de
          diseño y desarrollo web, SaaS, e-commerce, aplicaciones móviles,
          integraciones y mantenimiento ofrecidos a través del sitio
          https://wvalencia-dev.vercel.app.
        </p>
      </section>

      <section>
        <h2>2. Cotizaciones y propuestas</h2>
        <ul>
          <li>
            Los precios publicados son valores <strong>base “desde”</strong> y
            sirven como referencia. No constituyen una oferta vinculante.
          </li>
          <li>
            El precio y el plazo definitivos se confirman en una propuesta
            escrita después de entender el alcance del proyecto.
          </li>
          <li>
            La propuesta tiene vigencia de 15 días calendario, salvo que se
            indique otra cosa.
          </li>
          <li>
            Cambios de alcance posteriores a la aceptación se cotizan por
            separado y pueden afectar el plazo.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Cómo se contrata</h2>
        <p>
          El proceso es: conversación inicial → propuesta escrita → aceptación
          del cliente → pago del anticipo acordado → inicio del trabajo. Mientras
          no exista aceptación escrita y anticipo, no hay compromiso de
          ejecución ni reserva de cupo.
        </p>
      </section>

      <section>
        <h2>4. Pagos</h2>
        <ul>
          <li>
            Los proyectos se pagan por hitos. Salvo acuerdo distinto, se solicita
            un anticipo para iniciar y el saldo contra entrega.
          </li>
          <li>
            Los precios pueden expresarse en pesos colombianos (COP) o dólares
            (USD). La moneda, el medio de pago y los impuestos aplicables se
            acuerdan en la propuesta.
          </li>
          <li>
            Los costos de pasarelas, hosting, dominios, licencias y servicios de
            terceros no están incluidos salvo que la propuesta lo indique.
          </li>
          <li>
            El trabajo adicional solicitado se factura según la tarifa acordada o
            se incorpora a un nuevo alcance.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Plazos y colaboración del cliente</h2>
        <p>
          Los plazos son estimaciones y dependen de la complejidad, de la
          disponibilidad de contenidos y de la rapidez con que el cliente responda
          dudas y apruebe entregas. Retrasos del cliente o de terceros pueden
          mover la fecha de entrega.
        </p>
        <p>
          El cliente se compromete a entregar oportunamente textos, imágenes,
          accesos, cuentas y validaciones necesarias, y a contar con los permisos
          para usarlos.
        </p>
      </section>

      <section>
        <h2>6. Revisiones y entregas</h2>
        <ul>
          <li>
            Cada entregable incluye hasta dos rondas de ajustes razonables dentro
            del alcance acordado.
          </li>
          <li>
            Se considera entregado cuando el cliente recibe el acceso o la
            publicación y no reporta fallas dentro de los 7 días siguientes.
          </li>
          <li>
            Los cambios que impliquen nuevas funcionalidades, rediseños o
            contenidos adicionales se cotizan aparte.
          </li>
        </ul>
      </section>

      <section>
        <h2>7. Soporte y mantenimiento</h2>
        <p>
          El soporte incluido depende del plan contratado (entre 1 y 6 meses) y
          cubre corrección de errores atribuibles al desarrollo entregado y
          ajustes menores. No cubre cambios de terceros, caídas de hosting,
          actualizaciones de plataformas externas, recuperación de datos
          eliminados por el cliente ni nuevas funcionalidades.
        </p>
        <p>
          El mantenimiento mensual es un servicio opcional y separado. Su alcance,
          horas incluidas y valor se acuerdan por escrito.
        </p>
      </section>

      <section>
        <h2>8. Propiedad intelectual</h2>
        <p>
          El código y los entregables desarrollados se transfieren al cliente una
          vez recibido el pago total, salvo que la propuesta indique otra cosa.
          Wilson conserva el derecho de reutilizar conocimientos, componentes
          genéricos y librerías de su autoría que no contengan información
          confidencial del cliente.
        </p>
        <p>
          Wilson puede incluir el proyecto en su portafolio y mostrar capturas o
          una descripción general, salvo que exista un acuerdo de confidencialidad
          o una solicitud expresa del cliente.
        </p>
      </section>

      <section>
        <h2>9. Integraciones de pago y servicios de terceros</h2>
        <p>
          Cuando el proyecto requiera pasarelas de pago, el cliente es responsable
          de la titularidad de la cuenta, del cumplimiento de los requisitos del
          proveedor y de la aprobación comercial. Wilson investiga, implementa y
          prueba la integración, pero no puede garantizar la aprobación de la
          cuenta ni el comportamiento de servicios externos.
        </p>
      </section>

      <section>
        <h2>10. Garantías y límites de responsabilidad</h2>
        <p>
          El servicio se presta con diligencia profesional. No se garantizan
          resultados comerciales, ventas, posicionamiento en buscadores ni
          disponibilidad ininterrumpida de servicios de terceros. La
          responsabilidad total se limita al valor efectivamente pagado por el
          servicio contratado, salvo dolo o culpa grave.
        </p>
      </section>

      <section>
        <h2>11. Cancelación</h2>
        <p>
          Cualquiera de las partes puede terminar el proyecto por escrito. Si el
          cliente cancela, se factura el trabajo ejecutado hasta la fecha y el
          anticipo no es reembolsable cuando ya se inició la ejecución, salvo
          acuerdo distinto. Si Wilson cancela sin causa imputable al cliente,
          devolverá la parte proporcional del anticipo no ejecutada.
        </p>
      </section>

      <section>
        <h2>12. Confidencialidad</h2>
        <p>
          La información técnica y comercial del proyecto se trata como
          confidencial. Las partes pueden firmar un acuerdo de confidencialidad
          específico cuando el proyecto lo requiera.
        </p>
      </section>

      <section>
        <h2>13. Ley aplicable</h2>
        <p>
          Estos términos se rigen por la ley colombiana. Cualquier controversia se
          resolverá inicialmente de buena fe y, si no es posible, ante los jueces
          competentes de Medellín, Colombia, sin perjuicio de los derechos que la
          ley reconozca al consumidor.
        </p>
      </section>

      <section>
        <h2>14. Cambios</h2>
        <p>
          Puedo actualizar estos términos para reflejar cambios en los servicios
          o en la ley. La versión aplicable a un proyecto es la aceptada al
          momento de contratar.
        </p>
      </section>
    </LegalLayout>
  );
}
