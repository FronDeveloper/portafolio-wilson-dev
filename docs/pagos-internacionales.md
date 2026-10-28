# Cómo cobrar a clientes fuera de Colombia

> Decisión pendiente: elegir **un método principal** y **un respaldo**.
> Regla de oro: el cliente nunca debe tener que crear una cuenta para pagarte.

Las tarifas cambian seguido. Las cifras de abajo son de referencia (octubre 2026) y están
para comparar órdenes de magnitud, no para publicarlas. Confírmalas en la página de tarifas
de cada proveedor antes de cerrar un proyecto.

---

## El problema real

- Los precios internacionales están en USD ($300 landing, $800 e-commerce, $1.500 SaaS).
- Wilson cobra en Colombia: recibe en COP, a la TRM del día.
- No hay webhook: cada pago se confirma a mano (portal del proyecto → marcar pagado).
- El cliente extranjero promedio quiere **pagar con tarjeta** o **transferencia local**,
  no abrir otra cuenta.

Entonces el criterio no es solo la comisión: es **cuánta fricción tiene el cliente**.

---

## Comparación

| Método | Comisión al recibir | Costo de traer a Colombia | Fricción del cliente | Requisitos |
|---|---|---|---|---|
| **Wompi (link de pago)** | ~2,65% + $900 COP + IVA | Ninguno extra: liquida en COP | Baja: tarjeta Visa/Mastercard, incluso extranjera | Ya lo tienes |
| **Wise Business** | ~0,4–1% (transferencia) · más si paga con tarjeta | Conversión ~0,4–0,6% + retiro ~0,5% | Media: completa un checkout de Wise (no necesita cuenta) | Cuenta business + RUT + cámara de comercio |
| **Payoneer** | 1% transferencia / 3% tarjeta (Request a Payment) | Retiro a banco local ~1–2% | Media: paga desde su tarjeta o banco | Cuenta aprobada, RUT |
| **PayPal** | 3,49% + USD 0,49 local · **4,4% + fijo** transfronterizo (+1,5% si la tarjeta es de otro país) | Retiro en COP con margen cambiario ~3–4% | Muy baja: casi todos tienen PayPal | Cuenta verificada |
| **Mercado Pago (CO)** | ~3,3% + IVA | Liquida en COP | Baja | RUT, cuenta |
| **Lemon Squeezy / Paddle** | 5% + USD 0,50 | Payout vía PayPal/Wise | Baja | Producto digital; suelen rechazar servicios |
| **Stripe** | 2,9% + USD 0,30 | Requiere mover el dinero igual (Wise) | Muy baja | **No disponible para empresas colombianas**: exige entidad en EE. UU. (LLC + EIN + ~USD 500/año) |

### Lo que cuesta cada opción en un proyecto de USD 800

| Método | Comisión aprox. | Te quedan (antes de impuestos) |
|---|---|---|
| Wompi con tarjeta internacional | USD 25–30 | ~USD 770 |
| Wise (transferencia) | USD 10–16 | ~USD 784 |
| Payoneer (tarjeta) | USD 32–40 | ~USD 760 |
| PayPal | USD 48–54 | ~USD 746 |

> Stripe **no** se justifica hoy: montar una LLC cuesta más que la comisión que ahorra, y
> seguimos necesitando Wise para traer el dinero. Se reevalúa si facturas más de
> USD 5.000/mes al exterior de forma recurrente.

---

## Recomendación

**Principal: Wise Business.** Es el más barato para tickets de USD 300–1.500, el cliente paga
sin crear cuenta (enlace de pago con tarjeta o transferencia) y la tasa de cambio es la real,
no la del banco. Además puedes emitir la factura desde Wise con tu marca.

**Respaldo: link de Wompi.** Ya está montado, acepta tarjetas internacionales y liquida en COP
sin trámites nuevos. Es la salida cuando el cliente dice "mándame un link y pago con tarjeta".
Cuesta más, pero convierte. Regla: **si el cliente duda, se le manda Wompi y se cobra el
costo como costo de adquisición.**

**PayPal: solo si el cliente lo exige.** Es el más caro (≈6%) y el retiro a Colombia pierde
otro 3–4%. Si un cliente solo usa PayPal, se le cotiza con un 6% adicional incluido, no se
absorbe.

---

## Flujo operativo (hoy, sin webhook)

1. Se envía la propuesta con el precio en USD y la nota: *"Pago 50% para iniciar, 50% contra
   entrega. Acepto transferencia local, Wompi o Wise."*
2. El cliente elige. Se le manda el link (Wompi desde el panel, Wise desde la app).
3. Cuando llega el dinero, Wilson entra al portal del proyecto y marca el pago como recibido.
4. Se guarda el comprobante (PDF de Wise / correo de Wompi) junto a la factura.

**Pendiente para automatizar:** webhook de Wompi (firma de integridad + evento
`transaction.updated`) para marcar el pago solo. Wise no tiene webhook útil para esto, así que
Wise seguirá siendo manual.

---

## Reglas de precio y contabilidad

- **Colchón cambiario:** cotizar en USD con un 3–4% incluido. La TRM se mueve entre la
  cotización y el pago, y esa diferencia no se le cobra al cliente después.
- **Factura:** se emite en COP a la TRM del día del pago (no la del día de la cotización).
  Guardar el comprobante de la plataforma: es el soporte del ingreso.
- **Impuestos:** todo lo que entra por Wise, Payoneer o PayPal es ingreso gravable en Colombia.
  No es "dinero que no se ve": se declara igual que Wompi.
- **4x1000:** aplica al pasar de Wise/Payoneer a la cuenta bancaria. Sale de la utilidad, no se
  le suma al cliente.

---

## Qué falta decidir

- [ ] Abrir Wise Business (o confirmar que ya existe) y hacer una prueba real de USD 5 para
      medir la comisión exacta y el tiempo de llegada.
- [ ] Decidir si el link de Wompi se usa como respaldo universal o solo cuando el cliente lo pide.
- [ ] Definir el texto exacto de la cláusula de pago en la propuesta (hoy: 50/50, transferencia
      local o Wompi).
