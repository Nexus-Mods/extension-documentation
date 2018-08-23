import { createAction } from 'redux-act';
import YoutubeInfo from '../types/YoutubeInfo';

export const setTutorials = createAction('SET_TUTORIALS',
  (tutorials: YoutubeInfo|YoutubeInfo[]) => tutorials);

export const toggleTutorial = createAction('TOGGLE_TUTORIAL',
  (id: number, open: boolean) => ({ id, open }));