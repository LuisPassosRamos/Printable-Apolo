import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductGrid } from './components/ProductGrid';
import type { Product } from './types/product';
import { fetchProducts } from './services/appSheetService';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    fetchProducts()
      .then(({ products }) => setProducts(products))
      .finally(() => setLoading(false));
  }, []);

  const tags = useMemo(() => {
    const all = products.flatMap((p) =>
      p.tag ? p.tag.split(', ').map((t) => t.trim()).filter(Boolean) : []
    );
    return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [products]);

  return (
    <div className="min-h-screen bg-white">
      <Header tags={tags} selectedTag={selectedTag} onSelectTag={setSelectedTag} />

      <main>
        <HeroSection />
        <ProductGrid products={products} loading={loading} selectedTag={selectedTag} />
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
