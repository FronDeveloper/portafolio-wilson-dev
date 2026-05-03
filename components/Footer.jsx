export default function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-20 px-8 md:px-20 py-10 text-gray-400">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        
        <p>© {new Date().getFullYear()} Wilson. Todos los derechos reservados.</p>

        <div className="flex gap-6">
          <a href="#" className="hover:text-white">GitHub</a>
          <a href="#" className="hover:text-white">LinkedIn</a>
          <a href="#" className="hover:text-white">Email</a>
        </div>

      </div>
    </footer>
  );
}