import action from 'alexs-redux-helpers/actions'
import {
  SLOW_CONNECTION,
  REQUEST,
  SUCCESS,
  FAILURE,
  CANCEL
} from './constants'

export const slowConnection = ref => action(SLOW_CONNECTION, { ref })

const createStatusAction = (payload = {}, meta = {}, ref, status) => action(
  `${ref}_${status}`,
  payload,
  { ...meta, fetch: { ref, type: status } }
)

export const begin = (ref, payload, meta) => createStatusAction(payload, meta, ref, REQUEST)
export const success = (ref, payload, meta) => createStatusAction(payload, meta, ref, SUCCESS)
export const failure = (ref, payload, meta) => createStatusAction(payload, meta, ref, FAILURE)
export const cancel = (ref, payload, meta) => createStatusAction(payload, meta, ref, CANCEL)

const slowConnectionTimer = timeout => new Promise(res => {
  setTimeout(() => res({ slow: true }), timeout)
})

const wrapPromise = promise => new Promise(
  res => {
    promise
      .then(response => {
        res({ response })
      })
      .catch(err => {
        res({ error: err && err.message })
      })
  }
)

export const connectionStats = (ref, promise, { slowTimeout = 3000 } = {}) => dispatch => {
  /* Check for a slow connection */
  Promise.race([
    wrapPromise(promise),
    slowConnectionTimer(slowTimeout)
  ])
    .then(({ slow }) => {
        if (slow) {
          dispatch(slowConnection(ref))
        }
      }
    )
}

export const trackApi = (ref, promise) => (dispatch, getState) => new Promise(res => {
  dispatch(begin(ref));

  dispatch(connectionStats(ref, promise));

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