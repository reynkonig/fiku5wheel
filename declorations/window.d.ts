import { Client } from 'tmi.js';

global {
  interface Window {
    LastStoreUID: string;
    twitchClient: Client;
  }
}
