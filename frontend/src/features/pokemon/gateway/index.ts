import { PokemonFilters, PokemonListResponse } from '@/shared/types/pokemon';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export class PokemonGateway {
  static async getPokemons(filters: PokemonFilters, token: string): Promise<PokemonListResponse> {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', String(filters.page));
    if (filters.perPage) params.append('perPage', String(filters.perPage));
    if (filters.query) params.append('query', filters.query);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const response = await fetch(`${API_URL}/pokemons?${params.toString()}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch pokemons: ${response.status}`);
    }

    return response.json();
  }

  static async getPokemonDetails(id: number, token: string): Promise<any> {
    const response = await fetch(`${API_URL}/pokemons/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch pokemon details: ${response.status}`);
    }

    return response.json();
  }
}
