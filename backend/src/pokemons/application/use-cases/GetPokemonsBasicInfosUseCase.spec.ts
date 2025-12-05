import { Test, TestingModule } from '@nestjs/testing';
import { GetPokemonsBasicInfosUseCase, GetPokemonsBasicInfosCommand } from './GetPokemonsBasicInfosUseCase';
import { POKEMON_GATEWAY_TOKEN, PokemonGateway } from '../../domain/gateways/PokemonGateway';
import { PokemonDetail } from '../../domain/types';

describe('GetPokemonsBasicInfosUseCase', () => {
  let useCase: GetPokemonsBasicInfosUseCase;
  let gateway: jest.Mocked<PokemonGateway>;

  beforeEach(async () => {
    const gatewayMock: Partial<jest.Mocked<PokemonGateway>> = {
      getPokemonDetail: jest.fn(),
      getPokemonList: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPokemonsBasicInfosUseCase,
        { provide: POKEMON_GATEWAY_TOKEN, useValue: gatewayMock },
      ],
    }).compile();

    useCase = module.get(GetPokemonsBasicInfosUseCase);
    gateway = module.get(POKEMON_GATEWAY_TOKEN);
  });

  it('should fetch details for all ids and filter out null results', async () => {
    const command: GetPokemonsBasicInfosCommand = { ids: [1, 2, 3] };

    const detail1: PokemonDetail = { id: 1, name: 'bulbasaur', main_image: 'b.png' } as PokemonDetail;
    const detail2: PokemonDetail = { id: 2, name: 'ivysaur', main_image: 'i.png' } as PokemonDetail;

    gateway.getPokemonDetail
      .mockResolvedValueOnce(detail1)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(detail2);

    const result = await useCase.execute(command);

    expect(gateway.getPokemonDetail).toHaveBeenCalledTimes(3);
    expect(gateway.getPokemonDetail).toHaveBeenNthCalledWith(1, 1);
    expect(gateway.getPokemonDetail).toHaveBeenNthCalledWith(2, 2);
    expect(gateway.getPokemonDetail).toHaveBeenNthCalledWith(3, 3);

    expect(result).toEqual([detail1, detail2]);
  });
});
