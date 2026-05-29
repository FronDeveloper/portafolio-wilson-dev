"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    icon: "🎯",
    title: "Entiendo tu problema",
    desc: "Antes de escribir una línea de código necesito entender tu negocio. Una llamada o conversación por WhatsApp es suficiente para mapear qué necesitas, qué tienes y qué resultado esperas.",
    detail: "Sin formularios largos ni reuniones interminables.",
  },
  {
    number: "02",
    icon: "💡",
    title: "Propongo la solución",
    desc: "Te presento una propuesta clara con alcance, tecnología, tiempo estimado y precio. Sin letra pequeña. Si algo no cuadra lo ajustamos antes de empezar.",
    detail: "Cotización sin compromiso en menos de 24h.",
  },
  {
    number: "03",
    icon: "⚙️",
    title: "Construyo con visibilidad",
    desc: "Trabajo en entregas parciales para que puedas ver el avance desde el principio, dar feedback y ajustar sin esperar al final. Nada de sorpresas al entregar.",
    detail: "Actualizaciones regulares y acceso al demo en vivo.",
  },
  {
    number: "04",
    icon: "🚀",
    title: "Entrego y acompaño",
    desc: "El lanzamiento no es el final. Incluyo 30 días de soporte post-entrega para corregir cualquier detalle, capacitarte y asegurar que todo funcione como esperabas.",
    detail: "30 días de soporte incluidos en todos los proyectos.",
  },
];

export default function HowIWork() {
  return (
    <section className="px-8 md:px-20 py-20 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">
          ¿Cómo <span className="text-[#C2B280]">trabajo?</span>
        </h2>
        <p className="text-gray-400 text-center mb-14 max-w-xl mx-auto">
          Un proceso simple y transparente para que sepas exactamente qué esperar en cada etapa.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="relative">
        {/* Línea conectora — solo desktop */}
        <div className="hidden md:block absolute top-10 left-[calc(12.5%-1px)] right-[calc(12.5%-1px)] h-px bg-gradient-to-r from-transparent via-[#C2B280]/30 to-transparent" />

        <div className="grid md:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Circle number */}
              <div className="w-20 h-20 rounded-full bg-[#111] border-2 border-gray-800 group-hover:border-[#C2B280] transition-colors flex flex-col items-center justify-center mb-5 z-10 relative">
                <span className="text-2xl">{step.icon}</span>
                <span className="text-[9px] font-bold text-[#C2B280] tracking-widest mt-0.5">
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <h3 className="font-bold text-white mb-2 text-sm leading-tight">
                {step.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-3">
                {step.desc}
              </p>
              <span className="text-[10px] text-[#C2B280] font-semibold bg-[#C2B280]/10 border border-[#C2B280]/20 px-2.5 py-1 rounded-full">
                {step.detail}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="text-center mt-14"
      >
        <p className="text-gray-400 mb-5 text-sm">
          ¿Listo para arrancar? Cuéntame qué necesitas.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/contact"
            className="px-6 py-3 bg-[#C2B280] text-black rounded-xl font-semibold hover:opacity-80 transition"
          >
            Iniciar un proyecto →
          </a>
          <a
            href="https://wa.me/573012821174?text=Hola%20Wilson%2C%20vi%20tu%20portafolio%20y%20me%20interesa%20hablar%20sobre%20un%20proyecto"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-gray-700 rounded-xl font-semibold hover:border-[#C2B280] hover:text-[#C2B280] transition"
          >
            💬 Escribir por WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  );
}