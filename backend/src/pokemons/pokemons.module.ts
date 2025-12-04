import { Module } from '@nestjs/common';
import { PokemonsController } from './presentation/http/pokemons.controller';
import { ListPokemonsUseCase } from './application/use-cases/ListPokemonsUseCase';
import { GetPokemonDetailUseCase } from './application/use-cases/GetPokemonDetailUseCase';
import { GetPokemonsBasicInfosUseCase } from './application/use-cases/GetPokemonsBasicInfosUseCase';
import { GetPokemonsByInfiniteScrollUseCase } from './application/use-cases/GetPokemonsByInfiniteScrollUseCase';
import { PokeApiAdapter } from './infrastructure/adapters/PokeApiAdapter';
import { POKEMON_GATEWAY_TOKEN } from './domain/gateways/PokemonGateway';

@Module({
  controllers: [PokemonsController],
  providers: [
    ListPokemonsUseCase,
    GetPokemonDetailUseCase,
    GetPokemonsBasicInfosUseCase,
    GetPokemonsByInfiniteScrollUseCase,
    {
      provide: POKEMON_GATEWAY_TOKEN,
      useClass: PokeApiAdapter,
    },
  ],
})
export class PokemonsModule {}
