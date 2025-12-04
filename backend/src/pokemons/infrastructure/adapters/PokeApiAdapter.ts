import { Injectable } from '@nestjs/common';
import { PokemonGateway } from '../../domain/gateways/PokemonGateway';
import { PaginateEntity, PaginateParams } from '../../../common/pagination';

@Injectable()
export class PokeApiAdapter implements PokemonGateway {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  async getPokemonList(filters: {
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
  }> {
    const page = filters.pagination.page;
    const perPage = filters.pagination.perPage;
    const offset = (page - 1) * perPage;
    
    // Fetch from PokeAPI
    const response = await fetch(`${this.baseUrl}/pokemon?limit=${perPage}&offset=${offset}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from PokeAPI: ${response.status}`);
    }
    
    const data = await response.json();
    
    const results = data.results.map((pokemon: any, index: number) => ({
      id: offset + index + 1,
      name: pokemon.name,
      url: pokemon.url,
    }));
    
    const totalCount = data.count;
    const pagination = new PaginateEntity(page, totalCount, perPage);
    
    return {
      pagination,
      results,
    };
  }

  async getPokemonDetail(param: number|string): Promise<{
    id: number;
    name: string;
    height: number;
    weight: number;
    types: Array<{ type: { name: string } }>;
    abilities: Array<{ ability: { name: string } }>;
    sprites: {
      front_default: string;
      front_shiny: string;
      back_default: string;
      back_shiny: string;
    };
  } | null> {
    const response = await fetch(`${this.baseUrl}/pokemon/${param}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch pokemon detail: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      height: data.height,
      weight: data.weight,
      types: data.types,
      abilities: data.abilities,
      sprites: {
        front_default: data.sprites.front_default,
        front_shiny: data.sprites.front_shiny || '',
        back_default: data.sprites.back_default || '',
        back_shiny: data.sprites.back_shiny || '',
      },
    };
  }
}
