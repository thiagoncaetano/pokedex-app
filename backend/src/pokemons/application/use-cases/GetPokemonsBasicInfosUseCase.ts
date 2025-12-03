import { Injectable, Inject } from '@nestjs/common';
import type { PokemonGateway } from '../../domain/gateways/PokemonGateway';
import { POKEMON_GATEWAY_TOKEN } from '../../domain/gateways/PokemonGateway';

export interface GetPokemonsBasicInfosCommand {
  ids: number[];
}

@Injectable()
export class GetPokemonsBasicInfosUseCase {
  constructor(
    @Inject(POKEMON_GATEWAY_TOKEN) private readonly pokemonGateway: PokemonGateway
  ) {}

  async execute(command: GetPokemonsBasicInfosCommand) {
    const { ids } = command;
    const promises = ids.map(id => this.pokemonGateway.getPokemonDetail(id));
    const results = await Promise.all(promises);
    
    return results.filter(result => result !== null);
  }
}
