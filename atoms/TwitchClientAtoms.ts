import _ from 'lodash';
import axios from 'axios';
import { ratio } from 'fuzzball';
import { Userstate } from 'tmi.js';

import { atomWithMachine } from 'jotai-xstate';

import { createTwitchClientMachine } from '../machines/TwitchClientMachine';

import store from './StoreAtom';

import { itemsAtom } from './ItemAtoms';
import { badgesAtom } from './ContentAtoms';
import { defaultChannelsAtom } from './SettingsAtoms';
import { chatMembersCanJoinAtom, joinMessageAtom } from './SessionAtoms';

const messageHandler = (channel: string, userstate: Userstate, message: string) => {

  if(!store.get(chatMembersCanJoinAtom)) {
    return;
  }

  const joinMessage = store.get(joinMessageAtom);
  const joinMember = ratio(message, joinMessage) > 0.6 || joinMessage === '';

  if(joinMember) {
    store.set(itemsAtom, (prev) => _.uniqBy([...prev, { label: userstate.username, channel, userstate }], 'label'))
  }
}
const getChannelBadgesMethod = (channel: string) => {
  if(_.isUndefined(store.get(badgesAtom)?.[channel])) {
    axios.get(`/api/badges/${channel}`).then((response) => {
      store.set(badgesAtom, (prev) => _.assign(_.cloneDeep(prev), response.data));
    });
  }
}

export const twitchClientMachineAtom = atomWithMachine((get) =>
  createTwitchClientMachine({
    pendingChannel: '',
    channels: get(defaultChannelsAtom),
    messageHandler,
    getChannelBadgesMethod
  })
);
