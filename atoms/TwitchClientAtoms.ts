import _ from 'lodash';
import { atom } from 'jotai';
import { Client } from 'tmi.js';

import { ChannelState } from '../common/emums';

export const clientAtom = atom<Client>(new Client({}));
export const clientConnectedAtom = atom<boolean>(false);
export const channelStatesAtom = atom<Record<string, ChannelState>>({});
export const connectingChannelsAtom = atom<string[]>(
  (get) => {
    return _.keys(
      _.pickBy(get(channelStatesAtom), (state) => state === ChannelState.Joining || state === ChannelState.JoinPlanned)
    )
  }
);

export const readyAtom = atom<boolean>(
  (get) => {
    return get(clientConnectedAtom) && get(connectingChannelsAtom).length === 0;
  }
);
