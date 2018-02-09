import { selectors } from '../reducer/index'
import { begin, failure, success } from './actions'

const trackStatus = (getKey, getPromise, options = {}) => {
  const getKeyFn = typeof getKey === 'function' ? getKey : (() => getKey)

  const callFn = (...args) => (dispatch, getState) => new Promise(res => {
    const getStatus = options.getStatus || ((state = {}) => state.status)
    const state = getStatus(getState())
    const key = getKeyFn(...args)

    if (selectors.getIsPending(state, key)) {
      res({rejected: true})
      return
    }

    const cache = options.cache

    if (cache && Date.now() - selectors.getTimestamp(state, key) < cache) {
      res({rejected: true})
      return
    }

    dispatch(begin(key))

    getPromise(...args)
      .then(response => {
        dispatch(success(key, response))

        res({response})
      })
      .catch(err => {
        const error = err.message
        dispatch(failure(key, {error}))
        res({error})
      })
  })

  callFn.getKey = getKeyFn

  return callFn
}

export default trackStatus
