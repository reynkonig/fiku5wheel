import { atom } from 'jotai';

import { IBadgeSet } from '../common/interfaces';

export const badgesAtom = atom<{ global: IBadgeSet[] } & Record<string, IBadgeSet[]>>({ global: []})
