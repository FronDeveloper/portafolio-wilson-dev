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
          title="FlowBill"
          description="Sistema completo de gestión de proyectos y facturación para agencias creativas, con portal del cliente integrado."
          problem="Las agencias pequeñas gestionan proyectos en Excel, facturas en Word y se comunican con clientes por WhatsApp. Todo disperso."
          solution="Desarrollé un SaaS completo: Kanban, facturación con IVA, reportes financieros y un portal donde el cliente ve su proyecto en vivo, aprueba entregables y descarga facturas."
          tech="Next.js 14 / TypeScript / Supabase / Tailwind / Recharts"
          link="/projects/flowbill"
          image="/images/flowbill.jpg"
          status="completado"
          liveUrl="https://flowbill-web.vercel.app"
        />

        <ProjectCard
          title="AgendaPro"
          description="Sistema de agendamiento de citas para negocios locales con notificaciones automáticas."
          problem="Negocios locales necesitan gestionar citas sin sistemas complejos ni costosos."
          solution="Desarrollé un sistema completo con calendario interactivo, portal de reservas, emails y WhatsApp automáticos."
          tech="Next.js 14 / Supabase / Resend / Twilio / Tailwind"
          link="/projects/agenda-pro"
          image="/images/agenda-pro.jpg"
          status="completado"
          liveUrl="https://agenda-procol.vercel.app"
        />

        <ProjectCard
          title="InsightAI Dashboard"
          description="Dashboard de gestión con IA para tiendas de productos naturales."
          problem="Los dueños de tiendas necesitan visualizar métricas clave sin conocimientos técnicos."
          solution="Desarrollé un dashboard intuitivo con gráficos interactivos, gestión de inventario y análisis de ventas con IA."
          tech="Next.js / Supabase / Recharts / Tailwind"
          link="/projects/insightai-dashboard"
          image="/images/insightai-dashboard.jpg"
          status="completado"
          liveUrl="https://vitainsight.vercel.app"
        />

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
          title="Mínimo Studio"
          description="E-commerce de ropa minimalista con panel admin, pagos con Stripe + Wompi + PSE y gestión de inventario."
          problem="Necesidad de una plataforma de comercio electrónico moderna para vender ropa con diseño minimalista."
          solution="Desarrollé un e-commerce completo con Next.js 15, Prisma y PostgreSQL, incluyendo autenticación, carrito, pasarela de pagos y panel admin."
          tech="Next.js 15 / Prisma / PostgreSQL / Stripe / Wompi / PSE / NextAuth / Tailwind"
          link="/projects/minimo-studio"
          image="/images/minimo-studio.jpg"
          status="completado"
          liveUrl="https://minimo-studio.vercel.app"
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
          title="ARISE — App RPG Fitness"
          description="App móvil que convierte tu entrenamiento en un RPG al estilo Solo Leveling. Niveles, XP y misiones diarias."
          problem="Las apps de fitness no retienen usuarios porque no hay progresión visual ni motivación emocional para volver."
          solution="Construí una app donde cada entreno otorga XP, sube niveles y desbloquea recompensas — como un RPG real."
          tech="Flutter · Dart · Firebase"
          link="/projects/rpg"
          image="/images/rpg-app.jpg"
          status="completado"
          liveUrl="https://play.google.com/store/apps/details?id=com.arisesystem.arise_app"
        />

      </motion.div>

    </section>
  );
}