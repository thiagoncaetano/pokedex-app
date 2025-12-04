import { Injectable } from '@nestjs/common';
import { ListPokemonsUseCase } from './ListPokemonsUseCase';
import { GetPokemonsBasicInfosUseCase } from './GetPokemonsBasicInfosUseCase';
import { PaginateEntity, PaginateParams } from '../../../common/pagination';
import type { PokemonBasicDetail } from '../../domain/types';

export interface GetPokemonsByInfiniteScrollCommand {
  pagination: PaginateParams;
}

export interface GetPokemonsByInfiniteScrollResult {
  pagination: PaginateEntity;
  results: PokemonBasicDetail[];
}

@Injectable()
export class GetPokemonsByInfiniteScrollUseCase {
  constructor(
    private readonly listPokemonsUseCase: ListPokemonsUseCase,
    private readonly getPokemonsBasicInfosUseCase: GetPokemonsBasicInfosUseCase
  ) {}

  async execute(command: GetPokemonsByInfiniteScrollCommand): Promise<GetPokemonsByInfiniteScrollResult> {
    const listResult = await this.listPokemonsUseCase.execute({
      pagination: command.pagination
    });

    const ids = listResult.results.map(pokemon => pokemon.id);

    const basicInfos = await this.getPokemonsBasicInfosUseCase.execute({ ids });

    return {
      pagination: {
        page: listResult.pagination.page,
        count: listResult.pagination.count,
        perPage: listResult.pagination.perPage,
        totalPages: listResult.pagination.totalPages
      },
      results: basicInfos
    };
  }
}
