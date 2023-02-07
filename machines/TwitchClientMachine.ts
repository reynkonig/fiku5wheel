import { assign, createMachine } from 'xstate';
import { Client } from 'tmi.js';

import {
  TwitchMessageHandler,
  GetTwitchChannelBadgesMethod
} from '../common/types';

type TwitchClientContext = {
  channels: string[],
  messageHandler: TwitchMessageHandler,
  getChannelBadgesMethod: GetTwitchChannelBadgesMethod
}

const createTwitchClientMachine = ({ channels, messageHandler, getChannelBadgesMethod }: TwitchClientContext) => createMachine<TwitchClientContext>({
  id: 'state',
  initial: 'uninitialized',
  predictableActionArguments: true,
  context: {
    channels,
    messageHandler,
    getChannelBadgesMethod
  },
  states: {
    uninitialized: {
      invoke: {
        id: 'twitch_client_initialize',
        src: async (ctx) => {
          if (!window.twitchClient) {
            window.twitchClient = new Client({ options: { debug: false } });
            window.twitchClient.on('message', ctx.messageHandler);
          }
          else {
            window.twitchClient.removeAllListeners();
          }
        },
        onDone: 'disconnected',
      }
    },
    disconnected: {
      invoke: {
        id: 'twitch_client_connect',
        src: async () => {
          if(window.twitchClient.readyState() === 'CLOSED') {
            return await window.twitchClient.connect();
          }
        },
        onDone: 'joining',
        onError: 'disconnected'
      }
    },
    parting: {
      invoke: {
        id: 'twitch_client_parting_channel',
        src: async (ctx) => {
          const joinedChannels = window.twitchClient.getChannels();
          const { channels: requiredChannels } = ctx;
          await Promise.all(
            joinedChannels.map(async (joinedChannel) => {
              return (
                !requiredChannels.includes(joinedChannel.substring(1))
                  ? await window.twitchClient.part(joinedChannel)
                  : ''
              )
            })
          );
        },
        onDone: 'ready',
        onError: 'rollback'
      }
    },
    joining: {
      invoke: {
        id: 'twitch_client_join_channel',
        src: async (ctx) => {
          const joinedChannels = window.twitchClient.getChannels();
          const { channels: requiredChannels } = ctx;

          await Promise.all(
            requiredChannels.map(async (requiredChannel) => {
              if (!joinedChannels.includes(`#${requiredChannel}`)) {
                await window.twitchClient.join(requiredChannel)
                ctx.getChannelBadgesMethod(requiredChannel);
              }
            })
          );
        },
        onDone: 'ready',
        onError: 'rollback',
      }
    },
    rollback: {
      invoke: {
        id: 'twitch_client_rollback_channels',
        src: assign({
          channels: () => (
            window.twitchClient.getChannels()
              .map((channel) => (
                channel.replace('#', ''))
              )
          )
        })
      }
    },
    ready: {
      on: {
        PART: {
          target: 'parting',
          actions: assign({
            channels: (ctx, event) => ctx.channels.filter((channel) => channel !== event.value)
          })
        },
        JOIN: {
          target: 'joining',
          actions: assign({
            channels: (ctx, event) => [...ctx.channels, event.value]
          })
        }
      }
    }
  },
})


export { createTwitchClientMachine };
