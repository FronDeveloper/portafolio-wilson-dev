"use client";

import { motion } from "framer-motion";
import { FaCheckCircle, FaRocket, FaStore, FaCogs } from "react-icons/fa";
import Link from "next/link";

const plans = [
  {
    name: "Landing Page",
    icon: <FaRocket className="text-3xl" />,
    price: "desde $1.200.000 COP",
    description: "Ideal para empezar tu presencia online",
    features: [
      "Diseño responsive",
      "Hasta 5 secciones",
      "Formulario de contacto",
      "Optimización SEO básica",
      "Entrega en 5-7 días",
      "1 mes de soporte gratuito",
    ],
    recommended: false,
  },
  {
    name: "Ecommerce",
    icon: <FaStore className="text-3xl" />,
    price: "desde $3.200.000 COP",
    description: "Vende tus productos online sin complicaciones",
    features: [
      "Catálogo de productos",
      "Carrito de compras",
      "Pasarela de pagos",
      "Panel de administración",
      "Optimización para conversiones",
      "3 meses de soporte gratuito",
    ],
    recommended: true,
  },
  {
    name: "App a Medida",
    icon: <FaCogs className="text-3xl" />,
    price: "desde $6.000.000 COP",
    description: "Soluciones personalizadas para tu negocio",
    features: [
      "Desarrollo a medida",
      "Panel de administración",
      "Base de datos a tu medida",
      "Integraciones personalizadas",
      "Despliegue incluido",
      "6 meses de soporte gratuito",
    ],
    recommended: false,
  },
];

export default function Pricing() {
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
          Inversión <span className="text-[#C2B280]">transparente</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Precios base orientativos. Cada proyecto se cotiza según necesidades específicas.
          Sin letras pequeñas ni costos ocultos.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className={`relative bg-[#111] rounded-xl border overflow-hidden transition ${
              plan.recommended
                ? "border-[#C2B280] shadow-lg shadow-[#C2B280]/10 scale-105 md:scale-105"
                : "border-gray-800 hover:border-gray-600"
            }`}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0 bg-[#C2B280] text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                RECOMENDADO
              </div>
            )}

            <div className="p-6">
              <div className="text-[#C2B280] mb-4">{plan.icon}</div>
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
              <p className="text-3xl font-bold text-[#C2B280] mb-6">
                {plan.price}
                <span className="text-sm text-gray-500 font-normal"> COP</span>
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <FaCheckCircle className="text-[#C2B280] text-xs" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={`block text-center py-3 rounded-xl font-semibold transition ${
                  plan.recommended
                    ? "bg-[#C2B280] text-black hover:opacity-80"
                    : "border border-gray-600 hover:bg-white hover:text-black"
                }`}
              >
                Solicitar cotización
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Nota aclaratoria */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-gray-500 text-xs mt-8"
      >
        * Los precios son referenciales. Factores como plazos, complejidad técnica 
        o integraciones especiales pueden modificar la cotización final.
      </motion.p>
    </section>
  );
}