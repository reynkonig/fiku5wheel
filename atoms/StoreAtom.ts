import axios from 'axios';

import { createStore } from 'jotai';

import { badgesAtom } from './ContentAtoms';

const store = createStore();

if(typeof window !== 'undefined') {
  axios.get('/api/badges').then((response) => store.set(badgesAtom, response.data));
}

export default store;

