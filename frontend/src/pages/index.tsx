import { useState, useEffect, useMemo } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { createPageTitle, pageDescriptions } from '@/shared/utils/pageTitles';
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
  initialPokemons: {
    results: BasicPokemon[];
    pagination: {
      page: number;
      total: number;
      totalPages: number;
      perPage: number;
    };
  };
  user: User;
}

const HomePage: NextPage<HomePageProps> = ({ initialPokemons, user }) => {
  const router = useRouter();
  const { pokemons, addPokemons } = usePokemonContext();
  const { getInfinitePokemons, getBasicInfosByParam } = usePokemonList();
  const { searchQuery, sortBy, debouncedSearchQuery, filterPokemons, setSearchQuery, setSortBy } = useFilters();

  const [initialLoading, setInitialLoading] = useState(true);

  const filtered = useMemo(() => {
    return filterPokemons(pokemons, debouncedSearchQuery);
  }, [pokemons, debouncedSearchQuery, sortBy, filterPokemons]);
 
  const { fetchNextPage, isFetchingNextPage } = getInfinitePokemons({ page: 2 });

  const { isFetching: isSearchApiFetching, refetch: refetchSearch } = getBasicInfosByParam(debouncedSearchQuery || '');

  // Função para atualizar URL com IDs dos pokemons
  const updateUrlWithIds = (pokemonIds: number[]) => {
    const query = { ...router.query };
    
    if (pokemonIds.length > 0) {
      query.ids = pokemonIds.map(String);
    } else {
      delete query.ids;
    }
    
    router.push(
      { pathname: router.pathname, query },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    addPokemons(initialPokemons.results || []);
    setInitialLoading(false);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (debouncedSearchQuery.trim() && filtered.length === 0) {
        console.log('🔍 No local results, would call API');
        
        const result = await refetchSearch();
        console.log('result dentro do effect', result);
        
        if (result.data) {
          addPokemons([result.data]);
          // Adicionar ID novo aos existentes na URL
          const existingIds = Array.isArray(router.query.ids) 
            ? router.query.ids as string[]
            : router.query.ids 
              ? [router.query.ids as string]
              : [];
          updateUrlWithIds([...existingIds.map(Number), result.data.id]);
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

  // console.log("pokemons", pokemons)
  console.log("filtered", filtered)

  return (
    <>
      <PageHeader
        title={createPageTitle('Home')}
        description={pageDescriptions.home}
      />
      
      <div className="h-screen bg-primary flex flex-col overflow-hidden">
        <TopBar user={user} />

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={(query) => setSearchQuery(query)}
          onSortChange={(sort) => setSortBy(sort)}
        />

        <CardList 
          pokemons={filtered}
          onCardClick={(pokemon: BasicPokemon) => console.log('Clicked on:', pokemon)}
          isFetchingNextPage={isFetchingNextPage}
          isSearchApiFetching={isSearchApiFetching}
          onEndReached={handleScrollEnd}
          isLoading={initialLoading}
        />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (context) => {
  try {
    const session = await SessionEntity.get(context);
    if (!session) return { redirect: { destination: routes.login, permanent: false } };
    
    let ids: string[] = [];
    if(context.query.ids) {
      ids = Array.isArray(context.query.ids) 
      ? context.query.ids 
      : [context.query.ids];
    }

    const pokemons = await PokemonGateway.getPokemons(session.tokens.token, ids);

    return {
      props: {
        initialPokemons: pokemons,
        user: { ...session.currentUser },
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps (index):', error);
    return { redirect: { destination: routes.error, permanent: false } };
  }
};

export default HomePage;
