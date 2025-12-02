import { PageHeader } from '@/shared/ui/PageHeader';
import { createPageTitle, pageDescriptions } from '@/shared/utils/pageTitles';
import { routes } from '@/routes';
import { GetServerSideProps } from 'next';
import { LoginForm } from '@/features/auth';

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
  const cookie = ctx.req.headers.cookie;
  try {
    const res = await fetch(routes.api.me, {
      headers: { cookie: cookie || '' },
    });
    const data = await res.json();
    if (data.user) {
      return { redirect: { destination: routes.home, permanent: false } };
    }
  } catch {
  }
  return { props: {} };
};
