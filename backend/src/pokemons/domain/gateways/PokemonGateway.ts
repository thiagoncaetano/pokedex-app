import { PaginateEntity, PaginateParams } from '../../../common/pagination';

export interface PokemonGateway {
  getPokemonList(filters: {
    pagination: PaginateParams;
    query?: string;
    sortBy?: string;
  }): Promise<{
    pagination: PaginateEntity;
    results: Array<{
      id: number;
      name: string;
      url: string;
    }>;
  }>;
  
  getPokemonDetail(id: number): Promise<{
    id: number;
    name: string;
    height: number;
    weight: number;
    types: Array<{ type: { name: string } }>;
    abilities: Array<{ ability: { name: string } }>;
    sprites: {
      front_default: string;
    };
  } | null>;
}

export const POKEMON_GATEWAY_TOKEN = 'PokemonGateway';
