import type { AppProps } from 'next/app'
import { Comfortaa } from '@next/font/google'
import Head from 'next/head';

import { Provider } from 'jotai';

import '../styles/globals.css'


const comfortaa = Comfortaa({ weight: [ '500' ], display: 'swap', subsets: ['cyrillic'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Head>
        <title>Срулетка</title>
      </Head>
      <main className={comfortaa.className}>
        <Component {...pageProps} />
      </main>
    </Provider>
  );
}
