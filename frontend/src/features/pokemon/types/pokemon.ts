export interface Pokemon {
  id: number;
  name: string;
  number: number;
  types: string[];
  imageUrl: string;
  height?: number;
  weight?: number;
  abilities?: string[];
}

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

export interface PokemonWithDetails extends PokemonListItem {
  details?: {
    height: number;
    weight: number;
    types: Array<{ type: { name: string } }>;
    abilities: Array<{ ability: { name: string } }>;
    sprites: {
      front_default: string;
    };
  };
  loading?: boolean;
}

export interface PokemonListResponse {
  pagination: {
    page: number;
    total: number;
    totalPages: number;
    perPage: number;
  };
  results: PokemonListItem[];
}