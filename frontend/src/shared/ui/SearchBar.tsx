import { useState, Suspense, lazy } from 'react';
import { FilterButton } from './FilterButton';
import { PokeballSpinner } from './PokeballSpinner';
const SortModal = lazy(() => import('./SortModal'));

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: 'number' | 'name') => void;
}

export function SearchBar({ searchQuery, onSearchChange, onSortChange }: SearchBarProps) {
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);

  // Sort options
  const sortOptions = [
    { value: 'number', label: 'Number' },
    { value: 'name', label: 'Name' }
  ];

  const handleFilterClick = () => {
    setIsSortModalOpen(true);
  };

  const handleSortChange = (value: string) => {
    if (value === 'number' || value === 'name') {
      setSelectedSort(value);
      onSortChange(value);
    }
  };

  const handleSortModalClose = () => {
    setIsSortModalOpen(false);
  };

  return (
    <>
      <div className="px-4 pb-10">
        <div className="max-w-2xl mx-auto">
          <div className="relative flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-4 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-16 pr-12 py-3 rounded-4xl border-0 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-white/30 focus:outline-none transition-all duration-200 text-lg"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0px 1px 3px 1px #00000040 inset'
                }}
                placeholder="Search"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-5 flex items-center text-primary hover:text-primary/80 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter Button Component */}
            <FilterButton onFilterClick={handleFilterClick} />
          </div>
        </div>
      </div>

      {/* Sort Modal - Lazy Loaded */}
      {isSortModalOpen && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <PokeballSpinner size="lg" />
          </div>
        }>
          <SortModal
            isOpen={isSortModalOpen}
            onClose={handleSortModalClose}
            title="Sort by"
            options={sortOptions}
            selectedValue={selectedSort || ''}
            onSelectChange={handleSortChange}
          />
        </Suspense>
      )}
    </>
  );
}
