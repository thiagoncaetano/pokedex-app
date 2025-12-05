import React from 'react';
import { AppImage } from './AppImage';

interface ButtonProps {
  onClick?: () => void;
  imageSrc: string;
  imageAlt: string;
  className?: string;
  imageClassName?: string;
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  onClick,
  imageSrc,
  imageAlt,
  className = '',
  imageClassName = '',
  ariaLabel,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      aria-label={ariaLabel ?? imageAlt}
      onClick={onClick}
      className={`cursor-pointer ${className}`.trim()}
    >
      <AppImage
        src={imageSrc}
        alt={imageAlt}
        width={24}
        height={24}
        className={imageClassName}
      />
    </button>
  );
}
