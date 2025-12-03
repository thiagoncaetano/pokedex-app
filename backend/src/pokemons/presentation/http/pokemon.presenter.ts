export interface Pokemon {
  id: number;
  name: string;
  number: number;
  types: string[];
  imageUrl: string;
  height?: number;
  weight?: number;
  abilities?: string[];
}

export interface PokemonListItem {
  id: number;
  name: string;
  url: string;
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
