import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "VentaChat AI — Bot de WhatsApp con IA que vende 24/7 | Wilson Valencia Dev",
  description:
    "Bot de WhatsApp con inteligencia artificial que atiende clientes 24/7: responde preguntas, cotiza y deriva a humano cuando hace falta. Construido con Baileys, Groq y Supabase. Pruébalo en la demo en vivo.",
  keywords: [
    "bot de whatsapp con ia",
    "chatbot whatsapp para negocios",
    "automatizar whatsapp pyme",
    "bot de ventas con inteligencia artificial",
    "agente ia whatsapp colombia",
    "chatbot atención al cliente 24/7",
  ],
  openGraph: {
    title: "VentaChat AI — Bot de WhatsApp con IA 24/7 | Wilson Valencia",
    description:
      "Atiende tu WhatsApp con IA: respuestas en ~2 segundos, derivación a humano y conversaciones guardadas en base de datos. Demo en vivo disponible.",
    url: "https://wvalencia-dev.vercel.app/projects/ventachat-ai",
  },
  alternates: {
    canonical: "https://wvalencia-dev.vercel.app/projects/ventachat-ai",
  },
};

export default function VentaChatAIProject() {
  return (
    <main className="text-white min-h-screen">
      <Navbar />

      <section className="px-8 md:px-20 py-20 max-w-4xl mx-auto">
        <Link href="/projects" className="text-sm text-gray-400 hover:text-[#C2B280] transition inline-block mb-6">
          ← Volver a proyectos
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#C2B280]">
          VentaChat AI
        </h1>

        <div className="relative w-full h-96 mb-10 rounded-xl overflow-hidden">
          <Image
            src="/images/ventachat-ai.jpg"
            alt="VentaChat AI — landing de la demo con simulador de WhatsApp e IA en vivo"
            fill
            sizes="(max-width: 768px) 100vw, 1000px"
            className="object-cover object-top"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Descripción</h2>
            <p className="text-gray-400">
              Bot de WhatsApp potenciado con inteligencia artificial que atiende clientes 24/7:
              responde preguntas del negocio, orienta sobre productos y precios, y deriva la
              conversación a un humano cuando el caso lo requiere. Incluye una demo web funcional
              donde cualquier persona puede conversar con la IA en vivo, sin instalar nada.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Problema que resuelve</h2>
            <p className="text-gray-400">
              Los negocios pierden ventas todos los días por responder el WhatsApp horas después:
              el cliente pregunta, nadie contesta y termina comprando en otra parte. Contratar un
              agente para turnos nocturnos o fines de semana es costoso, y las respuestas automáticas
              tradicionales son rígidas y frustran al cliente.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Solución implementada</h2>
          <p className="text-gray-400">
            Construí un bot que conecta WhatsApp directamente (Baileys) con un cerebro híbrido:
            reglas deterministas para saludos, menús y cortesías, e IA (Groq · GPT-OSS 120B) para
            todo lo demás, con el contexto del negocio inyectado en el prompt del sistema. Las
            conversaciones se guardan en Supabase (Postgres) para auditoría y métricas, y el cliente
            puede escribir #humano en cualquier momento para ser atendido por una persona real. La
            demo web replica la experiencia con un simulador de WhatsApp y un panel de
            administración, desplegada en Vercel.
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Características principales</h2>
          <div className="space-y-2 text-gray-400">
            <p>• Conexión directa a WhatsApp sin API oficial de pago (Baileys)</p>
            <p>• Respuestas de IA en ~2 segundos con Groq, sin costo en su tier gratuito</p>
            <p>• Cerebro híbrido: reglas deterministas + IA con contexto del negocio</p>
            <p>• Memoria de conversación: la IA recuerda el hilo completo del cliente</p>
            <p>• Derivación a humano (#humano) y reactivación del bot (#bot)</p>
            <p>• Persistencia de conversaciones y mensajes en Supabase (Postgres)</p>
            <p>• Rate limiting anti-flood y validación de horario comercial</p>
            <p>• Demo web: simulador de WhatsApp + panel admin de conversaciones</p>
            <p>• Bot desplegable en cualquier VPS con Docker Compose</p>
            <p>• Configuración por variables de entorno, lista para personalizar por cliente</p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Tecnologías utilizadas</h2>
          <div className="flex flex-wrap gap-2">
            {["Next.js 15", "Baileys", "Groq · GPT-OSS 120B", "Supabase", "Prisma", "Docker", "Tailwind CSS", "shadcn/ui", "Vercel"].map(tech => (
              <span key={tech} className="bg-[#111] border border-gray-800 px-3 py-1 rounded-full text-sm text-gray-300">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#111] p-6 rounded-xl border border-gray-800 mb-6">
          <h3 className="text-xl font-semibold mb-2 text-[#C2B280]">📊 Resultados</h3>
          <p className="text-gray-400">
            • Bot 100% funcional conectado a WhatsApp real, listo para producción<br />
            • Demo web con IA respondiendo en vivo — cualquier visitante puede probarla<br />
            • Costo de IA: $0 (tier gratuito de Groq), ideal para pymes<br />
            • Arquitectura validada: mismo cerebro para el bot (VPS/Docker) y la demo (Vercel)<br />
            • Conversaciones auditables en tiempo real desde el panel de administración
          </p>
        </div>

        <div className="flex gap-4 flex-wrap">
          <a
            href="https://ventachat-ai-demo.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#C2B280] text-black rounded-xl font-semibold hover:opacity-80 transition"
          >
            🌐 Probar la demo en vivo →
          </a>
          <Link
            href="/cotizar"
            className="inline-block px-6 py-3 border border-gray-600 rounded-xl font-semibold hover:bg-white hover:text-black transition"
          >
            💬 Quiero un bot para mi negocio
          </Link>
        </div>
      </section>
    </main>
  );
}
