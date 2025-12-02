export const createPageTitle = (page: string) => `Pokédex - ${page}`;

export const pageDescriptions = {
  login: 'Sign in to Pokédex to start your journey.',
  home: 'Welcome back to Pokédex! Explore Pokémon, battles, and more.',
  error: 'Something went wrong. Click below to continue.',
  detail: (name?: string) => `Explore details of ${name || 'a Pokémon'}.`,
} as const;
