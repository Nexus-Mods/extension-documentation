import { types, util } from 'vortex-api';

import * as actions from '../actions/session';

/**
 * reducer for changes to ephemeral session state
*/
const sessionReducer: types.IReducerSpec = {
  reducers: {
    [actions.setTutorialOpen as any]: (state, payload) => {
      const { id, open } = payload;
      return util.setSafe(state, ['open', id], open);
    },
  },

  defaults: {
    open: {},
  },
};

export default sessionReducer;