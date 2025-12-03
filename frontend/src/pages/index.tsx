import { useState, useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { PageHeader } from '@/shared/ui/PageHeader';
import { TopBar } from '@/shared/ui/TopBar';
import { SearchBar } from '@/shared/ui/SearchBar';
import { CardList } from '@/features/pokemon/ui/CardList';
import { PokemonFilters, BasicPokemon } from '@/features/pokemon/types/pokemon';
import { SessionEntity } from '@/features/auth';
import { routes } from '@/routes';
import { PokemonGateway } from '@/features/pokemon/gateway';
import { usePokemonList } from '@/features/pokemon/hooks/usePokemonList';
import type { User } from '@/shared/models/auth';

interface HomePageProps {
  pokemons: {
    ids: number[];
    pagination: {
      page: number;
      total: number;
      totalPages: number;
      perPage: number;
    };
  };
  user: User;
}

const HomePage: NextPage<HomePageProps> = ({ pokemons, user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { getBasicInfosByIds } = usePokemonList();

  const { data: pokemonsData, isLoading } = getBasicInfosByIds(pokemons.ids);
  
  return (
    <>
      <PageHeader
        title="Pokédex - Home"
        description="Welcome back to Pokédex! Explore Pokémon, battles, and more."
      />
      
      <div className="min-h-screen bg-primary">
        <TopBar user={user} />

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={(query) => setSearchQuery(query)}
          onFilterClick={() => console.log('Filter clicked')}
        />

        <CardList 
          pokemons={pokemonsData || []} 
          onCardClick={(pokemon: BasicPokemon) => console.log('Clicked on:', pokemon)}
          isLoading={isLoading}
        />

      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (context) => {
  try {
    const session = await SessionEntity.get(context);
    if (!session) return { redirect: { destination: routes.login, permanent: false } };

    const pokemons = await PokemonGateway.getPokemons(session.tokens.token);

    return {
      props: {
        pokemons: {
          ids: pokemons.results.map(pokemon => pokemon.id),
          pagination: pokemons.pagination,
        },
        user: { ...session.currentUser },
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps (index):', error);
    return { redirect: { destination: routes.error, permanent: false } };
  }
};

export default HomePage;
