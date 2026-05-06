"use client";

import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section className="px-8 md:px-20 py-20 max-w-6xl mx-auto">
      
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
        Proyectos destacados
      </h2>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.2 }}
        className="grid md:grid-cols-3 gap-8"
      >
        <ProjectCard
          title="Ecommerce de Calzado"
          description="Tienda online 100% funcional con productos reales y pasarela de pago."
          problem="El cliente necesitaba vender productos online de forma sencilla y rápida."
          solution="Desarrollé un ecommerce con flujo de compra optimizado, diseño moderno y navegación intuitiva."
          tech="Next.js / Stripe / Tailwind"
          link="/projects/ecommerce"
          image="/images/ecommerce.jpg"
          status="completado"
          liveUrl="https://pisarteoficial.com"
        />

        <ProjectCard
          title="Fundación FAEBO"
          description="Plataforma web institucional para visibilizar impacto social."
          problem="La fundación no tenía presencia digital ni canal de contacto eficiente."
          solution="Creé un sitio institucional claro, accesible y enfocado en generar confianza para donantes."
          tech="HTML / CSS / JS"
          link="/projects/faebo"
          image="/images/faebo.jpg"
          status="proximamente"
          liveUrl={null}
        />

        <ProjectCard
          title="App RPG Fitness"
          description="App móvil gamificada que convierte el entrenamiento en RPG."
          problem="Falta de motivación en usuarios para mantener rutinas de ejercicio."
          solution="Diseñé una app tipo RPG donde el progreso físico se traduce en niveles y recompensas."
          tech="Flutter / Firebase"
          link="/projects/rpg"
          image="/images/rpg-app.jpg"
          status="proximamente"
          liveUrl={null}
        />
      </motion.div>

    </section>
  );
}