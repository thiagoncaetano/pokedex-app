import { createContext, useContext, useState, ReactNode } from 'react';
import { BasicPokemon } from '../types/pokemon';

interface PokemonContextType {
  pokemons: BasicPokemon[];
  addPokemons: (pokemons: BasicPokemon[]) => void;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

interface PokemonProviderProps {
  children: ReactNode;
}

export function PokemonProvider({ children }: PokemonProviderProps) {
  const [pokemons, setPokemons] = useState<BasicPokemon[]>([]);

  const addPokemons = (newPokemons: BasicPokemon[]) => {
    setPokemons(prev => [...prev, ...newPokemons]);
  };

  return (
    <PokemonContext.Provider value={{
      pokemons,
      addPokemons
    }}>
      {children}
    </PokemonContext.Provider>
  );
}

export function usePokemonContext() {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error('usePokemonContext must be used within a PokemonProvider');
  }
  return context;
}
