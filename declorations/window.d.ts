import { Client } from 'tmi.js';

global {
  interface Window {
    twitchClient: Client;
  }
}
