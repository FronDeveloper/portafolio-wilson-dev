"use client";

import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

export default function Projects() {
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
          Casos de <span className="text-[#C2B280]">estudio</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          No solo son proyectos bonitos. Cada solución generó resultados medibles para negocios reales.
        </p>
      </motion.div>

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
          metrics={[
            { value: "100%", label: "Facturación automatizada" },
            { value: "3x", label: "Más rápido que Excel" },
            { value: "0", label: "Facturas perdidas" },
          ]}
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
          metrics={[
            { value: "70%", label: "Menos ausencias" },
            { value: "24/7", label: "Reservas automáticas" },
            { value: "2x", label: "Más citas agendadas" },
          ]}
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
          metrics={[
            { value: "100%", label: "Visibilidad de inventario" },
            { value: "5min", label: "Para entender el negocio" },
            { value: "IA", label: "Análisis predictivo" },
          ]}
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
          metrics={[
            { value: "50+", label: "Pedidos procesados" },
            { value: "0%", label: "Errores en checkout" },
            { value: "3.2s", label: "Tiempo de carga" },
          ]}
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
          metrics={[
            { value: "3", label: "Pasarelas de pago" },
            { value: "100%", label: "Inventario en tiempo real" },
            { value: "<2s", label: "Carga de catálogo" },
          ]}
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
          metrics={[
            { value: "1°", label: "Presencia digital" },
            { value: "100%", label: "Accesible" },
            { value: "SEO", label: "Optimizado" },
          ]}
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
          metrics={[
            { value: "500+", label: "Descargas en Play Store" },
            { value: "49%", label: "Conversión registro" },
            { value: "ES/EN", label: "Bilingüe" },
          ]}
        />

      </motion.div>

    </section>
  );
}