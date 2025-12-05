interface AboutSectionProps {
  weightKg: number | null;
  heightM: number | null;
  abilities: string[];
  description: string;
  accentColor?: string;
}

export function AboutSection({ weightKg, heightM, abilities, description, accentColor }: AboutSectionProps) {
  const abilitiesText = abilities.length > 0 ? abilities.join(' / ') : 'Unknown';

  return (
    <section className="w-full mt-3 sm:mt-4 flex flex-col gap-4 sm:gap-5">
      <h2
        className="text-center text-base sm:text-lg font-bold"
        style={accentColor ? { color: accentColor } : undefined}
      >
        About
      </h2>

      <div className="flex flex-row items-stretch justify-between text-sm sm:text-base text-gray-700 gap-4">
        <div className="flex-1 flex flex-col items-center justify-center gap-1 border-r border-gray-200 pr-2 sm:pr-4">
          <span className="font-medium">{weightKg ? `${weightKg.toFixed(1)} kg` : '--'}</span>
          <span
            className="text-xs text-gray-500"
            style={accentColor ? { color: accentColor } : undefined}
          >
            Weight
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-1 border-r border-gray-200 px-2 sm:px-4">
          <span className="font-medium">{heightM ? `${heightM.toFixed(1)} m` : '--'}</span>
          <span
            className="text-xs text-gray-500"
            style={accentColor ? { color: accentColor } : undefined}
          >
            Height
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-1 pl-2 sm:pl-4">
          <span className="font-medium text-center">
            {abilitiesText}
          </span>
          <span
            className="text-xs text-gray-500"
            style={accentColor ? { color: accentColor } : undefined}
          >
            Abilities
          </span>
        </div>
      </div>

      <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed text-center mt-3">
        {description}
      </p>
    </section>
  );
}
