import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsController } from './pokemons.controller';
import { GetPokemonsUseCase, GetPokemonsResult } from '@/pokemons/application/use-cases/GetPokemonsUseCase';
import { GetPokemonDetailUseCase } from '@/pokemons/application/use-cases/GetPokemonDetailUseCase';
import { GetPokemonBasicInfoUseCase } from '@/pokemons/application/use-cases/GetPokemonBasicInfoUseCase';
import { PokemonBasicInfoPresenter, PokemonPresenter } from './pokemon.presenter';
import { PokemonBasicDetail, PokemonDetail, PokemonListItem } from '@/pokemons/domain/types';

jest.mock('./pokemon.presenter');

describe('PokemonsController', () => {
  let controller: PokemonsController;
  let getPokemonsUseCase: jest.Mocked<GetPokemonsUseCase>;
  let getPokemonDetailUseCase: jest.Mocked<GetPokemonDetailUseCase>;
  let getPokemonBasicInfoUseCase: jest.Mocked<GetPokemonBasicInfoUseCase>;

  beforeEach(async () => {
    const getPokemonsUseCaseMock: Partial<jest.Mocked<GetPokemonsUseCase>> = {
      execute: jest.fn(),
    };

    const getPokemonDetailUseCaseMock: Partial<jest.Mocked<GetPokemonDetailUseCase>> = {
      execute: jest.fn(),
    };

    const getPokemonBasicInfoUseCaseMock: Partial<jest.Mocked<GetPokemonBasicInfoUseCase>> = {
      execute: jest.fn(),
    };

    (PokemonBasicInfoPresenter.presentBasicInfos as jest.Mock).mockImplementation((details) => details);
    (PokemonBasicInfoPresenter.presentBasicInfo as jest.Mock).mockImplementation((detail) => detail);
    (PokemonPresenter.presentDetail as jest.Mock).mockImplementation((detail) => detail);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonsController],
      providers: [
        { provide: GetPokemonsUseCase, useValue: getPokemonsUseCaseMock },
        { provide: GetPokemonDetailUseCase, useValue: getPokemonDetailUseCaseMock },
        { provide: GetPokemonBasicInfoUseCase, useValue: getPokemonBasicInfoUseCaseMock },
      ],
    }).compile();

    controller = module.get<PokemonsController>(PokemonsController);
    getPokemonsUseCase = module.get(GetPokemonsUseCase);
    getPokemonDetailUseCase = module.get(GetPokemonDetailUseCase);
    getPokemonBasicInfoUseCase = module.get(GetPokemonBasicInfoUseCase);
  });

  describe('getPokemons', () => {
    it('should call GetPokemonsUseCase and return presented basic infos with pagination', async () => {
      const body = { ids: [1, 2, 3] };
      const query = { page: 2 };

      const pagination = { page: 2, perPage: 20, count: 40, totalPages: 2 } as any;
      const basicDetails: PokemonBasicDetail[] = [
        { id: 1, name: 'bulbasaur', image: 'b.png' } as PokemonBasicDetail,
      ];

      const useCaseResult: GetPokemonsResult = {
        pagination,
        results: basicDetails,
      };

      getPokemonsUseCase.execute.mockResolvedValue(useCaseResult);

      const result = await controller.getPokemons(body, query);

      expect(getPokemonsUseCase.execute).toHaveBeenCalledTimes(1);
      const args = getPokemonsUseCase.execute.mock.calls[0][0];
      expect(args.ids).toEqual(body.ids);
      expect(args.pagination.page).toBe(query.page);

      expect(PokemonBasicInfoPresenter.presentBasicInfos).toHaveBeenCalledTimes(1);
      expect(PokemonBasicInfoPresenter.presentBasicInfos).toHaveBeenCalledWith(basicDetails);

      expect(result).toEqual({
        pagination,
        results: basicDetails,
      });
    });
  });

  describe('getById', () => {
    it('should call GetPokemonDetailUseCase and present detail', async () => {
      const id = '25';
      const numericId = 25;

      const detail: PokemonDetail = {
        id: numericId,
        name: 'pikachu',
        height: 4,
        weight: 60,
        types: [],
        moves: [],
        stats: [],
        abilities: [],
        main_image: 'img.png',
        images: [],
      };

      getPokemonDetailUseCase.execute.mockResolvedValue(detail);
      (PokemonPresenter.presentDetail as jest.Mock).mockReturnValue(detail);

      const result = await controller.getById(id);

      expect(getPokemonDetailUseCase.execute).toHaveBeenCalledTimes(1);
      expect(getPokemonDetailUseCase.execute).toHaveBeenCalledWith({ id: numericId });
      expect(PokemonPresenter.presentDetail).toHaveBeenCalledTimes(1);
      expect(PokemonPresenter.presentDetail).toHaveBeenCalledWith(detail, numericId);
      expect(result).toBe(detail);
    });
  });

  describe('getBasicInfosByParam', () => {
    it('should call GetPokemonBasicInfoUseCase and present basic info when result exists', async () => {
      const param = 'pikachu';

      const basicDetail: PokemonBasicDetail = {
        id: 25,
        name: 'pikachu',
        image: 'p.png',
      } as PokemonBasicDetail;

      getPokemonBasicInfoUseCase.execute.mockResolvedValue(basicDetail);
      (PokemonBasicInfoPresenter.presentBasicInfo as jest.Mock).mockReturnValue(basicDetail);

      const result = await controller.getBasicInfosByParam(param);

      expect(getPokemonBasicInfoUseCase.execute).toHaveBeenCalledTimes(1);
      expect(getPokemonBasicInfoUseCase.execute).toHaveBeenCalledWith({ param });
      expect(PokemonBasicInfoPresenter.presentBasicInfo).toHaveBeenCalledTimes(1);
      expect(PokemonBasicInfoPresenter.presentBasicInfo).toHaveBeenCalledWith(basicDetail);
      expect(result).toBe(basicDetail);
    });

    it('should return null when GetPokemonBasicInfoUseCase returns null', async () => {
      const param = 'missing';

      getPokemonBasicInfoUseCase.execute.mockResolvedValue(null);

      const result = await controller.getBasicInfosByParam(param);

      expect(getPokemonBasicInfoUseCase.execute).toHaveBeenCalledTimes(1);
      expect(getPokemonBasicInfoUseCase.execute).toHaveBeenCalledWith({ param });
      expect(PokemonBasicInfoPresenter.presentBasicInfo).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
