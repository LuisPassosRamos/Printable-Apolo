export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="mt-2 h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="mt-3 h-10 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}
