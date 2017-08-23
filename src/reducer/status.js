import {
  createDynamicReducer,
  createMetaReducer
} from 'alexs-redux-helpers/reducers'
import {
  NOT_LOADED,
  PENDING,
  LOADED,
  FAILED,
  REQUEST,
  SUCCESS,
  FAILURE,
  CANCEL
} from './../constants';

const reducer = createMetaReducer('status', createDynamicReducer({
  initial: NOT_LOADED,
  [REQUEST]: [action => action.ref, PENDING],
  [SUCCESS]: [action => action.ref, LOADED],
  [FAILURE]: [action => action.ref, FAILED],
  [CANCEL]: [action => action.ref, null]
}));

const getStatus = (state, ref) => state[ref] || NOT_LOADED;
const getIsPending = (state, ref) => Boolean(state[ref] && state[ref] === PENDING);
const getHasFailed = (state, ref) => getStatus(state, ref) === FAILED
const getHasLoaded = (state, ref) => state[ref] === LOADED;

export default reducer;

export const statusSelectors = {
  getStatus,
  getIsPending,
  getHasFailed,
  getHasLoaded
}