import { PokemonListResponse } from '@/features/pokemon/types/pokemon';
import { API_URL } from '@/shared/constants/url';

export class PokemonGateway {
  static async getPokemons(token: string): Promise<PokemonListResponse> {
    const response = await fetch(`${API_URL}/pokemons/initial`, {
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
