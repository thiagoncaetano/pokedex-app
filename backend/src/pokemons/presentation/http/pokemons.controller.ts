import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetPokemonDetailUseCase } from '../../application/use-cases/GetPokemonDetailUseCase';
import { PokemonBasicInfoPresenter } from './pokemon.presenter';
import type { PokemonDetail, PokemonBasicDetail,  PokemonListItem } from '../../domain/types';
import { PaginateParams } from '../../../common/pagination';
import { GetPokemonBasicInfoUseCase } from '@/pokemons/application/use-cases/GetPokemonBasicInfoUseCase';
import { GetPokemonsUseCase } from '@/pokemons/application/use-cases/GetPokemonsUseCase';

export interface PokemonResponse {
  pagination: {
    page: number;
    total: number;
    totalPages: number;
    perPage: number;
  };
  results: PokemonListItem[];
}

@UseGuards(AuthGuard('jwt'))
@Controller('pokemons')
export class PokemonsController {
  constructor(
    private readonly getPokemonsUseCase: GetPokemonsUseCase,
    private readonly getPokemonDetailUseCase: GetPokemonDetailUseCase,
    private readonly getPokemonBasicInfoUseCase: GetPokemonBasicInfoUseCase,
  ) {}

  @Post()
  async getPokemons(@Body() body: { ids: number[] }, @Query() query: any): Promise<any> {
    const result = await this.getPokemonsUseCase.execute({
      pagination: new PaginateParams(query.page),
      ids: body.ids
    });
    return {
      pagination: result.pagination,
      results: PokemonBasicInfoPresenter.presentBasicInfos(result.results)
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
        front_shiny: '',
        back_default: '',
        back_shiny: '',
      },
    };
  }

  @Get('basic_infos/:param')
  async getBasicInfosByParam(@Param('param') param: string): Promise<PokemonBasicDetail | null> {
    const result = await this.getPokemonBasicInfoUseCase.execute({ param });
    return result ? PokemonBasicInfoPresenter.presentBasicInfo(result) : null;
  }
}
