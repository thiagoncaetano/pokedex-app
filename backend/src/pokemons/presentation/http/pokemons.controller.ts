import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ListPokemonsUseCase } from '../../application/use-cases/ListPokemonsUseCase';
import { GetPokemonDetailUseCase } from '../../application/use-cases/GetPokemonDetailUseCase';
import { GetPokemonsBasicInfosUseCase } from '../../application/use-cases/GetPokemonsBasicInfosUseCase';
import { PaginateParams, PaginatePresenter } from '../../../common/pagination';

export interface PokemonListItem {
  id: number;
  name: string;
  url: string;
}

export interface PaginatedPokemonResponse {
  pagination: {
    page: number;
    total: number;
    totalPages: number;
    perPage: number;
  };
  results: PokemonListItem[];
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{ type: { name: string } }>;
  abilities: Array<{ ability: { name: string } }>;
  sprites: {
    front_default: string;
  };
}

@UseGuards(AuthGuard('jwt'))
@Controller('pokemons')
export class PokemonsController {
  constructor(
    private readonly listPokemonsUseCase: ListPokemonsUseCase,
    private readonly getPokemonDetailUseCase: GetPokemonDetailUseCase,
    private readonly getPokemonsBasicInfosUseCase: GetPokemonsBasicInfosUseCase
  ) {}

  @Get()
  async list(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query('query') query?: string,
    @Query('sortBy') sortBy?: string
  ): Promise<PaginatedPokemonResponse> {
    const paginateParams = new PaginateParams(page, perPage);
    
    const result = await this.listPokemonsUseCase.execute({
      pagination: paginateParams,
      query,
      sortBy,
    });
    
    return {
      pagination: PaginatePresenter.render(result.pagination),
      results: result.results,
    };
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<PokemonDetail> {
    const result = await this.getPokemonDetailUseCase.execute({ id: Number(id) });
    
    return result || {
      id: Number(id),
      name: '',
      height: 0,
      weight: 0,
      types: [],
      abilities: [],
      sprites: {
        front_default: '',
      },
    };
  }

  @Post('basic_infos')
  async getBasicInfosByIds(@Body() body: { ids: number[] }): Promise<PokemonDetail[]> {
    return this.getPokemonsBasicInfosUseCase.execute({ ids: body.ids });
  }
}
