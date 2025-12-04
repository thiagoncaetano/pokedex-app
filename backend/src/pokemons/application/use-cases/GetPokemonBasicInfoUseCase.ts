import { Injectable, Inject } from '@nestjs/common';
import type { PokemonGateway } from '../../domain/gateways/PokemonGateway';
import { POKEMON_GATEWAY_TOKEN } from '../../domain/gateways/PokemonGateway';
import { PokemonBasicDetail } from 'src/pokemons/domain/types';

export interface GetPokemonBasicInfoCommand {
  param: number|string;
}

@Injectable()
export class GetPokemonBasicInfoUseCase {
  constructor(
    @Inject(POKEMON_GATEWAY_TOKEN) private readonly pokemonGateway: PokemonGateway
  ) {}

  async execute(command: GetPokemonBasicInfoCommand): Promise<PokemonBasicDetail | null> {
    const { param } = command;
    const detail = await this.pokemonGateway.getPokemonDetail(param);
    
    if (!detail) return null;

    const basic: PokemonBasicDetail = {
      id: detail.id,
      name: detail.name,
      image: detail.sprites.front_default,
    };

    return basic;
  }
}
