import { Test, TestingModule } from '@nestjs/testing';
import { GetPokemonsUseCase, GetPokemonsCommand, GetPokemonsResult } from './GetPokemonsUseCase';
import { ListPokemonsUseCase, ListPokemonsResult } from './ListPokemonsUseCase';
import { GetPokemonsBasicInfosUseCase } from './GetPokemonsBasicInfosUseCase';
import { PaginateEntity } from '../../../common/pagination';
import { PokemonDetail } from '../../domain/types';

class GetPokemonsBasicInfosUseCaseMock {
  execute = jest.fn();
}

describe('GetPokemonsUseCase', () => {
  let useCase: GetPokemonsUseCase;
  let listUseCase: ListPokemonsUseCase;
  let getBasicsUseCase: GetPokemonsBasicInfosUseCaseMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPokemonsUseCase,
        {
          provide: ListPokemonsUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetPokemonsBasicInfosUseCase,
          useClass: GetPokemonsBasicInfosUseCaseMock,
        },
      ],
    }).compile();

    useCase = module.get(GetPokemonsUseCase);
    listUseCase = module.get(ListPokemonsUseCase);
    getBasicsUseCase = module.get(GetPokemonsBasicInfosUseCase) as any;
  });

  it('should merge ids from list and command, fetch basic infos and map result', async () => {
    const command: GetPokemonsCommand = {
      pagination: { page: 1, perPage: 20 } as any,
      ids: [3, 4],
    };

    const pagination: PaginateEntity = {
      page: 1,
      perPage: 20,
      count: 20,
      totalPages: 5,
    };

    const listResult: ListPokemonsResult = {
      pagination,
      results: [
        { id: 1, name: 'bulbasaur', url: '/pokemon/1' },
        { id: 2, name: 'ivysaur', url: '/pokemon/2' },
      ],
    };

    (listUseCase.execute as jest.Mock).mockResolvedValue(listResult);

    const basicDetails: PokemonDetail[] = [
      { id: 1, name: 'bulbasaur', main_image: 'b.png' } as PokemonDetail,
      { id: 2, name: 'ivysaur', main_image: 'i.png' } as PokemonDetail,
      { id: 3, name: 'venusaur', main_image: 'v.png' } as PokemonDetail,
      { id: 4, name: 'charmander', main_image: 'c.png' } as PokemonDetail,
    ];

    getBasicsUseCase.execute.mockResolvedValue(basicDetails);

    const result: GetPokemonsResult = await useCase.execute(command);

    // ids vindos da lista + ids extras, sem duplicados
    expect(getBasicsUseCase.execute).toHaveBeenCalledTimes(1);
    const args = getBasicsUseCase.execute.mock.calls[0][0];
    expect(args.ids.sort()).toEqual([1, 2, 3, 4]);

    expect(result.pagination).toEqual(pagination);
    expect(result.results).toEqual([
      { id: 1, name: 'bulbasaur', image: 'b.png' },
      { id: 2, name: 'ivysaur', image: 'i.png' },
      { id: 3, name: 'venusaur', image: 'v.png' },
      { id: 4, name: 'charmander', image: 'c.png' },
    ]);
  });
});
