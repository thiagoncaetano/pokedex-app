import '@/styles/globals.css';
import { Poppins } from 'next/font/google';
import { NotificationProvider } from '@/shared/notifications/NotificationContext';
import { Notifications } from '@/shared/notifications/Notifications';
import { hydrate, QueryClient, QueryClientProvider, DehydratedState } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { ReactNode, useEffect } from 'react';

const queryClient = new QueryClient();

const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

interface HydrateProps {
  state?: DehydratedState;
  children: ReactNode;
}

function Hydrate({ state, children }: HydrateProps) {
  useEffect(() => {
    if (state) {
      hydrate(queryClient, state);
    }
  }, [state]);

  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={(pageProps as any).dehydratedState}>
        <div className={`${poppins.variable} antialiased w-full overflow-x-hidden`}>
          <NotificationProvider>
            <Notifications />
              <Component {...pageProps} />
          </NotificationProvider>
        </div>
      </Hydrate>
    </QueryClientProvider>
  );
}
