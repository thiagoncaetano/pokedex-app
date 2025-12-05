import { Test, TestingModule } from '@nestjs/testing';
import { ListPokemonsUseCase, ListPokemonsCommand, ListPokemonsResult } from './ListPokemonsUseCase';
import { POKEMON_GATEWAY_TOKEN, PokemonGateway } from '../../domain/gateways/PokemonGateway';
import { PaginateEntity } from '../../../common/pagination';

describe('ListPokemonsUseCase', () => {
  let useCase: ListPokemonsUseCase;
  let gateway: jest.Mocked<PokemonGateway>;

  beforeEach(async () => {
    const gatewayMock: Partial<jest.Mocked<PokemonGateway>> = {
      getPokemonDetail: jest.fn(),
      getPokemonList: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListPokemonsUseCase,
        { provide: POKEMON_GATEWAY_TOKEN, useValue: gatewayMock },
      ],
    }).compile();

    useCase = module.get(ListPokemonsUseCase);
    gateway = module.get(POKEMON_GATEWAY_TOKEN);
  });

  it('should delegate to gateway.getPokemonList and return its result', async () => {
    const command: ListPokemonsCommand = {
      pagination: { page: 1, perPage: 20 } as any,
    };

    const pagination: PaginateEntity = {
      page: 1,
      perPage: 20,
      count: 20,
      totalPages: 5,
    };

    const listResult: ListPokemonsResult = {
      pagination,
      results: [
        { id: 1, name: 'bulbasaur', url: '/pokemon/1' },
        { id: 2, name: 'ivysaur', url: '/pokemon/2' },
      ],
    };

    gateway.getPokemonList.mockResolvedValue(listResult);

    const result = await useCase.execute(command);

    expect(gateway.getPokemonList).toHaveBeenCalledTimes(1);
    expect(gateway.getPokemonList).toHaveBeenCalledWith({
      pagination: command.pagination,
    });
    expect(result).toBe(listResult);
  });
});
