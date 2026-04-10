import { HeroSection } from './components/HeroSection';
import { ProductGrid } from './components/ProductGrid';
import { WHATSAPP_NUMBER } from './config';

function App() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Gostaria de fazer um pedido.')}`;

  return (
    <div className="min-h-screen bg-white">
      <header className="absolute top-0 left-0 w-full z-30">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-7 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <img src="/Logo_white.png" alt="Olympus 3D" className="w-20 h-20 object-contain" />
            <span className="font-semibold tracking-wide text-sm md:text-base">Olympus 3D</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-sm text-white/90">
            <a href="#" className="hover:text-white transition-colors">Homepage</a>
            <a href="#catalogo" className="hover:text-white transition-colors">Catálogo</a>
            <a href="#catalogo" className="hover:text-white transition-colors">Categorias <span className="text-[10px]">▼</span></a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/70 px-4 py-2 rounded-md hover:bg-white hover:text-primary transition-colors font-semibold"
            >
              Fazer Pedido
            </a>
          </nav>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lg:hidden border border-white/70 text-white text-xs font-semibold px-3 py-1.5 rounded-md"
          >
            WhatsApp
          </a>
        </div>
      </header>

      <main>
        <HeroSection />
        <ProductGrid />
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-sm">
          <p>© 2026 Olympus 3D — Impressão 3D Personalizada</p>
          <p className="mt-1 text-gray-500">Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
