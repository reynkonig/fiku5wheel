import { atom } from 'jotai';

export const storeUIDAtom = atom<string>('');
export const isSpinningAtom = atom<boolean>(false);
export const chatMembersCanJoinAtom = atom<boolean>(false);
export const joinMessageAtom = atom<string>('');

