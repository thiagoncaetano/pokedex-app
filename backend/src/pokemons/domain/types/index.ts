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
  types: string[];
  abilities: PokemonAbility[];
  main_image: string;
  images: PokemonImages[];
}

export interface PokemonAbility {
  ability: {
    name: string;
  };
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

