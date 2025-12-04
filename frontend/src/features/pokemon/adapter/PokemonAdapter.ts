import { Pokemon, BasicPokemon, PokemonFilters, PokemonListResponse } from '../types/pokemon';
import { routes } from '@/routes';

export class PokemonAdapter {
  async getBasicInfosByParam(name: string): Promise<BasicPokemon | null> {
    const response = await fetch(routes.api.pokemons.getByParam(name));

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch pokemon by name');
    }

    const data = await response.json();
    return data;
  }

  async getDetailById(id: number): Promise<Pokemon> {
    const response = await fetch(routes.api.pokemons.detail(id));

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch pokemon detail');
    }

    return response.json();
  }

  async getInfinitePokemons(filters: PokemonFilters): Promise<PokemonListResponse> {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', String(filters.page));
    if (filters.perPage) params.append('perPage', String(filters.perPage));
    if (filters.query) params.append('query', filters.query);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const response = await fetch(`${routes.api.pokemons.list}?${params.toString()}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch pokemons');
    }

    return response.json();
  }
}
