import { Test, TestingModule } from '@nestjs/testing';
import { GetPokemonDetailUseCase, GetPokemonDetailCommand } from './GetPokemonDetailUseCase';
import { POKEMON_GATEWAY_TOKEN, PokemonGateway } from '../../domain/gateways/PokemonGateway';
import { PokemonDetail } from '../../domain/types';

describe('GetPokemonDetailUseCase', () => {
  let useCase: GetPokemonDetailUseCase;
  let gateway: jest.Mocked<PokemonGateway>;

  beforeEach(async () => {
    const gatewayMock: Partial<jest.Mocked<PokemonGateway>> = {
      getPokemonDetail: jest.fn(),
      getPokemonList: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPokemonDetailUseCase,
        { provide: POKEMON_GATEWAY_TOKEN, useValue: gatewayMock },
      ],
    }).compile();

    useCase = module.get(GetPokemonDetailUseCase);
    gateway = module.get(POKEMON_GATEWAY_TOKEN);
  });

  it('should delegate to gateway.getPokemonDetail and return result', async () => {
    const command: GetPokemonDetailCommand = { id: 1 };

    const detail: PokemonDetail = {
      id: 1,
      name: 'bulbasaur',
      main_image: 'bulba.png',
    } as PokemonDetail;

    gateway.getPokemonDetail.mockResolvedValue(detail);

    const result = await useCase.execute(command);

    expect(gateway.getPokemonDetail).toHaveBeenCalledTimes(1);
    expect(gateway.getPokemonDetail).toHaveBeenCalledWith(1);
    expect(result).toBe(detail);
  });
});
