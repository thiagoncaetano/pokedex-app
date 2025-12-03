import { Injectable, Inject } from '@nestjs/common';
import type { PokemonGateway } from '../../domain/gateways/PokemonGateway';
import { POKEMON_GATEWAY_TOKEN } from '../../domain/gateways/PokemonGateway';
import { PaginateEntity, PaginateParams } from '../../../common/pagination';

export interface ListPokemonsCommand {
  pagination: PaginateParams;
  query?: string;
  sortBy?: string;
}

export interface ListPokemonsResult {
  pagination: PaginateEntity;
  results: Array<{
    id: number;
    name: string;
    url: string;
  }>;
}

@Injectable()
export class ListPokemonsUseCase {
  constructor(
    @Inject(POKEMON_GATEWAY_TOKEN) private readonly pokemonGateway: PokemonGateway
  ) {}

  async execute(command: ListPokemonsCommand): Promise<ListPokemonsResult> {
    return this.pokemonGateway.getPokemonList({
      pagination: command.pagination,
      query: command.query,
      sortBy: command.sortBy,
    });
  }
}
