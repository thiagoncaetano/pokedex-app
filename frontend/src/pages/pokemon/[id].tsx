import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PageHeader } from '@/shared/ui/PageHeader';
import { createPageTitle, pageDescriptions } from '@/shared/utils/pageTitles';
import { PokemonDetailLayout } from '@/features/pokemon/ui/PokemonDetailLayout';
import { routes } from '@/routes';
import { SessionEntity } from '@/features/auth';
import { PokemonGateway } from '@/features/pokemon/gateway';

interface PokemonDetailPageProps {
    pokemon: any; // TODO: tipar com modelo de detalhe quando disponível
}

const PokemonDetailPage: NextPage<PokemonDetailPageProps> = () => {
    const router = useRouter();

    return (
        <>
            <PageHeader
                title={createPageTitle('Pokemon Detail')}
                description={pageDescriptions.home}
            />

            <PokemonDetailLayout
                onBack={() => {
                    router.push(routes.home);
                }}
            >
                <span className="text-gray-700">renderizou</span>
            </PokemonDetailLayout>
        </>
    );
};

export const getServerSideProps: GetServerSideProps<PokemonDetailPageProps> = async (context) => {
    const session = await SessionEntity.get(context);
    if (!session) {
        return { redirect: { destination: routes.login, permanent: false } };
    }

    try {
        const { id } = context.query;
        const pokemon = await PokemonGateway.getPokemonDetails(id as string, session.tokens.token);

        return {
            props: {
                pokemon,
            },
        };
    } catch (error) {
        console.error('Error in getServerSideProps (pokemon detail):', error);
        return { redirect: { destination: routes.error, permanent: false } };
    }
};

export default PokemonDetailPage;

