import {
  createMultiReducer,
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
} from './constants';

export default createMultiReducer({
  status: createMetaReducer('status', createDynamicReducer({
    initial: NOT_LOADED,
    [REQUEST]: [action => action.ref, PENDING],
    [SUCCESS]: [action => action.ref, LOADED],
    [FAILURE]: [action => action.ref, FAILED],
    [CANCEL]: [action => action.ref, null]
  })),
  failedCount: createMetaReducer('status', createDynamicReducer({
    initial: 0,
    [SUCCESS]: [action => action.ref, 0],
    [FAILURE]: [action => action.ref, state => state + 1],
    [CANCEL]: [action => action.ref, 0]
  })),
  timestamp: createMetaReducer('status', createDynamicReducer({
    initial: null,
    [REQUEST]: [action => action.ref, null],
    [SUCCESS]: [action => action.ref, action => action.timestamp]
  })),
  error: createMetaReducer('status', createDynamicReducer({
    initial: null,
    [REQUEST]: [action => action.ref, null],
    [SUCCESS]: [action => action.ref, null],
    [CANCEL]: [action => action.ref, null],
    [FAILURE]: [action => action.ref, (_, __, action) => action.payload.error],
  }))
});

const getStatus = (state, ref) => state.status[ref] || NOT_LOADED;
const getErrorMessage = (state, ref) => state.error[ref];
const getTimestamp = (state, ref) => state.timestamp[ref];
const getFailedCount = (state, ref) => state.failedCount[ref] || 0
const getIsPending = ({ status }, ref) => Boolean(status[ref] && status[ref] === PENDING);
const getHasFailed = (state, ref) => getStatus(state, ref) === FAILED
const getHasLoaded = (state, ref) => state.status[ref] === LOADED;

export const selectors = {
  getIsPending,
  getHasFailed,
  getStatus,
  getErrorMessage,
  getTimestamp,
  getHasLoaded
}
