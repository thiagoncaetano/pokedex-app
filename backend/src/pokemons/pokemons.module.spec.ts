import 'reflect-metadata';
import { PokemonsModule } from './pokemons.module';
import { PokemonsController } from './presentation/http/pokemons.controller';
import { GetPokemonsUseCase } from './application/use-cases/GetPokemonsUseCase';
import { ListPokemonsUseCase } from './application/use-cases/ListPokemonsUseCase';
import { GetPokemonDetailUseCase } from './application/use-cases/GetPokemonDetailUseCase';
import { GetPokemonsBasicInfosUseCase } from './application/use-cases/GetPokemonsBasicInfosUseCase';
import { GetPokemonBasicInfoUseCase } from './application/use-cases/GetPokemonBasicInfoUseCase';
import { PokeApiAdapter } from './infrastructure/adapters/PokeApiAdapter';
import { POKEMON_GATEWAY_TOKEN } from './domain/gateways/PokemonGateway';

describe('PokemonsModule', () => {
  it('should be defined', () => {
    expect(PokemonsModule).toBeDefined();
  });

  it('should register PokemonsController', () => {
    const controllers = Reflect.getMetadata('controllers', PokemonsModule) || [];
    expect(controllers).toEqual(expect.arrayContaining([PokemonsController]));
  });

  it('should provide all pokemon use cases and gateway provider', () => {
    const providers = Reflect.getMetadata('providers', PokemonsModule) || [];

    expect(providers).toEqual(
      expect.arrayContaining([
        GetPokemonsUseCase,
        ListPokemonsUseCase,
        GetPokemonDetailUseCase,
        GetPokemonsBasicInfosUseCase,
        GetPokemonBasicInfoUseCase,
      ]),
    );

    // provider registrado com token POKEMON_GATEWAY_TOKEN
    expect(
      providers,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ provide: POKEMON_GATEWAY_TOKEN, useClass: PokeApiAdapter }),
      ]),
    );
  });
});
