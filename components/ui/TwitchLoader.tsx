import _ from 'lodash';
import axios from 'axios';
import { ratio } from 'fuzzball';
import React, { useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { Userstate } from 'tmi.js';
import { IBadges } from '../../common/Interfaces';

import { channelAtom } from '../../atoms/SettingsAtoms';
import {
  twitchClientAtom,
  canJoinAtom,
  connectedAtom,
  joinMessageAtom,
  joinedChannelAtom
} from '../../atoms/SessionAtoms';
import { addItemAtom } from '../../atoms/ItemAtoms';

import { FaTwitch } from 'react-icons/fa';
import { badgesAtom } from '../../atoms/ContentAtoms';




export default function TwitchLoader() {
  const twitchClient = useAtomValue(twitchClientAtom);
  const channel = useAtomValue(channelAtom);
  const canJoin = useAtomValue(canJoinAtom);
  const joinMessage = useAtomValue(joinMessageAtom);

  const addItem = useSetAtom(addItemAtom);
  const setBadges = useSetAtom(badgesAtom);

  const [ connected, setConnected ] = useAtom(connectedAtom)
  const [ joinedChannel, setJoinedChannel ] = useAtom(joinedChannelAtom);

  useEffect(() => {
    if(channel) {
      axios<IBadges>({ method: 'get', url: `/api/badges/${channel}`}).then((response) => {
        if(response.status === 200) {
          setBadges(response.data);
        }
      })
    }
  }, [ channel, setBadges ]);

  useEffect(() => {
    if(!connected) {
      twitchClient.connect().then(() => {
        setConnected(true);
      });
    }
  }, [twitchClient, connected, setConnected ]);

  useEffect(() => {
    if(joinedChannel !== channel && !_.isEmpty(channel) && connected) {
      twitchClient.join(channel).then(() => {
        setJoinedChannel(channel);
      });
    }
  }, [twitchClient, connected, channel, joinedChannel, setJoinedChannel])

  useEffect(() => {
    const messageHandler = (channel: string, userstate: Userstate, message: string) => {
      if(!canJoin) {
        return;
      }

      const messageMatch = (ratio(message, joinMessage) >= 0.60) || joinMessage === '';

      if(messageMatch) {
        addItem({ label: userstate.username, userstate });
      }
    };

    twitchClient.on('message', messageHandler);

    return () => {
      twitchClient.removeListener('message', messageHandler);
    }
  }, [twitchClient, joinMessage, canJoin, addItem])

  return (
    <div
      key="twitch-loader"
      className={
      `panel-container z-30 bg-violet-500 text-white align-middle
       pointer-events-none transition-all duration-1000 ease-out
      ${joinedChannel === channel && connected ? (
        'opacity-0'
      ) : (
        'opacity-100'
      )}`}
    >
      <FaTwitch className="text-4xl m-auto animate-ping" />
    </div>
  );
}
