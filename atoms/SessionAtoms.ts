import { atom } from 'jotai';
import { Client } from 'tmi.js';

export const isSpinningAtom = atom<boolean>(false);
export const clientAtom = atom<Client>(new Client({ options: { debug: false }}));
export const connectedAtom = atom<boolean>(false);
export const joinedChannelAtom = atom<string>('');
export const joinMessageAtom = atom<string>('');
export const canJoinAtom = atom<boolean>(false);
export const readyAtom = atom<boolean>((get) => get(connectedAtom) && get(joinedChannelAtom) !== '');
