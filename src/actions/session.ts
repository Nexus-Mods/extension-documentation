import { createAction } from 'redux-act';

export const setTutorialOpen = createAction('TOGGLE_TUTORIAL',
  (id: number, open: boolean) => ({ id, open }));