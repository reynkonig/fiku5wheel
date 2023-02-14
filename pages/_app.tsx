import React from 'react';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import { Nunito } from '@next/font/google'
import type { AppProps } from 'next/app'

import { Provider } from 'jotai';

import store from '../atoms/StoreAtom';

import '../styles/globals.css'

const font = Nunito({ weight: [ '400', '500', '600', '700' ], subsets: ['cyrillic'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <title>Срулетка</title>
      </Head>
      <main className={font.className}>
        <Component {...pageProps} />
      </main>
      <Analytics />
    </Provider>
  );
}
