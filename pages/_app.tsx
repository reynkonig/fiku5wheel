import React from 'react';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import { Comfortaa } from '@next/font/google'
import type { AppProps } from 'next/app'

import { Provider } from 'jotai';

import store from '../atoms/StoreAtom';

import '../styles/globals.css'

const comfortaa = Comfortaa({ weight: [ '500' ], display: 'swap', subsets: ['cyrillic'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <title>Срулетка</title>
      </Head>
      <main className={comfortaa.className}>
        <Component {...pageProps} />
      </main>
      <Analytics />
    </Provider>
  );
}
