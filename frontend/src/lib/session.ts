import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { routes } from '../routes';

export function withAuth(gssp?: GetServerSideProps) {
  return async (ctx: GetServerSidePropsContext) => {
    const cookie = ctx.req.headers.cookie;

    try {
      const res = await fetch(routes.api.me, {
        headers: { cookie: cookie || '' },
      });
      
      if (!res.ok) {
        // API responded with error (e.g., 500, 404)
        throw new Error('API error');
      }

      const data = await res.json();

      if (!data.user) {
        // API responded, but no user
        return { redirect: { destination: routes.login, permanent: false } };
      }

      // User exists
      if (gssp) {
        return gssp(ctx);
      }

      return { props: { user: data.user } };
    } catch {
      // Request failed (e.g., backend down)
      return { redirect: { destination: routes.error, permanent: false } };
    }
  };
}
