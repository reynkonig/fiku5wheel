import React from 'react';
import { useAtomValue } from 'jotai';

import {
  readyAtom,
  connectingChannelsAtom,
  clientConnectedAtom,
} from '../../atoms/TwitchClientAtoms';

import { FaTwitch } from 'react-icons/fa';

export default function TwitchLoader() {
  const ready = useAtomValue(readyAtom);

  const connected = useAtomValue(clientConnectedAtom);
  const connectingChannels = useAtomValue(connectingChannelsAtom);

  return (
    <div
      key="twitch-loader"
      className={
      `panel-container z-30 bg-violet-500 text-white align-middle transition-all duration-1000 ease-out delay-1000
      ${ready ? (
        'opacity-0 pointer-events-none'
      ) : (
        'opacity-100'
      )}`}
    >
      <div className="m-auto align-middle animate-pulse">
        <FaTwitch className="mx-auto text-6xl" />
        <div className="mx-auto h-8" />
        <div className="mt-10">
          { connectingChannels.length || !connected ? (
            <span>Подключение к&nbsp;
              <b>{connected ? connectingChannels.join(', ') : 'irc-ws.chat.twitch.tv'}</b>
            </span>
          ) : (
            <span>Готово</span>
          )}
        </div>
      </div>
    </div>
  );
}
