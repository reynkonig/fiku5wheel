import { atom } from 'jotai';

import { IBadges } from '../common/Interfaces';

export const badgesAtom = atom<IBadges>({ local: [], global: []})
