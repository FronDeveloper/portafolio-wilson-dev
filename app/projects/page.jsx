import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";

export default function ProjectsPage() {
  return (
    <main className="bg-[#0B0B0B] text-white min-h-screen">
      <Navbar />
      <Projects />
      <Footer />
    </main>
  );
}