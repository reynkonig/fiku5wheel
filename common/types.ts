import { Userstate } from 'tmi.js';

export type TwitchMessageHandler = (channel: string, userstate: Userstate, message: string, self: boolean) => void;

export type GetTwitchChannelBadgesMethod = (channel: string) => void;
