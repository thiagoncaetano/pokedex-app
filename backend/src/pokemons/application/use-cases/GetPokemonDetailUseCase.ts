import { Injectable, Inject } from '@nestjs/common';
import type { PokemonGateway } from '../../domain/gateways/PokemonGateway';
import { POKEMON_GATEWAY_TOKEN } from '../../domain/gateways/PokemonGateway';

export interface GetPokemonDetailCommand {
  id: number;
}

@Injectable()
export class GetPokemonDetailUseCase {
  constructor(
    @Inject(POKEMON_GATEWAY_TOKEN) private readonly pokemonGateway: PokemonGateway
  ) {}

  async execute(command: GetPokemonDetailCommand) {
    return this.pokemonGateway.getPokemonDetail(command.id);
  }
}
