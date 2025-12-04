import { Module } from '@nestjs/common';
import { PokemonsController } from './presentation/http/pokemons.controller';
import { ListPokemonsUseCase } from './application/use-cases/ListPokemonsUseCase';
import { GetPokemonDetailUseCase } from './application/use-cases/GetPokemonDetailUseCase';
import { GetPokemonsBasicInfosUseCase } from './application/use-cases/GetPokemonsBasicInfosUseCase';
import { PokeApiAdapter } from './infrastructure/adapters/PokeApiAdapter';
import { POKEMON_GATEWAY_TOKEN } from './domain/gateways/PokemonGateway';
import { GetPokemonBasicInfoUseCase } from './application/use-cases/GetPokemonBasicInfoUseCase';
import { GetPokemonsUseCase } from './application/use-cases/GetPokemonsUseCase';

@Module({
  controllers: [PokemonsController],
  providers: [
    GetPokemonsUseCase,
    ListPokemonsUseCase,
    GetPokemonDetailUseCase,
    GetPokemonsBasicInfosUseCase,
    GetPokemonBasicInfoUseCase,
    {
      provide: POKEMON_GATEWAY_TOKEN,
      useClass: PokeApiAdapter,
    },
  ],
})
export class PokemonsModule {}
