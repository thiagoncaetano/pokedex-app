import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ListPokemonsUseCase, type ListPokemonsCommand } from '../../application/use-cases/ListPokemonsUseCase';
import { GetPokemonDetailUseCase } from '../../application/use-cases/GetPokemonDetailUseCase';
import { GetPokemonsBasicInfosUseCase } from '../../application/use-cases/GetPokemonsBasicInfosUseCase';
import { PokemonBasicInfoPresenter } from './pokemon.presenter';
import type { PokemonDetail, PokemonBasicDetail,  PokemonListItem } from '../../domain/types';
import { PaginateParams } from '../../../common/pagination';

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
    private readonly listPokemonsUseCase: ListPokemonsUseCase,
    private readonly getPokemonDetailUseCase: GetPokemonDetailUseCase,
    private readonly getPokemonsBasicInfosUseCase: GetPokemonsBasicInfosUseCase
  ) {}

  @Get("initial")
  async getPokemons(@Query() query: any): Promise<any> {
    const command: ListPokemonsCommand = {
      pagination: new PaginateParams(query.page)
    };

    return this.listPokemonsUseCase.execute(command);
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

  @Post('basic_infos')
  async getBasicInfosByIds(@Body() body: { ids: number[] }): Promise<PokemonBasicDetail[]> {
    const result = await this.getPokemonsBasicInfosUseCase.execute({ ids: body.ids });
    return PokemonBasicInfoPresenter.presentBasicInfos(result);
  }
}
