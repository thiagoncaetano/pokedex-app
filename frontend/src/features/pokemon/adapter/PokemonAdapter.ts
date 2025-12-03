import { Pokemon } from '../types/pokemon';
import { routes } from '@/routes';

export class PokemonAdapter {
  async getBasicInfosByIds(ids: number[]): Promise<Pokemon[]> {
    const response = await fetch(routes.api.pokemons.basic_infos, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch pokemon basic infos');
    }

    return response.json();
  }

  async getDetailById(id: number): Promise<Pokemon> {
    const response = await fetch(routes.api.pokemons.detail(id));

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch pokemon detail');
    }

    return response.json();
  }
}
