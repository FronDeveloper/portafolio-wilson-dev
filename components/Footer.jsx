export default function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-20 px-8 md:px-20 py-10 text-gray-400">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        
        <p>© {new Date().getFullYear()} Wilson Valencia. Todos los derechos reservados.</p>

        <div className="flex gap-6">
          <a 
            href="https://github.com/FronDeveloper" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-[#C2B280] transition"
          >
            GitHub
          </a>
          <a 
            href="https://www.linkedin.com/in/wilson-valencia-939069408/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-[#C2B280] transition"
          >
            LinkedIn
          </a>
          <a 
            href="mailto:wilson.arroyo12@gmail.com"
            className="hover:text-[#C2B280] transition"
          >
            Email
          </a>
        </div>

      </div>
    </footer>
  );
}