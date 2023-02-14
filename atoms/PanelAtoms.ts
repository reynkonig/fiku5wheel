import { atomWithMachine } from 'jotai-xstate';

import { createPanelMachine } from '../machines/PanelMachine';


export const panelMachineAtom = atomWithMachine(() => createPanelMachine())
