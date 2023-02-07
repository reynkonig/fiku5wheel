import { atom } from 'jotai';

export const isSpinningAtom = atom<boolean>(false);
export const chatMembersCanJoinAtom = atom<boolean>(false);
export const joinMessageAtom = atom<string>('');

