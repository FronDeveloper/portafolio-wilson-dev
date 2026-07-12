import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Plataforma Educativa Multi-Institución — Sitios web para colegios | Wilson Valencia Dev",
  description:
    "Plataforma web multi-tenant para colegios: sitio institucional, panel administrativo, portal de docentes, padres y estudiantes. Multi-institución con personalización de colores y logo. Demo en vivo disponible.",
  keywords: [
    "sitio web colegios colombia",
    "plataforma educativa multi-institución",
    "portal padres familia colegio",
    "sistema gestión escolar php mysql",
    "circulares digitales colegio",
    "autorizaciones digitales padres",
    "software educativo multi-tenant",
    "plataforma escolar php",
  ],
  openGraph: {
    title: "Plataforma Educativa Multi-Institución — Sitios web para colegios | Wilson Valencia",
    description:
      "Plataforma completa para colegios: sitio público, panel admin, portales para docentes, padres y estudiantes. Multi-institución, 6 roles, personalizable. Demo en vivo.",
    url: "https://wvalencia-dev.vercel.app/projects/plataforma-educativa",
  },
  alternates: {
    canonical: "https://wvalencia-dev.vercel.app/projects/plataforma-educativa",
  },
};

const tech = [
  "PHP 7.4+",
  "MySQL",
  "JavaScript ES6+",
  "HTML5 semántico",
  "CSS3 / Variables CSS",
  "PDO / Prepared Statements",
  "Multi-tenant",
  "Apache / .htaccess",
  "FontAwesome 6",
  "Accesibilidad WCAG 2.1 AA",
];

const modules = [
  {
    icon: "🌐",
    title: "Sitio público institucional",
    desc: "Home con carrusel, noticias, eventos, calendario, galería con lightbox, admisiones en línea con subida de documentos, formulario de contacto, biblioteca virtual, FAQ y páginas legales.",
  },
  {
    icon: "⚙️",
    title: "Panel administrativo",
    desc: "Dashboard con estadísticas, CRUD completo de noticias, eventos, galería, biblioteca, usuarios, materias, horarios, calificaciones, circulares, admisiones y mensajes. Configuración institucional sin tocar código.",
  },
  {
    icon: "👨‍🏫",
    title: "Portal de docentes",
    desc: "Mis materias, registrar calificaciones, tomar asistencia diaria, publicar tareas con adjuntos, gestionar citas solicitadas por padres, enviar circulares a sus cursos y mensajería directa.",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Portal de padres",
    desc: "Dashboard con stats de todos sus hijos, circulares con confirmación de lectura, autorizaciones digitales (firmar aprobar/rechazar), agendar citas con docentes, mensajería, ver calificaciones y horarios.",
  },
  {
    icon: "🎓",
    title: "Portal de estudiantes",
    desc: "Dashboard personal con promedio general, últimas calificaciones, próximas tareas a entregar, horario semanal con materias, docentes y aulas.",
  },
  {
    icon: "👑",
    title: "Panel super admin",
    desc: "Control total de todas las instituciones. Crear nuevas instituciones con slug, plan y colores. Ver métricas globales, activar/desactivar instituciones, gestionar toda la plataforma desde un solo lugar.",
  },
];

const roles = [
  { icon: "👑", name: "Super Admin", desc: "Controla todas las instituciones (Wilson)" },
  { icon: "👨‍💼", name: "Rector", desc: "Admin completo de su institución" },
  { icon: "👥", name: "Coordinador", desc: "Asistente del rector" },
  { icon: "👨‍🏫", name: "Docente", desc: "Sus materias, calificaciones, asistencia" },
  { icon: "🎓", name: "Estudiante", desc: "Sus notas, horario, tareas" },
  { icon: "👨‍👩‍👧", name: "Padre", desc: "Seguimiento de sus hijos, firmas, citas" },
];

const features = [
  "Multi-institución: cada colegio tiene su propia URL, colores y logo",
  "Personalización sin código desde el panel admin",
  "Circulares digitales con confirmación de lectura obligatoria",
  "Autorizaciones digitales que reemplazan el papel",
  "Citas padre-docente con agenda y estados",
  "Galería multimedia con lightbox y filtros por categoría",
  "Inscripción a eventos con control de cupos",
  "Sincronización con Google Calendar",
  "Sistema de 6 roles con permisos granulares",
  "Accesibilidad WCAG 2.1 AA (navegación por teclado, ARIA, contraste)",
  "Diseño 100% responsive mobile-first",
  "SEO optimizado con Open Graph y meta tags dinámicos",
];

export default function PlataformaEducativaProject() {
  return (
    <main className="text-white min-h-screen">
      <Navbar />

      <section className="px-8 md:px-20 py-20 max-w-4xl mx-auto">
        <Link
          href="/projects"
          className="text-sm text-gray-400 hover:text-[#C2B280] transition inline-block mb-6"
        >
          ← Volver a proyectos
        </Link>

        {/* Title */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <h1 className="text-4xl md:text-5xl font-bold text-[#C2B280]">
            Plataforma Educativa
          </h1>
          <span className="text-xs font-bold bg-green-900/50 text-green-400 border border-green-700 px-3 py-1 rounded-full">
            ✓ En producción
          </span>
        </div>
        <p className="text-gray-400 text-lg mb-10">
          Plataforma web multi-institución para colegios: sitio público + panel admin + portales para rector, docentes, estudiantes y padres de familia.
        </p>

        {/* Hero image */}
        <div className="relative w-full h-72 md:h-96 mb-12 rounded-2xl overflow-hidden border border-gray-800">
          <Image
            src="/images/plataforma-educativa.jpg"
            alt="Plataforma Educativa Multi-Institución"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Quick info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-[#111] border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#C2B280]">6</p>
            <p className="text-gray-500 text-xs mt-1">Roles de usuario</p>
          </div>
          <div className="bg-[#111] border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#C2B280]">27</p>
            <p className="text-gray-500 text-xs mt-1">Tablas en BD</p>
          </div>
          <div className="bg-[#111] border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#C2B280]">64+</p>
            <p className="text-gray-500 text-xs mt-1">Archivos PHP</p>
          </div>
          <div className="bg-[#111] border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#C2B280]">Multi</p>
            <p className="text-gray-500 text-xs mt-1">Institución</p>
          </div>
        </div>

        {/* Problem / Solution */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-[#111] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3 text-white">
              🔴 El problema
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Los colegios pequeños no tienen presencia digital ni un sistema
              para comunicarse eficientemente con padres de familia. Las
              circulares se imprimen en papel, las autorizaciones para salidas
              pedagógicas se mandan en cuadernos, las calificaciones se
              entregan en boletines físicos, y las citas con docentes se
              coordinan por WhatsApp. Todo lento, ineficiente y propenso a
              pérdidas.
            </p>
          </div>
          <div className="bg-[#111] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3 text-white">
              🟢 La solución
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Desarrollé una plataforma multi-institución completa: cada
              colegio tiene su propia URL con colores, logo y datos
              personalizables sin tocar código. Incluye 6 roles de usuario
              (super admin, rector, coordinador, docente, estudiante, padre),
              circulares digitales con confirmación de lectura, autorizaciones
              firmadas digitalmente, citas agendadas entre padres y docentes,
              galería multimedia y mucho más.
            </p>
          </div>
        </div>

        {/* Modules */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Módulos del sistema</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {modules.map((m) => (
              <div
                key={m.title}
                className="bg-[#111] border border-gray-800 rounded-xl p-5 hover:border-[#C2B280]/50 transition"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-xl">{m.icon}</span>
                  <h3 className="font-semibold text-white">{m.title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Roles */}
        <div className="bg-gradient-to-br from-blue-950/50 to-green-950/30 border border-blue-800/50 rounded-2xl p-7 mb-12">
          <h2 className="text-xl font-semibold mb-3 text-blue-300">
            ✨ 6 roles de usuario con permisos granulares
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Cada usuario tiene su propio portal con las herramientas que
            necesita. El sistema detecta el rol automáticamente al iniciar
            sesión y redirige al dashboard correcto.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {roles.map((r) => (
              <div
                key={r.name}
                className="bg-[#0B0B0B] border border-gray-800 rounded-lg p-3 text-center"
              >
                <div className="text-2xl mb-1">{r.icon}</div>
                <p className="text-[#C2B280] font-semibold text-sm">{r.name}</p>
                <p className="text-gray-500 text-xs mt-1">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Características destacadas</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-gray-400">
                <span className="text-[#C2B280] flex-shrink-0 mt-0.5">✓</span>
                <p>{f}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Stack técnico</h2>
          <div className="flex flex-wrap gap-2">
            {tech.map((t) => (
              <span
                key={t}
                className="bg-[#111] border border-gray-800 px-3 py-1.5 rounded-full text-sm text-gray-300 hover:border-[#C2B280]/50 transition"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Demo credentials */}
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-7 mb-12">
          <h2 className="text-xl font-semibold mb-4 text-white">
            🔑 Credenciales de demostración
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Puedes probar todos los portales con estos usuarios de demo:
          </p>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="bg-[#0B0B0B] border border-gray-800 rounded-lg p-3">
              <p className="text-[#C2B280] font-semibold">👨‍💼 Rector</p>
              <p className="text-gray-400 mt-1">Usuario: <code className="text-white">100000001</code></p>
              <p className="text-gray-400">Clave: <code className="text-white">Rector2025!</code></p>
            </div>
            <div className="bg-[#0B0B0B] border border-gray-800 rounded-lg p-3">
              <p className="text-[#C2B280] font-semibold">👨‍🏫 Docente</p>
              <p className="text-gray-400 mt-1">Usuario: <code className="text-white">100000002</code></p>
              <p className="text-gray-400">Clave: <code className="text-white">Docente2025!</code></p>
            </div>
            <div className="bg-[#0B0B0B] border border-gray-800 rounded-lg p-3">
              <p className="text-[#C2B280] font-semibold">🎓 Estudiante</p>
              <p className="text-gray-400 mt-1">Usuario: <code className="text-white">100000003</code></p>
              <p className="text-gray-400">Clave: <code className="text-white">Estudiante2025!</code></p>
            </div>
            <div className="bg-[#0B0B0B] border border-gray-800 rounded-lg p-3">
              <p className="text-[#C2B280] font-semibold">👨‍👩‍👧 Padre</p>
              <p className="text-gray-400 mt-1">Usuario: <code className="text-white">100000004</code></p>
              <p className="text-gray-400">Clave: <code className="text-white">Padre2025!</code></p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-4 flex-wrap">
          <a
            href="https://plataformaeducativa.infinityfree.me/colegio-demo/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#C2B280] text-black rounded-xl font-semibold hover:bg-[#D4C090] transition"
          >
            🌐 Ver demo en vivo
          </a>
          <a
            href="https://plataformaeducativa.infinityfree.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border border-gray-600 rounded-xl font-semibold hover:bg-white hover:text-black transition"
          >
            💼 Ver landing de ventas
          </a>
          <a
            href="https://wa.me/573012821174?text=Hola%20Wilson,%20me%20interesa%20la%20plataforma%20educativa%20para%20mi%20colegio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
          >
            💬 Solicitar para mi colegio
          </a>
        </div>
      </section>
    </main>
  );
}
