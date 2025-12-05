import { useState, useEffect, useMemo } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { createPageTitle, pageDescriptions } from '@/shared/utils/pageTitles';
import { PageHeader } from '@/shared/ui/PageHeader';
import { TopBar } from '@/shared/ui/TopBar';
import { SearchBar } from '@/shared/ui/SearchBar';
import { CardList } from '@/features/pokemon/ui/CardList';
import { BasicPokemon } from '@/features/pokemon/types/pokemon';
import { SessionEntity } from '@/features/auth';
import { routes, pokemon_details_path } from '@/routes';
import { PokemonGateway } from '@/features/pokemon/gateway';
import { usePokemonList } from '@/features/pokemon/hooks/usePokemonList';
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
  const { getInfinitePokemons, getBasicInfosByParam } = usePokemonList();
  const { searchQuery, sortBy, debouncedSearchQuery, filterPokemons, setSearchQuery, setSortBy } = useFilters();

  const [initialLoading, setInitialLoading] = useState(true);

  const [extraPokemons, setExtraPokemons] = useState<BasicPokemon[]>([]);

  const {
    data: infiniteData,
    fetchNextPage,
    isFetchingNextPage,
  } = getInfinitePokemons({ page: 2 });

  const basePokemons = useMemo(() => {
    const mergedById = new Map<number, BasicPokemon>();

    const pushList = (list: BasicPokemon[]) => {
      list.forEach((p) => {
        if (!mergedById.has(p.id)) {
          mergedById.set(p.id, p);
        }
      });
    };

    pushList(initialPokemons.results || []);

    const pages = infiniteData?.pages ?? [];
    pages.forEach((page: any) => {
      if (page?.results) {
        pushList(page.results as BasicPokemon[]);
      }
    });

    pushList(extraPokemons);

    return Array.from(mergedById.values());
  }, [initialPokemons.results, infiniteData, extraPokemons]);

  const filtered = useMemo(() => {
    return filterPokemons(basePokemons, debouncedSearchQuery);
  }, [basePokemons, debouncedSearchQuery, sortBy, filterPokemons]);

  const { isFetching: isSearchApiFetching, refetch: refetchSearch } = getBasicInfosByParam(debouncedSearchQuery || '');

  // Function to update url IDS so we can get filtered results on first page load
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
    setInitialLoading(false);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (debouncedSearchQuery.trim() && filtered.length === 0) {
        console.log('🔍 No local results, would call API');
        
        const result = await refetchSearch();
        console.log('result dentro do effect', result);
        
        if (result.data) {
          const pokemon = result.data as BasicPokemon;
          setExtraPokemons(prev => {
            const exists = prev.some(p => p.id === pokemon.id);
            return exists ? prev : [...prev, pokemon];
          });
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
  }, [debouncedSearchQuery, filtered.length, refetchSearch, router.query.ids]);

  const handleScrollEnd = async () => {
    if (debouncedSearchQuery.trim()) return;
    if (!isFetchingNextPage) {
      await fetchNextPage();
    }
  };

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
          onCardClick={(pokemon: BasicPokemon) => {
            router.push(pokemon_details_path(pokemon.id));
          }}
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
