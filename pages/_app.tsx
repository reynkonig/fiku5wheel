import React from 'react';
import Head from 'next/head';

import { Provider } from 'jotai';
import { Comfortaa } from '@next/font/google'

import type { AppProps } from 'next/app'

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
    </Provider>
  );
}
