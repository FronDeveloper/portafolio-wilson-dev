"use client";

import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section className="px-8 md:px-20 py-20">
      
      <h2 className="text-3xl md:text-4xl font-bold mb-12">
        Proyectos destacados
      </h2>

      {/* 👇 ESTE es el grid animado */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.2 }}
        className="grid md:grid-cols-3 gap-8"
      >

        <ProjectCard
          title="Ecommerce de Calzado"
          description="Tienda online enfocada en conversión y experiencia de usuario."
          problem="El cliente necesitaba vender productos online de forma sencilla y rápida."
          solution="Desarrollé un ecommerce con flujo de compra optimizado, diseño moderno y navegación intuitiva."
          tech="Next.js / Stripe / Tailwind"
          link="/projects/ecommerce"
          image="/images/ecommerce.jpg"
        />

        <ProjectCard
          title="Fundación FAEBO"
          description="Plataforma web para visibilizar impacto social."
          problem="La fundación no tenía presencia digital ni canal de contacto eficiente."
          solution="Creé un sitio institucional claro, accesible y enfocado en generar confianza para donantes."
          tech="HTML / CSS / JS"
          link="/projects/faebo"
          image="/images/faebo.jpg"
        />

        <ProjectCard
          title="App RPG Fitness"
          description="App móvil gamificada para entrenamiento."
          problem="Falta de motivación en usuarios para mantener rutinas."
          solution="Diseñé una app tipo RPG donde el progreso físico se traduce en niveles y recompensas."
          tech="Flutter / Firebase"
          link="/projects/rpg"
          image="/images/rpg-app.jpg"
        />

      </motion.div>

    </section>
  );
}