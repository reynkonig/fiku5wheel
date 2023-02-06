import axios from 'axios';
import _ from 'lodash';
import { ratio } from 'fuzzball';
import { Client, Userstate } from 'tmi.js';

import { createStore } from 'jotai';

import { ChannelState } from '../common/emums';
import { IListedItem } from '../common/interfaces';

import {
  clientAtom,
  channelStatesAtom,
  clientConnectedAtom,
} from './TwitchClientAtoms';
import { badgesAtom } from './ContentAtoms';
import {
  chatMembersCanJoinAtom,
  joinMessageAtom,
  storeUIDAtom
} from './SessionAtoms';
import { itemsAtom } from './ItemAtoms';

const store = createStore();

store.sub(storeUIDAtom, () => {
  const storeUID = store.get(storeUIDAtom);
  window.LastStoreUID = storeUID;

  const client = new Client({ channels: ['watchmeforever'] });

  client.on('message', (channel: string, userstate: Userstate, message: string) => {
    if(window.LastStoreUID !== storeUID) {
      client.removeAllListeners().disconnect();
    }

    if(!store.get(chatMembersCanJoinAtom)) {
      return;
    }

    const joinMessage = store.get(joinMessageAtom);
    const joinMember = ratio(message, joinMessage) > 0.6 || joinMessage === '';

    if(joinMember) {
      store.set(itemsAtom, (prev) => {
        const newItem: IListedItem = { label: userstate.username, channel, userstate }
        if(!prev.includes(newItem)) {
          return [...prev, newItem];
        }
        return prev;
      })
    }
  })

  client.connect().then(() => {
    store.set(clientConnectedAtom, true);
  })

  store.set(clientAtom, client);
})

store.sub(channelStatesAtom, () => {
  const { get, set } = store;
  const connected = get(clientConnectedAtom);
  const channelStates = get(channelStatesAtom);

  const pendingStates = _.pickBy(channelStates, (value) => value === ChannelState.JoinPlanned || value === ChannelState.PartPlanned);

  if(connected && !_.isEmpty(pendingStates)) {
    const newStates = _.mapValues(channelStates, (state, channel) => {
      const twitchClient = get(clientAtom);

      switch (state) {
        case ChannelState.JoinPlanned:
          console.log(`Joining ${channel}`);
          twitchClient.join(channel).then(() => {
            console.log(`Joined ${channel}`);
            set(channelStatesAtom, (prev) => _.set(_.cloneDeep(prev), channel, ChannelState.Joined));

            axios.get(`/api/badges/${channel}`).then((response) => {
              set(badgesAtom, (prev) => _.merge(_.cloneDeep(prev), response.data));
            })
          });
          return ChannelState.Joining;

        case ChannelState.PartPlanned:
          console.log(`Parting ${channel}`);
          twitchClient.part(channel).then(() => {
            console.log(`Parted ${channel}`);
            set(channelStatesAtom, (prev) => _.pickBy(_.cloneDeep(prev), (value, key) => key !== channel));
          });
          return ChannelState.Parting;

        default:
          return state
      }
    });

    set(channelStatesAtom, newStates as Record<string, ChannelState>);
  }
})

if(typeof window !== 'undefined') {
  store.set(storeUIDAtom, crypto.randomUUID());
}

export default store;

