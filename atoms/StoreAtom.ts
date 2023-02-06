import axios from 'axios';
import _ from 'lodash';
import { createStore } from 'jotai';
import { ratio } from 'fuzzball';

import { Userstate } from 'tmi.js';
import { ChannelState } from '../common/emums';

import { itemsAtom } from './ItemAtoms';
import {
  twitchClientAtom,
  twitchChannelStatesAtom,
  twitchClientConnectedAtom,
} from './TwitchClientAtoms';
import { chatMembersCanJoinAtom, joinMessageAtom } from './SessionAtoms';
import { badgesAtom } from './ContentAtoms';


const store = createStore();

store.sub(twitchChannelStatesAtom, () => {
  const { get, set } = store;
  const connected = get(twitchClientConnectedAtom);
  const channelStates = get(twitchChannelStatesAtom);

  const pendingStates = _.pickBy(channelStates, (value) => value === ChannelState.JoinPlanned || value === ChannelState.PartPlanned);

  if(connected && !_.isEmpty(pendingStates)) {
    const newStates = _.mapValues(channelStates, (state, channel) => {
      const twitchClient = get(twitchClientAtom);

      switch (state) {
        case ChannelState.JoinPlanned:
          console.log(`Joining ${channel}`);
          twitchClient.join(channel).then(() => {
            console.log(`Joined ${channel}`);
            set(twitchChannelStatesAtom, (prev) => _.set(_.cloneDeep(prev), channel, ChannelState.Joined));

            axios.get(`/api/badges/${channel}`).then((response) => {
              set(badgesAtom, (prev) => _.merge(_.cloneDeep(prev), response.data));
            })
          });
          return ChannelState.Joining;

        case ChannelState.PartPlanned:
          console.log(`Parting ${channel}`);
          twitchClient.part(channel).then(() => {
            console.log(`Parted ${channel}`);
            set(twitchChannelStatesAtom, (prev) => _.pickBy(_.cloneDeep(prev), (value, key) => key !== channel));
          });
          return ChannelState.Parting;

        default:
          return state
      }
    });

    set(twitchChannelStatesAtom, newStates as Record<string, ChannelState>);
  }
})

const client = store.get(twitchClientAtom);

client.on('message', (channel: string, userstate: Userstate, message: string) => {
  if(!store.get(chatMembersCanJoinAtom)) {
    return;
  }

  const joinMessage = store.get(joinMessageAtom);

  const messageMatch = (ratio(message, joinMessage) >= 0.60) || joinMessage === '';

  if(messageMatch) {
    if(store.get(itemsAtom).find((item) => item.label === userstate.username) === undefined) {
      store.set(itemsAtom, (prev) => [...prev, { label: userstate.username, channel: channel.substring(1), userstate }])
    }
  }
})

export default store;
