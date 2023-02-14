import { createMachine } from 'xstate';

export const createPanelMachine = () => createMachine({
  id: 'panel_machine',
  initial: 'main',
  predictableActionArguments: true,
  states: {
    main: {
      on: {
        OPEN_SETTINGS: 'settings'
      }
    },
    settings: {
      on: {
        BACK: 'main'
      }
    }
  }
})
