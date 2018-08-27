import { types, util } from 'vortex-api';

import * as actions from '../actions/session';

/**
 * reducer for changes to ephemeral session state
*/
const INVALID_TUTORIAL_ID: number = -1;

const sessionReducer: types.IReducerSpec = {
  reducers: {
    [actions.setTutorialOpen as any]: (state, payload) => {
    let { tutorialId, isOpen } = payload;
    // If the tutorial id has changed; it's safe to assume that the user
    //  has clicked a new tutorial and he wants it displayed; reason why
    //  we force the isOpen variable to true.
    if ( state.currentTutorial.tutorialId !== payload.tutorialId ) {
      isOpen = true;
    }

    return (
      util.setSafe(state, ['currentTutorial'], {
        tutorialId: tutorialId,
        isOpen: isOpen,
      }));
    },

    [actions.closeTutorials as any]: (state) => {
      return (
        util.setSafe(state, ['currentTutorial'], {
          tutorialId: INVALID_TUTORIAL_ID,
          isOpen: false,
      }));
    },
  },

  defaults: {
    currentTutorial: {
      tutorialId: INVALID_TUTORIAL_ID,
      isOpen: false,
    }
  },
};

export default sessionReducer;