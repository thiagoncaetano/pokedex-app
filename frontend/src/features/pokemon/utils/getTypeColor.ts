const TYPE_COLORS: Record<string, string> = {
  type: '#666666',
  normal: '#AAA67F',
  fighting: '#C12239',
  flying: '#A891EC',
  ground: '#DEC16B',
  poison: '#A43E9E',
  rock: '#B69E31',
  bug: '#A7B723',
  ghost: '#70559B',
  steel: '#B7B9D0',
  fire: '#F57D31',
  water: '#6493EB',
  grass: '#74CB48',
  electric: '#F9CF30',
  psychic: '#FB5584',
  ice: '#9AD6DF',
  dragon: '#7037FF',
  dark: '#75574C',
  fairy: '#E69EAC',
};

export function getTypeColor(type: string | undefined | null): string {
  if (!type) return TYPE_COLORS.type;

  const normalized = type.toLowerCase();
  return TYPE_COLORS[normalized] ?? TYPE_COLORS.type;
}

export function lightenColor(hex: string, amount: number): string {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return hex;

  const num = parseInt(normalized, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;

  const lighten = (channel: number) => {
    return Math.round(channel + (255 - channel) * amount);
  };

  const rl = lighten(r);
  const gl = lighten(g);
  const bl = lighten(b);

  const toHex = (channel: number) => channel.toString(16).padStart(2, '0');

  return `#${toHex(rl)}${toHex(gl)}${toHex(bl)}`;
}
