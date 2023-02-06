'use client';

import axios from 'axios';
import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app'
import { Provider } from 'jotai';
import { Comfortaa } from '@next/font/google'

import {
  twitchChannelStatesAtom,
  twitchClientAtom,
  twitchClientConnectedAtom
} from '../atoms/TwitchClientAtoms';
import { badgesAtom } from '../atoms/ContentAtoms';

import store from '../atoms/StoreAtom';

import '../styles/globals.css'
import { ChannelState } from '../common/emums';

const comfortaa = Comfortaa({ weight: [ '500' ], display: 'swap', subsets: ['cyrillic'] })

if(typeof window !== "undefined") {
  axios({ method: 'get', url: '/api/badges' }).then((response) => {
    store.set(badgesAtom, (badges) => Object.assign(badges, response.data));
  })

  if(!store.get(twitchClientConnectedAtom)) {
    store.get(twitchClientAtom).connect().then(() => {
      store.set(twitchClientConnectedAtom, true);

      store.set(twitchChannelStatesAtom, Object.fromEntries(['fiku5golubev'].map((channel) => [channel, ChannelState.JoinPlanned])));
    });
  }
}

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
