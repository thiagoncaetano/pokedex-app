import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { AppImage } from '@/shared/ui/AppImage';
import { Badge } from '@/shared/ui/Badge';
import { ChevronIcon } from '@/shared/ui/ChevronIcon';
import { getTypeColor } from '../utils/getTypeColor';
import { AboutSection } from './AboutSection';
import { BaseStatsSection } from './BaseStatsSection';
import { PokemonDetails } from '../types/pokemon';

interface PokemonDetailLayoutProps {
  backgroundClassName?: string;
  backgroundColor?: string;
  imageSrc?: string;
  imageAlt?: string;
  name?: string;
  id?: number;
  pokemon: PokemonDetails;
  onBack?: () => void;
}

export function PokemonDetailLayout({
  backgroundClassName = 'bg-green-500',
  backgroundColor,
  imageSrc = '/silhouette.png',
  imageAlt = 'Pokemon silhouette',
  name,
  id,
  pokemon,
  onBack,
}: PokemonDetailLayoutProps) {
  const idLabel = typeof id === 'number' ? `#${String(id).padStart(3, '0')}` : undefined;
  const types: string[] = pokemon.types ?? [];
  const weightKg = pokemon.weight ? pokemon.weight / 10 : null;
  const heightM = pokemon.height ? pokemon.height / 10 : null;

  const abilities = (pokemon.abilities ?? [])
    .map((a: any) => a?.ability?.name)
    .filter(Boolean)
    .slice(0, 2);

  const description = `${pokemon.name} is a ${types.join(' / ') || 'mysterious'} type Pokémon.`;
  const primaryTypeColor = getTypeColor(types[0]);

  const mainImage: string | undefined = pokemon.main_image || imageSrc;
  const extraImages: string[] =
    pokemon.images && Array.isArray(pokemon.images)
      ? pokemon.images.filter((src: string) => src && src !== mainImage)
      : [];

  const images: string[] = [mainImage, ...extraImages].filter(Boolean) as string[];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currentImageSrc = images[Math.min(currentImageIndex, images.length - 1)];

  const canGoPrev = currentImageIndex > 0;
  const canGoNext = currentImageIndex < images.length - 1;

  const handlePrevImage = () => {
    if (!canGoPrev) return;
    setCurrentImageIndex((prev: number) => Math.max(0, prev - 1));
  };

  const handleNextImage = () => {
    if (!canGoNext) return;
    setCurrentImageIndex((prev: number) => Math.min(images.length - 1, prev + 1));
  };

  return (
    <div
      className={`min-h-screen ${backgroundClassName} flex flex-col relative`}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="absolute top-2 right-[-0.5rem] sm:top-4 sm:right-3 opacity-25 z-0">
        <AppImage
          src="/Pokeball.png"
          alt="Pokeball background"
          width={460}
          height={460}
          className="w-52 sm:w-64 md:w-80 lg:w-[22rem] object-contain"
        />
      </div>

      <div className="flex items-center justify-between px-6 pt-4 pb-2 text-white z-20 relative">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            ariaLabel="Voltar"
            onClick={onBack}
            imageSrc="/arrow.png"
            imageAlt="Back"
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-150 hover:scale-105 active:scale-100"
            imageClassName="w-6 h-6 sm:w-7 sm:h-7 object-contain"
          />
          {name && (
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold capitalize">
              {name}
            </h1>
          )}
        </div>

        {idLabel && (
          <span className="text-sm sm:text-base md:text-lg font-semibold">
            {idLabel}
          </span>
        )}
      </div>

      <div className="flex-1 flex items-end p-2">
        <div className="w-full mt-6 sm:mt-10 lg:mt-12 xl:mt-16">
          <div className="relative w-full bg-white rounded-3xl shadow-md border border-gray-200 flex flex-col items-center pb-6 px-4 min-h-[70vh] lg:min-h-[66vh] xl:min-h-[70vh]">
            <div className="-mt-10 sm:-mt-16 lg:-mt-20">
              <div className="w-32 h-20 sm:w-40 sm:h-24 lg:w-48 lg:h-28 flex items-center justify-center text-white font-bold">
                <AppImage
                  src={currentImageSrc}
                  alt={imageAlt}
                  width={256}
                  height={256}
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain"
                  loading="eager"
                  priority
                />
              </div>
            </div>

            {canGoPrev && (
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <ChevronIcon
                  direction="left"
                  onClick={handlePrevImage}
                  ariaLabel="Imagem anterior"
                  className="bg-white/80 text-gray-700 shadow-md hover:bg-white"
                />
              </div>
            )}

            {canGoNext && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <ChevronIcon
                  direction="right"
                  onClick={handleNextImage}
                  ariaLabel="Próxima imagem"
                  className="bg-white/80 text-gray-700 shadow-md hover:bg-white"
                />
              </div>
            )}

            <div className="mt-10 flex flex-col items-center gap-2 text-gray-800 text-center">
              <div className="flex items-center gap-4">
                {types.map((type: string) => (
                  <Badge
                    key={type}
                    text={type.charAt(0).toUpperCase() + type.slice(1)}
                    color={getTypeColor(type)}
                  />
                ))}
              </div>

              <AboutSection
                weightKg={weightKg}
                heightM={heightM}
                abilities={abilities}
                description={description}
                accentColor={primaryTypeColor}
              />

              <BaseStatsSection
                stats={pokemon.stats ?? []}
                accentColor={primaryTypeColor}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
