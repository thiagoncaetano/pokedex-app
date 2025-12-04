import { useState, useEffect, useMemo } from 'react';
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
import { usePokemonContext } from '@/features/pokemon/context/PokemonContext';
import { useFilters } from '@/hooks/useFilters';
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
  const { pokemons, addPokemons } = usePokemonContext();
  const { getBasicInfosByIds, getInfinitePokemons } = usePokemonList();
  const { searchQuery, sortBy, debouncedSearchQuery, filterPokemons, setSearchQuery, setSortBy } = useFilters();

  const filtered = useMemo(() => {
    return filterPokemons(pokemons, debouncedSearchQuery);
  }, [pokemons, debouncedSearchQuery, sortBy, filterPokemons]);

  const { fetchNextPage, isFetchingNextPage } = getInfinitePokemons({ page: 2 });

  const {
    isFetching: isSearchApiFetching,
    refetch: refetchSearch,
  } = getInfinitePokemons(
    { page: 1, query: debouncedSearchQuery || undefined },
    { enabled: false }
  );
  const { data: pokemonWithBasicInfo, isLoading } = getBasicInfosByIds(initialValues.ids);

  useEffect(() => {
    if (pokemonWithBasicInfo) addPokemons(pokemonWithBasicInfo);
  }, [pokemonWithBasicInfo, addPokemons]);

  useEffect(() => {
    const search = async () => {
      if (debouncedSearchQuery.trim() && filtered.length === 0) {
        console.log('🔍 No local results, would call API');
        
        const result = await refetchSearch();
        console.log('result dentro do effect', result.data);

        const pages = result.data?.pages ?? [];
        const apiResults = pages
          .map((page: any) => page?.results)
          .filter((r: any) => Array.isArray(r) && r.length > 0)
          .flat();

        if (apiResults.length > 0) {
          addPokemons(apiResults);
        }
      }
    };

    search();
  }, [debouncedSearchQuery, filtered.length, refetchSearch, addPokemons]);

  const handleScrollEnd = async () => {
    if (debouncedSearchQuery.trim()) return;
    
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
          onSortChange={(sort) => setSortBy(sort)}
        />

        <div className="flex-1 overflow-hidden px-1 sm:px-2 pb-2">
          <CardList 
            pokemons={filtered}
            onCardClick={(pokemon: BasicPokemon) => console.log('Clicked on:', pokemon)}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            isSearchApiFetching={isSearchApiFetching}
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
