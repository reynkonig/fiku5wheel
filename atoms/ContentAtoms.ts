import { atom } from 'jotai';

import { IBadgeSet } from '../common/Interfaces';

export const badgesAtom = atom<{ global: IBadgeSet[] } & Record<string, IBadgeSet[]>>({ global: []})
