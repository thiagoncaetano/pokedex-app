import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { PageHeader } from '@/shared/ui/PageHeader';
import { TopBar } from '@/shared/ui/TopBar';
import { SearchBar } from '@/shared/ui/SearchBar';
import { CardList } from '@/features/pokemon/ui/CardList';
import { PokemonListResponse, PokemonFilters } from '@/features/pokemon/types/pokemon';
import { SessionEntity } from '@/features/auth';
import { routes } from '@/routes';
import { PokemonGateway } from '@/features/pokemon/gateway';
import type { User } from '@/shared/models/auth';

interface HomePageProps {
  initialPokemons: PokemonListResponse;
  user: User;
}

const HomePage: NextPage<HomePageProps> = ({ initialPokemons, user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
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
          pokemons={[]} 
          onCardClick={(pokemon) => console.log('Clicked on:', pokemon)}
        />

      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (context) => {
  try {
    const session = await SessionEntity.get(context);
    if (!session) return { redirect: { destination: routes.login, permanent: false } };

    const page = parseInt(context.query.page as string);
    const query = context.query.query as string;
    const sortBy = context.query.sortBy as string;

    const filters: PokemonFilters = {
      page: page || 1,
      query,
      sortBy,
    };

    const pokemons = await PokemonGateway.getPokemons(filters, session.tokens.token);

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
