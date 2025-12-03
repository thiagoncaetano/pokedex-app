import React from 'react';

const SkeletonCard = React.memo(function SkeletonCard() {
  return (
    <div 
      className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden animate-pulse"
      style={{
        boxShadow: '2px 4px 6px 2px rgba(162, 160, 160, 0.3), 1px 1px 4px 2px rgba(162, 160, 160, 0.3)'
      }}
    >
      <div className="absolute top-2 right-2 w-8 h-4 bg-gray-300 rounded" />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <img 
          src="/silhouette.png" 
          alt="Loading..."
          className="w-[60%] h-[60%] sm:w-[70%] sm:h-[70%] md:w-[75%] md:h-[75%] object-contain opacity-30"
        />
      </div>
      <div 
        className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-1"
        style={{
          height: '45%',
          background: 'linear-gradient(to top, rgba(156, 163, 175, 0.3), transparent)',
        }}
      >
        <div className="w-20 h-6 bg-gray-300 rounded-full mb-2" />
      </div>
    </div>
  );
});

export default SkeletonCard;