"use client";

import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    name: "Pisarte Oficial",
    role: "Ecommerce propio | En operación",
    content: "Tienda online funcionando con productos reales y pagos integrados. Más de 50 pedidos procesados sin errores.",
    rating: 5,
  },
  {
    name: "Fundación FAEBO",
    role: "Proyecto real | Cliente satisfecho",
    content: "Wilson entendió nuestras necesidades y creó un sitio que refleja fielmente nuestra misión social.",
    rating: 5,
  },
  {
    name: "App RPG Fitness",
    role: "Proyecto en desarrollo | Beta cerrada",
    content: "Los beta testers reportan alta motivación gracias al sistema de gamificación por niveles y recompensas.",
    rating: 4,
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
          Lo que dicen <span className="text-[#C2B280]">mis clientes</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          No solo construyo código, construyo relaciones basadas en confianza y resultados.
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