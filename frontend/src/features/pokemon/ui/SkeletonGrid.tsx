import SkeletonCard from '@/shared/ui/SkeletonCard';

export const SkeletonGrid = () => {
  return (
    <div className="flex-1 overflow-hidden px-1 sm:px-2 pb-2">
      <div className="bg-white rounded-3xl shadow-lg h-full flex flex-col mx-1 sm:mx-2 mb-0">
        <div className="p-3 sm:p-4 md:p-6 flex flex-col h-full">
          <div className="mb-4 text-sm text-gray-600 flex-shrink-0">
            <div className="h-5 w-32 bg-gray-300 rounded animate-pulse"></div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2">
              {Array.from({ length: 24 }, (_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
