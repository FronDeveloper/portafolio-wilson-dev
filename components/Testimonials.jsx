"use client";

import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    name: "Pisarte Oficial",
    role: "Tienda online | En operación",
    content: "Wilson entregó la tienda en 5 días. El sistema de pagos funciona perfecto. Procesamos más de 50 pedidos el primer mes sin un solo error.",
    rating: 5,
    metric: "50+ pedidos sin errores",
  },
  {
    name: "Fundación FAEBO",
    role: "Sitio institucional | Cliente real",
    content: "Entendió nuestra misión social mejor que nosotros. El sitio generó confianza inmediata con los donantes. Comunicación clara y entregas puntuales.",
    rating: 5,
    metric: "100% satisfacción",
  },
  {
    name: "ARISE: Shadow System",
    role: "App móvil | 500+ descargas",
    content: "La app superó las 500 descargas en Play Store. El sistema de gamificación retiene usuarios. Wilson entendió la visión desde el primer día.",
    rating: 5,
    metric: "500+ descargas activas",
  },
];

export default function Testimonials() {
  return (
    <section className="px-8 md:px-20 py-20 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Resultados que <span className="text-[#C2B280]">hablan por sí solos</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          No me creas a mí. Cree en los resultados que mis proyectos han generado para negocios reales.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-[#111] p-6 rounded-xl border border-gray-800 hover:border-[#C2B280] transition"
          >
            <FaQuoteLeft className="text-[#C2B280] text-2xl mb-4 opacity-50" />
            
            <p className="text-gray-300 mb-4 leading-relaxed">
              {testimonial.content}
            </p>

            {/* Métrica destacada */}
            {testimonial.metric && (
              <div className="mb-4 inline-block bg-[#C2B280]/10 border border-[#C2B280]/30 px-3 py-1 rounded-full">
                <span className="text-[#C2B280] text-xs font-bold">{testimonial.metric}</span>
              </div>
            )}

            <div className="flex items-center gap-3 mb-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-sm ${
                      i < testimonial.rating
                        ? "text-yellow-500"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold text-white">{testimonial.name}</p>
              <p className="text-gray-500 text-sm">{testimonial.role}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-12 text-gray-500 text-sm"
      >
        ⭐ 100% de clientes recomiendan mi trabajo
      </motion.div>
    </section>
  );
}