import {
  createDynamicReducer,
  createMetaReducer
} from 'alexs-redux-helpers/reducers'
import {
  SUCCESS,
  FAILURE,
  CANCEL
} from './../constants';

const reducer = createMetaReducer('status', createDynamicReducer({
  initial: 0,
  [SUCCESS]: [action => action.ref, 0],
  [FAILURE]: [action => action.ref, state => state + 1],
  [CANCEL]: [action => action.ref, 0]
}));

const getFailedCount = (state, ref) => state[ref] || 0

export default reducer;

export const failedCountSelectors = {
  getFailedCount
}
