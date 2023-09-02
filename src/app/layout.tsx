'use client';

import './globals.css';

import { Provider as StoreProvider } from 'jotai';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { AlertContainer, ClientOnly } from './components';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="cupcake">
      <head>
        <title>Win Fusion: Giveaways with pleasure</title>
        <meta name="description" content="Elevate Your Brand with Engaging Giveaways" />
      </head>
      <body>
        <StoreProvider>
          <UserProvider>{children}</UserProvider>
          <ClientOnly>
            <AlertContainer />
          </ClientOnly>
        </StoreProvider>
      </body>
    </html>
  );
}
