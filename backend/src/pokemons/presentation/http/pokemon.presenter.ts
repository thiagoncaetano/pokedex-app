import type { PokemonDetail, PokemonBasicDetail } from '../../domain/types';

export class PokemonPresenter {
  static presentDetail(detail: PokemonDetail | null, id: number): PokemonDetail {
    if (!detail) {
      return {
        id,
        name: '',
        height: 0,
        weight: 0,
        moves: [],
        stats: [],
        types: [],
        abilities: [],
        main_image: '',
        images: [],
      };
    }

    return detail;
  }
}

export class PokemonBasicInfoPresenter {
  static presentBasicInfo(detail: PokemonBasicDetail): PokemonBasicDetail {
    return {
      id: detail.id,
      name: detail.name,
      image: detail.image,
    };
  }

  static presentBasicInfos(details: PokemonBasicDetail[]): PokemonBasicDetail[] {
    return details.map(detail => this.presentBasicInfo(detail));
  }
}
