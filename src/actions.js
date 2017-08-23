import action from 'alexs-redux-helpers/actions'
import {
  REQUEST,
  SUCCESS,
  FAILURE,
  CANCEL
} from './constants'

const createStatusAction = (payload = {}, meta = {}, ref, status) => action(
  `${ref}/${status}`,
  payload,
  { ...meta, status: { ref, type: status, timestamp: Date.now() } }
);

export const begin = (ref, payload, meta) => createStatusAction(payload, meta, ref, REQUEST);
export const success = (ref, payload, meta) => createStatusAction(payload, meta, ref, SUCCESS);
export const failure = (ref, payload, meta) => createStatusAction(payload, meta, ref, FAILURE);
export const cancel = (ref, payload, meta) => createStatusAction(payload, meta, ref, CANCEL);

export const trackApi = (ref, promise) => dispatch => new Promise(res => {
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