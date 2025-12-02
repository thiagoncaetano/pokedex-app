import '@/styles/globals.css';
import { Poppins } from 'next/font/google';
import { NotificationProvider } from '@/shared/notifications/NotificationContext';
import { Notifications } from '@/shared/notifications/Notifications';
import type { AppProps } from 'next/app';

const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${poppins.variable} antialiased`}>
      <NotificationProvider>
        <Notifications />
        <Component {...pageProps} />
      </NotificationProvider>
    </div>
  );
}
