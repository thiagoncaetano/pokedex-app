import { Test, TestingModule } from '@nestjs/testing';
import { GetPokemonBasicInfoUseCase, GetPokemonBasicInfoCommand } from './GetPokemonBasicInfoUseCase';
import { POKEMON_GATEWAY_TOKEN, PokemonGateway } from '../../domain/gateways/PokemonGateway';
import { PokemonDetail, PokemonBasicDetail } from '../../domain/types';

describe('GetPokemonBasicInfoUseCase', () => {
  let useCase: GetPokemonBasicInfoUseCase;
  let gateway: jest.Mocked<PokemonGateway>;

  beforeEach(async () => {
    const gatewayMock: Partial<jest.Mocked<PokemonGateway>> = {
      getPokemonDetail: jest.fn(),
      getPokemonList: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPokemonBasicInfoUseCase,
        { provide: POKEMON_GATEWAY_TOKEN, useValue: gatewayMock },
      ],
    }).compile();

    useCase = module.get(GetPokemonBasicInfoUseCase);
    gateway = module.get(POKEMON_GATEWAY_TOKEN);
  });

  it('should return basic info when detail exists', async () => {
    const command: GetPokemonBasicInfoCommand = { param: 25 };

    const detail: PokemonDetail = {
      id: 25,
      name: 'pikachu',
      main_image: 'pikachu.png',
    } as PokemonDetail;

    gateway.getPokemonDetail.mockResolvedValue(detail);

    const result = await useCase.execute(command);

    expect(gateway.getPokemonDetail).toHaveBeenCalledTimes(1);
    expect(gateway.getPokemonDetail).toHaveBeenCalledWith(25);

    const expected: PokemonBasicDetail = {
      id: 25,
      name: 'pikachu',
      image: 'pikachu.png',
    } as PokemonBasicDetail;

    expect(result).toEqual(expected);
  });

  it('should return null when detail does not exist', async () => {
    const command: GetPokemonBasicInfoCommand = { param: 'missing' };

    gateway.getPokemonDetail.mockResolvedValue(null);

    const result = await useCase.execute(command);

    expect(gateway.getPokemonDetail).toHaveBeenCalledTimes(1);
    expect(gateway.getPokemonDetail).toHaveBeenCalledWith('missing');
    expect(result).toBeNull();
  });
});
