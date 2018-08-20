import { createAction } from 'redux-act';
import YoutubeInfo from '../types/YoutubeInfo';

export const setTutorials = createAction('SET_TUTORIALS',
  (tutorials: YoutubeInfo|YoutubeInfo[]) => tutorials);

// export const addTutorial = createAction('ADD_TUTORIAL', 
//   (tutorial: YoutubeInfo) => tutorial)
