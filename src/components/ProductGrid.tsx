import { useState, useMemo } from 'react';
import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { FilterBar } from './FilterBar';
import type { FilterState } from './FilterBar';
import { Pagination } from './Pagination';

const ITEMS_PER_PAGE = 30;

const defaultFilters: FilterState = {
  search: '',
  sortField: 'name',
  sortDirection: 'asc',
  minPrice: '',
  maxPrice: '',
};

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  selectedTag?: string;
}

export function ProductGrid({ products, loading, selectedTag = '' }: ProductGridProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);

  // Stable string key for detecting filter/tag changes (value equality)
  const filterKey = JSON.stringify(filters) + '|' + selectedTag;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);

  // Reset to page 1 when filters or selectedTag change (adjusting state during render)
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedTag) {
      result = result.filter((p) =>
        p.tag
          .split(', ')
          .map((t) => t.trim())
          .includes(selectedTag)
      );
    }

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice);
      if (!isNaN(min)) result = result.filter((p) => p.price >= min);
    }

    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice);
      if (!isNaN(max)) result = result.filter((p) => p.price <= max);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (filters.sortField === 'name') {
        cmp = a.name.localeCompare(b.name, 'pt-BR');
      } else if (filters.sortField === 'price') {
        cmp = a.price - b.price;
      } else if (filters.sortField === 'salesCount') {
        cmp = a.salesCount - b.salesCount;
      }
      return filters.sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [products, filters, selectedTag]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="catalogo" className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Catálogo de Produtos</h2>
        <p className="text-gray-500 mt-1">
          {selectedTag ? `Categoria: ${selectedTag}` : 'Explore nossos produtos impressos em 3D'}
        </p>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        totalCount={filtered.length}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">Nenhum produto encontrado</p>
          <p className="text-sm mt-1">Tente ajustar os filtros de busca</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
}
