import action from 'alexs-redux-helpers/actions'
import { selectors } from './reducer'
import {
  BEGIN,
  SUCCESS,
  FAILURE,
  CANCEL
} from './constants'

const createStatusAction = (payload = {}, meta = {}, ref, status) => action(
  `${ref}/${status}`,
  payload,
  { ...meta, status: { ref, type: status, timestamp: Date.now() } }
);

export const begin = (ref, payload, meta) => createStatusAction(payload, meta, ref, BEGIN);
export const success = (ref, payload, meta) => createStatusAction(payload, meta, ref, SUCCESS);
export const failure = (ref, payload, meta) => createStatusAction(payload, meta, ref, FAILURE);
export const cancel = (ref, payload, meta) => createStatusAction(payload, meta, ref, CANCEL);

export const trackApi = (ref, promise, options = {}) => (dispatch, getState) => new Promise(res => {
  const getStatus = options.getStatus || ((state = {}) => state.status)

  const state = getStatus(getState())

  if (selectors.getIsPending(state, ref)) {
    res({})
    return
  }

  const cacheTime = options.cacheTime || 30000 // 30 seconds
  if (options.cacheTime !== false && Date.now() - selectors.getTimestamp(state, ref) < cacheTime) {
    res({})
    return
  }

  dispatch(begin(ref));

  promise
    .then(response => {
      dispatch(success(ref, response));

      res({ response });
    })
    .catch(err => {
      const error = err.message;
      dispatch(failure(ref, { error }));
      res({ error });
    })
});
