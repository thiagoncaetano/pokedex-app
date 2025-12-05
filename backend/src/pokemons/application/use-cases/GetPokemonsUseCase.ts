import { Injectable } from '@nestjs/common';
import { ListPokemonsUseCase } from './ListPokemonsUseCase';
import { GetPokemonsBasicInfosUseCase } from './GetPokemonsBasicInfosUseCase';
import { PaginateEntity, PaginateParams } from '../../../common/pagination';
import { PokemonBasicDetail } from '@/pokemons/domain/types';

export interface GetPokemonsCommand {
  pagination: PaginateParams;
  ids?: number[];
}

export interface GetPokemonsResult {
  pagination: PaginateEntity;
  results: PokemonBasicDetail[];
}

@Injectable()
export class GetPokemonsUseCase {
  constructor(
    private readonly listPokemonsUseCase: ListPokemonsUseCase,
    private readonly getPokemonsBasicInfosUseCase: GetPokemonsBasicInfosUseCase
  ) {}

  async execute(command: GetPokemonsCommand): Promise<GetPokemonsResult> {
    const listResult = await this.listPokemonsUseCase.execute({
      pagination: command.pagination
    });

    const listIds = listResult.results.map(pokemon => pokemon.id);
    
    const allIds = [...new Set([...listIds, ...(command.ids || [])])];

    const basicInfos = await this.getPokemonsBasicInfosUseCase.execute({ ids: allIds });

    return {
      pagination: {
        page: listResult.pagination.page,
        count: listResult.pagination.count,
        perPage: listResult.pagination.perPage,
        totalPages: listResult.pagination.totalPages
      },
      results: basicInfos.map(basicInfo => ({
        id: basicInfo.id,
        name: basicInfo.name,
        image: basicInfo.main_image
      }))
    };
  }
}
