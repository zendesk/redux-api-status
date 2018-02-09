import { selectors } from './../reducer'
import trackStatus from './track-status'
import { begin, success, failure } from './../actions'

describe('trackStatus', () => {
  describe('action', () => {
    const ref = 'something'
    const promise = () => new Promise(res => res())
    const action = trackStatus(ref, promise)
    const getState = jest.fn(() => {status: {}})
    let dispatch

    beforeEach(() => {
      selectors.getIsPending = jest.fn()
      selectors.getTimestamp = jest.fn()
      dispatch = jest.fn()
      action(dispatch, getState)
    })

    it('is a function', () => {
      const result = trackStatus('something', () => undefined)

      expect(typeof result === 'function')
    })

    describe('when pending', () => {
      let result

      beforeEach(() => {
        selectors.getIsPending.mockReturnValue(true)
        result = action()(dispatch, getState)
      })

      it('does nothing', () => {
        expect(dispatch)
          .not.toHaveBeenCalled()
      })

      it('resolves with rejected: true', () => {
        expect(result)
          .resolves.toEqual({rejected: true})
      })
    })

    describe('cache', () => {
      const actionWithCache = trackStatus(ref, promise, {cache: 1000})

      describe('when cache specified', () => {
        let result

        beforeEach(() => {
          selectors.getIsPending.mockReturnValue(false)
          selectors.getTimestamp.mockReturnValue(4000)
          Date.now = jest.fn().mockReturnValue(4500)
          result = actionWithCache()(dispatch, getState)
        })

        afterEach(() => {
          selectors.getIsPending.mockClear()
          selectors.getTimestamp.mockClear()
          Date.now.mockClear()
        })

        describe('when within cache time', () => {
          it('does nothing', () => {
            expect(dispatch)
              .not.toHaveBeenCalled()
          })

          it('resolves with rejected: true', () => {
            expect(result)
              .resolves.toEqual({rejected: true})
          })
        })
      })

      describe('when cache expired', () => {
        let result

        beforeEach(() => {
          selectors.getIsPending.mockReturnValue(false)
          selectors.getTimestamp.mockReturnValue(4000)
          Date.now = jest.fn().mockReturnValue(5500)
          result = actionWithCache()(dispatch, getState)
        })

        afterEach(() => {
          selectors.getIsPending.mockClear()
          selectors.getTimestamp.mockClear()
          Date.now.mockClear()
        })

        it('begins the api call', () => {
          expect(dispatch)
            .toHaveBeenCalledWith(begin('something'))
        })
      })
    })

    describe('always when not pending or cached', () => {
      let result

      beforeEach(() => {
        selectors.getIsPending.mockReturnValue(false)
        result = action()(dispatch, getState)
      })

      it('dispatches a begin action', () => {
        expect(dispatch)
          .toHaveBeenCalledWith(begin('something'))
      })
    })

    describe('when promise is successful', () => {
      const actionWithSuccess = trackStatus('something', () => new Promise(res => res({some: 'result'})))
      let result

      beforeEach(async () => {
        selectors.getIsPending.mockReturnValue(false)
        result = await actionWithSuccess()(dispatch, getState)
      })

      it('dispatches a success action', () => {
        expect(dispatch.mock.calls)
          .toEqual([
            [begin('something')],
            [success('something', {some: 'result'})]
          ])
      })

      it('resolves with the response', () => {
        expect(result)
          .toEqual({response: {some: 'result'}})
      })
    })

    describe('when promise is unsuccessful', () => {
      const actionWithSuccess = trackStatus('something', () => new Promise((_, rej) => rej(new Error('some error'))))
      let result

      beforeEach(async () => {
        selectors.getIsPending.mockReturnValue(false)
        result = await actionWithSuccess()(dispatch, getState)
      })

      it('dispatches a success action', () => {
        expect(dispatch.mock.calls)
          .toEqual([
            [begin('something')],
            [failure('something', {error: 'some error'})]
          ])
      })

      it('resolves with the error', () => {
        expect(result)
          .toEqual({error: 'some error'})
      })
    })
  })

  describe('getKey', () => {
    describe('when key is a function', () => {
      it('uses the provided function', () => {
        const key = () => 'something'
        const result = trackStatus(key, () => undefined)

        expect(result.getKey)
          .toEqual(key)
      })

      it('passes arguments into getKey function to provide key', () => {
        const key = (one, two) => `${one}-${two}`
        const result = trackStatus(key, () => undefined)

        expect(result.getKey('one', 'two'))
          .toEqual(key('one', 'two'))
      })
    })

    describe('when key is not a function', () => {
      it('is a function that returns the key', () => {
        const key = 'something'
        const result = trackStatus(key, () => undefined)

        expect(result.getKey())
          .toEqual(key)
      })
    })
  })
})
