import { Injectable } from '@nestjs/common';
import { PokemonGateway } from '../../domain/gateways/PokemonGateway';
import { PaginateEntity, PaginateParams } from '../../../common/pagination';
import { PokemonDetail, PokemonImages, PokemonMove, PokemonStat } from '@/pokemons/domain/types';

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

  async getPokemonDetail(param: number | string): Promise<PokemonDetail | null> {
    const response = await fetch(`${this.baseUrl}/pokemon/${param}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch pokemon detail: ${response.status}`);
    }

    const data = await response.json();

    const moves: PokemonMove[] = (data.moves ?? []).map((m: any) => m.move?.name).filter(Boolean);

    const stats: PokemonStat[] = (data.stats ?? []).map((s: any) => ({
      name: s.stat?.name,
      base_stat: s.base_stat,
    }));

    const types: string[] = (data.types ?? [])
      .map((t: any) => t.type?.name)
      .filter(Boolean);

    const images: PokemonImages[] = [];

    const collectSpriteUrls = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;

      Object.values(obj).forEach((value) => {
        if (!value) return;
        if (typeof value === 'string') {
          images.push(value);
        } else if (typeof value === 'object') {
          collectSpriteUrls(value);
        }
      });
    };

    collectSpriteUrls(data.sprites);

    const mainImage: string =
      data.sprites?.other?.['official-artwork']?.front_default ??
      data.sprites?.front_default ??
      images[0] ??
      '';

    return {
      id: data.id,
      name: data.name,
      height: data.height,
      weight: data.weight,
      types,
      moves,
      stats,
      abilities: data.abilities,
      main_image: mainImage,
      images,
    };
  }
}
