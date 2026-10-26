import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Proyectos — E-commerce, SaaS y apps en producción",
  description:
    "Proyectos reales de Wilson Valencia: FlowBill (SaaS de gestión), tiendas online con pasarelas colombianas, dashboards y apps publicadas en Google Play.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Proyectos — E-commerce, SaaS y apps en producción",
    description:
      "Proyectos reales en producción: SaaS de gestión, e-commerce con pagos colombianos y apps publicadas en Play Store.",
    url: "/projects",
  },
};

export default function ProjectsPage() {
  return (
    <main className="text-white min-h-screen">
      <Navbar />
      <Projects />
      <Footer />
    </main>
  );
}
