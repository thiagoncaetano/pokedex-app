import { lightenColor } from '../utils/getTypeColor';

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SATK',
  'special-defense': 'SDEF',
  speed: 'SPD',
};

const MAX_BASE_STAT = 255;

interface BaseStatsSectionProps {
  stats: Array<{ name: string; base_stat: number }>;
  accentColor?: string;
}

export function BaseStatsSection({ stats, accentColor }: BaseStatsSectionProps) {
  return (
    <section className="w-full mt-4 sm:mt-6 flex flex-col gap-4">
      <h2
        className="text-center text-base sm:text-lg font-bold"
        style={accentColor ? { color: accentColor } : undefined}
      >
        Base Stats
      </h2>

      <div className="space-y-2 sm:space-y-3">
        {stats.map((stat) => {
          const label = STAT_LABELS[stat.name] ?? stat.name.toUpperCase();
          const value = stat.base_stat ?? 0;
          const percentage = Math.max(0, Math.min(100, (value / MAX_BASE_STAT) * 100));

          return (
            <div key={stat.name} className="flex items-center gap-2 sm:gap-3">
              <div
                className="w-12 sm:w-14 text-xs sm:text-sm font-bold text-right"
                style={accentColor ? { color: accentColor } : undefined}
              >
                {label}
              </div>
              <div className="w-10 text-xs sm:text-sm font-mono text-gray-700">
                {String(value).padStart(3, '0')}
              </div>
              <div
                className="flex-1 h-2 sm:h-2.5 rounded-full overflow-hidden"
                style={{
                  backgroundColor: accentColor ? lightenColor(accentColor, 0.75) : '#bbf7d0',
                }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${percentage}%`, backgroundColor: accentColor || '#16a34a' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
