export interface PokemonBasicDetail {
  id: number;
  name: string;
  image: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  moves: PokemonMove[],
  stats: PokemonStat[],
  types: PokemonType[];
  abilities: PokemonAbility[];
  main_image: string;
  images: PokemonImages[];
}

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

export interface PokemonType {
  type: {
    name: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
  };
}

export interface PokemonSprites {
  front_default: string;
  front_shiny: string;
  back_default: string;
  back_shiny: string;
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

export interface PokemonListItem {
  id: number;
  name: string;
  url: string;
}

export interface PokemonFilters {
  page?: number;
  perPage?: number;
  query?: string;
  sortBy?: string;
}

export interface GetPokemonDetailCommand {
  id: number;
}

export interface GetPokemonsBasicInfosCommand {
  ids: number[];
}

export interface GetPokemonsCommand {
  filters: PokemonFilters;
}

export interface GetPokemonsResult {
  pagination: {
    page: number;
    count: number;
    perPage: number;
    totalPages: number;
  };
  results: PokemonBasicDetail[];
}

export interface PokemonStat {
  name: string;
  base_stat: number;
}

export type PokemonMove = string;

export type PokemonImages = string;

