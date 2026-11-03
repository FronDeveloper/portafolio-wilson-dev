"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    icon: "🎯",
    title: "Entiendo tu problema",
    desc: "Antes de escribir una línea de código necesito entender tu negocio. Una llamada o conversación por WhatsApp es suficiente para mapear qué necesitas y qué resultado esperas.",
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
    desc: "Trabajo en entregas parciales para que puedas ver el avance desde el principio, dar feedback y ajustar sin esperar al final. Nada de sorpresas.",
    detail: "Actualizaciones regulares y demo en vivo.",
  },
  {
    number: "04",
    icon: "🚀",
    title: "Entrego y acompaño",
    desc: "El lanzamiento no es el final. Incluyo 30 días de soporte para corregir detalles, capacitarte y asegurar que todo funcione como esperabas.",
    detail: "30 días de soporte incluidos siempre.",
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
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          ¿Cómo{" "}
          <span className="bg-gradient-to-r from-acento to-acento bg-clip-text text-transparent">
            trabajo?
          </span>
        </h2>
        <p className="text-tinta-suave max-w-xl mx-auto text-sm">
          Un proceso simple y transparente para que sepas exactamente qué esperar en cada etapa.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-6 relative">
        {/* Línea conectora desktop */}
        <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-px bg-gradient-to-r from-acento/20 via-acento/30 to-acento/20" />

        {STEPS.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="flex flex-col items-center text-center group"
          >
            {/* Círculo */}
            <div className="w-20 h-20 rounded-full bg-fondo border-2 border-borde group-hover:border-acento transition-all duration-300 flex flex-col items-center justify-center mb-5 z-10 relative group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <span className="text-2xl">{step.icon}</span>
              <span className="text-[9px] font-bold text-acento tracking-widest mt-0.5">
                {step.number}
              </span>
            </div>

            <h3 className="font-bold text-tinta mb-2 text-sm leading-tight">
              {step.title}
            </h3>
            <p className="text-tinta-suave text-xs leading-relaxed mb-3">
              {step.desc}
            </p>
            <span className="text-[10px] text-acento font-semibold bg-acento/10 border border-acento/20 px-2.5 py-1 rounded-full">
              {step.detail}
            </span>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="text-center mt-14"
      >
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/cotizar"
            className="px-6 py-3 bg-gradient-to-r from-acento-hover to-acento-hover text-white rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-acento/20"
          >
            Iniciar un proyecto →
          </a>
          <a
            href="https://wa.me/573012821174?text=Hola%20Wilson%2C%20vi%20tu%20portafolio%20y%20me%20interesa%20hablar%20sobre%20un%20proyecto"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-borde rounded-xl font-semibold hover:border-acento hover:text-acento transition"
          >
            💬 WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  );
}