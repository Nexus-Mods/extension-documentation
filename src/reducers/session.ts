import { types, util } from 'vortex-api';

import * as actions from '../actions/session';

/**
 * reducer for changes to ephemeral session state
*/
const sessionReducer: types.IReducerSpec = {
  reducers: {
    [actions.setTutorials as any]: (state, payload) =>
      util.setSafe(state, ['tutorials'], payload),
    // [actions.addTutorial as any]: (state, payload) =>
    //   util.setSafe(state, ['tutorials'], payload),
  },
  defaults: {
    tutorials: [],
    //tutorial: {},
  },
};

export default sessionReducer;