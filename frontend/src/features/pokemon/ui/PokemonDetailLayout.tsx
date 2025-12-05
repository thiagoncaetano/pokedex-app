import React, { ReactNode } from 'react';
import { Button } from '@/shared/ui/Button';
import { AppImage } from '@/shared/ui/AppImage';

interface PokemonDetailLayoutProps {
  backgroundClassName?: string;
  imageSrc?: string;
  imageAlt?: string;
  children?: ReactNode;
  onBack?: () => void;
}

export function PokemonDetailLayout({
  backgroundClassName = 'bg-green-500',
  imageSrc = '/silhouette.png',
  imageAlt = 'Pokemon silhouette',
  children,
  onBack,
}: PokemonDetailLayoutProps) {
  return (
    <div className={`min-h-screen ${backgroundClassName} flex flex-col`}>
      <div className="relative flex-1">
        <Button
          type="button"
          ariaLabel="Voltar"
          onClick={onBack}
          imageSrc="/arrow.png"
          imageAlt="Back"
          className="absolute top-4 left-4 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-150 hover:scale-105 active:scale-100"
          imageClassName="w-6 h-6 sm:w-7 sm:h-7 object-contain"
        />

        <div className="absolute left-2 right-2 bottom-2 h-[60vh] bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center">
          <AppImage
            src={imageSrc}
            alt={imageAlt}
            width={256}
            height={256}
            className="w-40 h-40 object-contain -mt-20 mb-4"
          />

          {children}
        </div>
      </div>
    </div>
  );
}
