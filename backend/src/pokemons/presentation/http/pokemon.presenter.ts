import type { Pokemon, PokemonDetail, PokemonBasicDetail } from '../../domain/types';

export class PokemonPresenter {
  static presentListItem(detail: PokemonDetail): Pokemon {
    return {
      id: detail.id,
      name: detail.name,
      number: detail.id,
      types: detail.types.map(t => t.type.name),
      imageUrl: detail.sprites.front_default,
      height: detail.height,
      weight: detail.weight,
      abilities: detail.abilities.map(a => a.ability.name),
    };
  }

  static presentList(details: PokemonDetail[]): Pokemon[] {
    return details.map(detail => this.presentListItem(detail));
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
