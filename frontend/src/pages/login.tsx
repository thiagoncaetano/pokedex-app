import { PageHeader } from '@/shared/ui/PageHeader';
import { createPageTitle, pageDescriptions } from '@/shared/utils/pageTitles';
import { routes } from '@/routes';
import { GetServerSideProps } from 'next';
import { LoginForm } from '@/features/auth';
import { SessionEntity } from '@/features/auth';

export default function LoginPage() {
  return (
    <PageHeader
      title={createPageTitle('Login')}
      description={pageDescriptions.login}
    >
      <LoginForm />
    </PageHeader>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await SessionEntity.get(ctx);
  if (session) return { redirect: { destination: routes.home, permanent: false } };
  return { props: {} };
};
