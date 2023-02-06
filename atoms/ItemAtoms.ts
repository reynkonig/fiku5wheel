import _ from 'lodash';
import { atom } from 'jotai';

import { IListedItem } from '../common/interfaces';

export const itemsAtom = atom<IListedItem[]>(
  [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
);

export const itemsCountAtom = atom((get) => get(itemsAtom).length);

export const addItemAtom = atom(null, (get, set, newItem: IListedItem) => {
  const items = get(itemsAtom);
  set(itemsAtom, _.uniqBy([..._.cloneDeep(items), newItem], 'label'));
})

export const removeItemAtom = atom(null, (get, set, itemLabel: string) => {
  set(itemsAtom, get(itemsAtom).filter((item) => item.label !== itemLabel))
});

export const clearItemsAtom = atom(null, (get, set) => set(itemsAtom, []));

export const itemLabelsAtom = atom<string[]>((get) => {
  const labels = get(itemsAtom).map((item) => item.label);

  return labels.length > 0 ? _.uniq(labels) : [''];
});

export const winnerLabelAtom = atom<string>('');

export const winnerAtom =  atom<IListedItem | undefined>(
  (get) => get(itemsAtom).find((item) => item.label === get(winnerLabelAtom))
);
