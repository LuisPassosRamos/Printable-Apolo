import { HeroSection } from './components/HeroSection';
import { ProductGrid } from './components/ProductGrid';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span className="font-bold text-gray-800 text-lg">Printable Apolo</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#catalogo" className="hover:text-primary transition-colors">Catálogo</a>
            <a href="#catalogo" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors font-medium">
              Fazer Pedido
            </a>
          </nav>
        </div>
      </header>

      <main>
        <HeroSection />
        <ProductGrid />
      </main>

      <footer className="bg-gray-800 text-gray-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-sm">
          <p>© 2024 Printable Apolo — Impressão 3D Personalizada</p>
          <p className="mt-1 text-gray-500">Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
