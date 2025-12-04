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
import { PokemonProvider, usePokemonContext } from '@/features/pokemon/context/PokemonContext';
import type { User } from '@/shared/models/auth';

interface HomePageProps {
  initialValues: {
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

const HomePage: NextPage<HomePageProps> = ({ initialValues, user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { pokemons, addPokemons } = usePokemonContext();
  const { getBasicInfosByIds, getInfinitePokemons } = usePokemonList();

  const { fetchNextPage, isFetchingNextPage } = getInfinitePokemons({ page: 2 });
  const { data: pokemonWithBasicInfo, isLoading } = getBasicInfosByIds(initialValues.ids);

  useEffect(() => {
    if (pokemonWithBasicInfo) addPokemons(pokemonWithBasicInfo);
  }, [pokemonWithBasicInfo, addPokemons]);

  const handleScrollEnd = async () => {
    if (!isFetchingNextPage) {
      const result = await fetchNextPage();
      if (result?.data?.pages) {
        const lastPage = result.data.pages[result.data.pages.length - 1];
        if (lastPage?.results) {
          addPokemons(lastPage.results);
        }
      }
    }
  };

  console.log("pokemons", pokemons)
  
  return (
    <>
      <PageHeader
        title="Pokédex - Home"
        description="Welcome back to Pokédex! Explore Pokémon, battles, and more."
      />
      
      <div className="h-screen bg-primary flex flex-col overflow-hidden">
        <TopBar user={user} />

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={(query) => setSearchQuery(query)}
          onFilterClick={() => console.log('Filter clicked')}
        />

        <div className="flex-1 overflow-hidden px-1 sm:px-2 pb-2">
          <CardList 
            pokemons={pokemons} 
            onCardClick={(pokemon: BasicPokemon) => console.log('Clicked on:', pokemon)}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            onEndReached={handleScrollEnd}
          />
        </div>

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
        initialValues: {
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
