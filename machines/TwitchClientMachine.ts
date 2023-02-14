import _ from 'lodash';
import { Client } from 'tmi.js';
import { assign, createMachine } from 'xstate';

import {
  TwitchMessageHandler,
  GetTwitchChannelBadgesMethod
} from '../common/types';
import { timeoutPromise } from '../common/utils';

type TwitchClientContext = {
  channels: string[],
  pendingChannel: string;
  messageHandler: TwitchMessageHandler,
  getChannelBadgesMethod: GetTwitchChannelBadgesMethod
}

const createTwitchClientMachine = ({ pendingChannel, channels, messageHandler, getChannelBadgesMethod }: TwitchClientContext) => createMachine<TwitchClientContext>({
  id: 'state',
  initial: 'uninitialized',
  predictableActionArguments: true,
  context: {
    pendingChannel,
    messageHandler,
    channels,
    getChannelBadgesMethod,
  },
  states: {
    uninitialized: {
      invoke: {
        id: 'twitch_client_initialize',
        src: async (ctx) => {
          if (!window.twitchClient) {
            window.twitchClient = new Client({ channels: _.cloneDeep(ctx.channels), options: { debug: true } });
            window.twitchClient.on('message', ctx.messageHandler);
            window.twitchClient.on('join', (channel: string, username: string, self: boolean) => {
              if(self) {
                ctx.getChannelBadgesMethod(channel.replace('#', ''));
              }
            });
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
        onDone: 'ready',
        onError: 'disconnected'
      }
    },
    parting: {
      invoke: {
        id: 'twitch_client_parting_channel',
        src: async (ctx, event) => {
          try {
            await timeoutPromise(window.twitchClient.part(event.value), 2500);
          } catch (error) {}

          return event.value;
        },
        onDone: {
          target: 'ready',
          actions: [ assign({
            pendingChannel: (ctx, event) => '',
            channels: (ctx, event) => ctx.channels.filter((val) => val != event.data)
          }), 'clearPendingChannel']
        }
      }
    },
    joining: {
      invoke: {
        id: 'twitch_client_join_channel',
        src: async (ctx, event) => {
         if(event.value) {
           return await timeoutPromise(
             window.twitchClient.join(event.value),
             2500
           );
         }
        },
        onDone: {
          target: 'ready',
          actions: [assign( {
            channels: (ctx, event) => {
              return event.data
                ? [...ctx.channels, event.data[0].replace('#', '')]
                : ctx.channels;
            }
          }), 'clearPendingChannel' ]
        },
        onError: 'ready',
      }
    },
    ready: {
      on: {
        PART: {
          target: 'parting',
          actions: ['setPendingChannel']
        },
        JOIN: {
          target: 'joining',
          actions: ['setPendingChannel']
        }
      }
    }
  },
}, {
  actions: {
    clearPendingChannel: assign({
      pendingChannel: (ctx, event) => ''
    }),
    setPendingChannel: assign({
      pendingChannel: (ctx, event) => event.value
    }),
  }
});



export { createTwitchClientMachine };
