import { PaginateEntity, PaginateParams } from '../../../common/pagination';
import { PokemonDetail } from '../types';

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

  getPokemonDetail(param: number|string): Promise<PokemonDetail | null>;
}

export const POKEMON_GATEWAY_TOKEN = 'PokemonGateway';
