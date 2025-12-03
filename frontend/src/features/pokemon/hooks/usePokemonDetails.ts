import { useQuery } from '@tanstack/react-query';

interface PokemonDetailsResponse {
  id: number;
  name: string;
  types: string[];
  imageUrl: string;
  height: number;
  weight: number;
  abilities: string[];
}

export function usePokemonDetails() {
  const getBasicInfosByIds = (ids: number[]) => {
    return useQuery({
      queryKey: ['pokemon-basic-infos', ids],
      queryFn: async () => {
        const response = await fetch('/api/pokemons/details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch pokemon basic infos');
        }

        return response.json() as Promise<PokemonDetailsResponse[]>;
      },
      enabled: ids.length > 0,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  const getDetailById = (id: number) => {
    return useQuery({
      queryKey: ['pokemon-detail', id],
      queryFn: async () => {
        const response = await fetch(`/api/pokemons/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch pokemon detail');
        }

        return response.json() as Promise<PokemonDetailsResponse>;
      },
      enabled: !!id,
      staleTime: 30 * 60 * 1000, // 30 minutes
    });
  };

  return {
    getBasicInfosByIds,
    getDetailById,
  };
}
