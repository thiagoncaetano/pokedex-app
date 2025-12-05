import { PokeApiAdapter } from './PokeApiAdapter';
import { PaginateEntity } from '../../../common/pagination';
import { PokemonDetail } from '@/pokemons/domain/types';

declare const global: any;

describe('PokeApiAdapter', () => {
  let adapter: PokeApiAdapter;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    adapter = new PokeApiAdapter();
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getPokemonList', () => {
    it('should call PokeAPI with correct pagination and map response', async () => {
      const page = 2;
      const perPage = 10;
      const offset = (page - 1) * perPage; // 10

      const apiResponse = {
        count: 100,
        results: [
          { name: 'bulbasaur', url: 'url-1' },
          { name: 'ivysaur', url: 'url-2' },
        ],
      };

      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => apiResponse,
      });

      const result = await adapter.getPokemonList({
        pagination: { page, perPage } as any,
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        `https://pokeapi.co/api/v2/pokemon?limit=${perPage}&offset=${offset}`,
      );

      expect(result.pagination).toBeInstanceOf(PaginateEntity);
      expect(result.pagination.page).toBe(page);
      expect(result.pagination.perPage).toBe(perPage);
      expect(result.pagination.count).toBe(apiResponse.count);

      expect(result.results).toEqual([
        { id: offset + 1, name: 'bulbasaur', url: 'url-1' },
        { id: offset + 2, name: 'ivysaur', url: 'url-2' },
      ]);
    });

    it('should throw error when PokeAPI returns non-ok status', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(
        adapter.getPokemonList({ pagination: { page: 1, perPage: 20 } as any }),
      ).rejects.toThrow('Failed to fetch from PokeAPI: 500');
    });
  });

  describe('getPokemonDetail', () => {
    it('should return mapped PokemonDetail when response is ok', async () => {
      const apiResponse = {
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60,
        types: [
          { type: { name: 'electric' } },
        ],
        moves: [
          { move: { name: 'thunderbolt' } },
          { move: { name: 'quick-attack' } },
        ],
        stats: [
          { stat: { name: 'hp' }, base_stat: 35 },
          { stat: { name: 'attack' }, base_stat: 55 },
        ],
        abilities: ['static'],
        sprites: {
          front_default: 'front.png',
          other: {
            'official-artwork': {
              front_default: 'official.png',
            },
          },
        },
      };

      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => apiResponse,
      });

      const result = (await adapter.getPokemonDetail(25)) as PokemonDetail;

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25');

      expect(result).toBeDefined();
      expect(result.id).toBe(25);
      expect(result.name).toBe('pikachu');
      expect(result.height).toBe(4);
      expect(result.weight).toBe(60);
      expect(result.types).toEqual(['electric']);
      expect(result.moves).toEqual(['thunderbolt', 'quick-attack']);
      expect(result.stats).toEqual([
        { name: 'hp', base_stat: 35 },
        { name: 'attack', base_stat: 55 },
      ]);
      expect(result.abilities).toEqual(apiResponse.abilities);
      expect(result.main_image).toBe('official.png');
      expect(result.images.length).toBeGreaterThan(0);
      expect(result.images).toContain('official.png');
    });

    it('should return null when response status is 404', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 404,
      });

      const result = await adapter.getPokemonDetail('missing');

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/missing');
      expect(result).toBeNull();
    });

    it('should throw error when response is not ok and not 404', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(adapter.getPokemonDetail(1)).rejects.toThrow(
        'Failed to fetch pokemon detail: 500',
      );
    });
  });
});
