import React, { useState } from 'react';

interface FilterButtonProps {
  onFilterClick: () => void;
}

export function FilterButton({ onFilterClick }: FilterButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    onFilterClick();
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      className="w-13 h-13 rounded-full focus:ring-4 focus:ring-white/30 transition-all duration-200 flex items-center justify-center group"
      style={{
        backgroundColor: '#FFFFFF',
        boxShadow: isPressed 
          ? '0px 1px 3px 1px #00000040 inset' 
          : '0px 1px 3px 1px #00000033'
      }}
      title="Filter"
    >
      <svg 
        className="w-5 h-5 text-primary group-hover:text-primary transition-colors duration-200" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 22 22"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M2 6h20M2 12h10M2 18h5" 
        />
      </svg>
    </button>
  );
}
