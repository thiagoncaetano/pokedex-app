import React from 'react';

interface ChevronIconProps {
  direction?: 'left' | 'right' | 'up' | 'down';
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export function ChevronIcon({
  direction = 'right',
  onClick,
  className = '',
  ariaLabel,
}: ChevronIconProps) {
  const rotationClasses: Record<'left' | 'right' | 'up' | 'down', string> = {
    right: 'rotate-0',
    down: 'rotate-90',
    left: 'rotate-180',
    up: '-rotate-90',
  };

  const rotationClass = rotationClasses[direction ?? 'right'];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? `Chevron ${direction}`}
      className={`inline-flex items-center justify-center rounded-full p-2 cursor-pointer transition-colors duration-150 hover:bg-black/5 active:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-black ${className}`}
    >
      <svg
        className={`w-5 h-5 text-current transform ${rotationClass}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 5l7 7-7 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
