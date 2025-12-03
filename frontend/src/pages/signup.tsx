import { PageHeader } from '@/shared/ui/PageHeader';
import { createPageTitle, pageDescriptions } from '@/shared/utils/pageTitles';
import { routes } from '@/routes';
import { GetServerSideProps } from 'next';
import { SignUpForm } from '@/features/users';
import { SessionEntity } from '@/features/auth';

export default function SignUpPage() {
  return (
    <PageHeader
      title={createPageTitle('Sign Up')}
      description={pageDescriptions.login}
    >
      <SignUpForm />
    </PageHeader>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await SessionEntity.get(ctx);
  if (session) return { redirect: { destination: routes.home, permanent: false } };
  return { props: {} };
};
