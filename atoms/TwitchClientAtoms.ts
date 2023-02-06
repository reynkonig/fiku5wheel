import _ from 'lodash';
import { atom } from 'jotai';
import { Client } from 'tmi.js';

import { ChannelState } from '../common/emums';

export const twitchClientAtom = atom<Client>(new Client({}));
export const twitchClientConnectedAtom = atom<boolean>(false);
export const twitchChannelStatesAtom = atom<Record<string, ChannelState>>({});
export const connectingChannelsAtom = atom<string[]>(
  (get) => {
    return _.keys(
      _.pickBy(get(twitchChannelStatesAtom), (state) => state === ChannelState.Joining || state === ChannelState.JoinPlanned)
    )
  }
);

export const readyAtom = atom<boolean>(
  (get) => {
    return get(twitchClientConnectedAtom) && get(connectingChannelsAtom).length === 0;
  }
);
