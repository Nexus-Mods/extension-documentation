import { types, util } from 'vortex-api';

import * as actions from '../actions/session';

/**
 * reducer for changes to ephemeral session state
*/
const sessionReducer: types.IReducerSpec = {
  reducers: {
    [actions.setTutorials as any]: (state, payload) =>
      util.setSafe(state, ['tutorials'], payload),
    [actions.toggleTutorial as any]: (state, payload) => {
      const { id, open } = payload;
      return util.setSafe(state, ['tutorials', id, 'open'], !open);
    },
  },

  defaults: {
    tutorials: [],
  },
};

export default sessionReducer;