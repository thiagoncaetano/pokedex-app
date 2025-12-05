import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/shared/ui/PageHeader';
import { createPageTitle, pageDescriptions } from '@/shared/utils/pageTitles';
import { PokemonDetailLayout } from '@/features/pokemon/ui/PokemonDetailLayout';
import { getTypeColor } from '@/features/pokemon/utils/getTypeColor';
import { routes } from '@/routes';
import { SessionEntity } from '@/features/auth';
import { PokemonGateway } from '@/features/pokemon/gateway';

const PokemonDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: pokemon } = useQuery<any>({
    queryKey: ['pokemon-detail', id],
    queryFn: () => Promise.reject(new Error('pokemon-detail should be hydrated from server')),
    enabled: false,
  });

  const backgroundColor = getTypeColor(pokemon?.types?.[0]);

  return (
    <>
      <PageHeader
        title={createPageTitle('Pokemon Detail')}
        description={pageDescriptions.home}
      />

      {pokemon && (
        <PokemonDetailLayout
          backgroundColor={backgroundColor}
          pokemon={pokemon}
          imageSrc={pokemon.main_image}
          imageAlt={pokemon.name}
          name={pokemon.name}
          id={pokemon.id}
          onBack={() => {
            router.push(routes.home);
          }}
        />
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await SessionEntity.get(context);
  if (!session) {
    return { redirect: { destination: routes.login, permanent: false } };
  }

  try {
    const { id } = context.query;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
      queryKey: ['pokemon-detail', id],
      queryFn: () => PokemonGateway.getPokemonDetails(id as string, session.tokens.token),
      staleTime: 30 * 60 * 1000,
    });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps (pokemon detail):', error);
    return { redirect: { destination: routes.error, permanent: false } };
  }
};

export default PokemonDetailPage;

