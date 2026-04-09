export type SortField = 'name' | 'price' | 'salesCount';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search: string;
  sortField: SortField;
  sortDirection: SortDirection;
  minPrice: string;
  maxPrice: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalCount: number;
}

export function FilterBar({ filters, onFilterChange, totalCount }: FilterBarProps) {
  const update = (partial: Partial<FilterState>) =>
    onFilterChange({ ...filters, ...partial });

  const toggleSortDirection = () =>
    update({ sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc' });

  const sortOptions: { value: SortField; label: string }[] = [
    { value: 'name', label: 'Nome' },
    { value: 'price', label: 'Preço' },
    { value: 'salesCount', label: 'Vendas' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar produto..."
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        {/* Price range */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 whitespace-nowrap">Preço:</span>
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => update({ minPrice: e.target.value })}
            className="w-20 px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => update({ maxPrice: e.target.value })}
            className="w-20 px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 whitespace-nowrap">Ordenar:</span>
          <select
            value={filters.sortField}
            onChange={(e) => update({ sortField: e.target.value as SortField })}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white transition-colors cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={toggleSortDirection}
            title={filters.sortDirection === 'asc' ? 'Ordem crescente' : 'Ordem decrescente'}
            aria-label={filters.sortDirection === 'asc' ? 'Alternar ordem: crescente' : 'Alternar ordem: decrescente'}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary transition-colors text-gray-600 hover:text-primary"
          >
            {filters.sortDirection === 'asc' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
            )}
          </button>
        </div>

        <div className="text-sm text-gray-400 whitespace-nowrap ml-auto">
          {totalCount} resultado{totalCount !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
