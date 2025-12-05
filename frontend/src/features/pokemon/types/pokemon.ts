export interface BasicPokemon {
  id: number;
  name: string;
  image: string;
}

export interface PokemonFilters {
  page: number;
  perPage?: number;
  query?: string;
  sortBy?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PokemonListItem {
  id: number;
  name: string;
  url: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  moves: string[],
  stats: PokemonStat[],
  types: string[];
  abilities: PokemonAbility[];
  main_image: string;
  images: string[];
}

export interface PokemonStat {
  name: string;
  base_stat: number;
}

export interface PokemonAbility {
  ability: {
    name: string;
  };
}

export interface PokemonListResponse {
  pagination: {
    page: number;
    total: number;
    totalPages: number;
    perPage: number;
  };
  results: BasicPokemon[];
}