import React from 'react';
import { useAtom } from 'jotai';

import { twitchClientMachineAtom } from '../../atoms/TwitchClientAtoms';

import { FaTwitch } from 'react-icons/fa';

export default function TwitchLoader() {
  const [ state ] = useAtom(twitchClientMachineAtom);

  const ready = state.matches('ready');

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
      </div>
    </div>
  );
}
