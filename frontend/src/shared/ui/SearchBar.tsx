import { useState } from 'react';
import { FilterButton } from './FilterButton';
import { SortModal } from './SortModal';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
}

export function SearchBar({ searchQuery, onSearchChange, onFilterClick }: SearchBarProps) {
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
    console.log('handleSortChange chamado com:', value);
    setSelectedSort(value);
  };

  const handleSortModalClose = () => {
    setIsSortModalOpen(false);
    // Here you can call the real sorting function
    onFilterClick();
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
                className="w-full pl-16 pr-4 py-3 rounded-4xl border-0 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-white/30 focus:outline-none transition-all duration-200 text-lg"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0px 1px 3px 1px #00000040 inset'
                }}
                placeholder="Search"
              />
            </div>

            {/* Filter Button Component */}
            <FilterButton onFilterClick={handleFilterClick} />
          </div>
        </div>
      </div>

      {/* Sort Modal */}
      <SortModal
        isOpen={isSortModalOpen}
        onClose={handleSortModalClose}
        title="Sort by"
        options={sortOptions}
        selectedValue={selectedSort || ''}
        onSelectChange={handleSortChange}
      />
    </>
  );
}
