import { selectors } from './reducer'
import { begin, success, failure, cancel, trackApi } from './actions';
import { BEGIN, SUCCESS, FAILURE, CANCEL } from './constants';

Date.now = jest.genMockFunction().mockReturnValue(1337);

describe('actions', () => {

  const syncActions = {
    begin: { action: begin, type: BEGIN },
    success: { action: success, type: SUCCESS },
    failure: { action: failure, type: FAILURE },
    cancel: { action: cancel, type: CANCEL }
  };

  Object.keys(syncActions).forEach(status => {
    const action = syncActions[status].action;
    const type = syncActions[status].type;

    describe(status, () => {
      const payload = { some: 'payload' };
      const meta = { some: 'meta' };
      const ref = 'some ref'

      it(`returns an ${status} action object`, () => {
        expect(action(ref, payload, meta))
          .toEqual({
            type: `some ref/${type}`,
            payload,
            meta: {
              some: 'meta',
              status: { ref, type, timestamp: Date.now() }
            }
          })
      })
    });
  });

  describe('trackApi', () => {
    const dispatch = jest.fn()
    const getState = jest.fn()
    const mockApi = new Promise(res => res())
    let result

    beforeEach(() => {
      selectors.getIsPending = jest.fn()
      selectors.getTimestamp = jest.fn()
      dispatch.mockClear()
    })

    afterEach(() => {
      selectors.getIsPending.mockReset()
      selectors.getTimestamp.mockReset()
    })

    describe('limit api calls', () => {
      beforeEach(() => {
        selectors.getIsPending.mockReturnValue(true)
        selectors.getTimestamp.mockReturnValue(2000)
        Date.now = jest.fn().mockReturnValue(4000)

        result = trackApi('some ref', new Promise(res => res()))(dispatch, getState)
      })

      afterEach(() => {
        selectors.getIsPending.mockClear()
        selectors.getTimestamp.mockClear()
        Date.now.mockClear()
      })

      it('resolves the promise with empty object when ref is stored for less than default (30s) time', () => {
        const subject = trackApi('some ref', mockApi)(dispatch, getState)

        return expect(subject)
          .resolves.toEqual({})
      })

      it('resolves the promise with empty object when ref is stored for less than specified (30s) time', () => {
        return expect(trackApi('some ref', mockApi, { cacheTime: 1000 })(dispatch, getState))
          .resolves.toEqual({})
      })
    })


    describe('when not pending or cached', () => {
      beforeEach(() => {
        selectors.getIsPending.mockReturnValue(false)
        result = trackApi('some ref', mockApi, { cacheTime: 0 })(dispatch, getState);
      })

      afterEach(() => {
        selectors.getIsPending.mockClear()
        selectors.getTimestamp.mockClear()
        Date.now.mockClear()
      })

      it('dispatches a begin action', () => {
        expect(dispatch)
          .toHaveBeenCalledWith(begin('some ref'))
      })
    })

    describe('when promise is successful', () => {
      beforeEach(async () => {
        selectors.getIsPending.mockReturnValue(false)

        result = await trackApi('some ref', new Promise(res => res({ some: 'result' })))(dispatch, getState);
      })

      it('dispatches a success action', async () => {
        expect(dispatch)
          .toHaveBeenCalledTimes(2)

        expect(dispatch.mock.calls)
          .toEqual([[begin('some ref')], [success('some ref', { some: 'result' })]])

      })

      it('returns an object with the response', async () => {
        expect(result)
          .toEqual({ response: { some: 'result' } })
      })
    })

    describe('when promise fails', () => {
      beforeEach(async () => {
        result = await trackApi('some ref', new Promise((_, rej) => rej(new Error('some error'))))(dispatch, getState);
      })

      it('dispatches a failure action', async () => {
        expect(dispatch)
          .toHaveBeenCalledTimes(2)

        expect(dispatch.mock.calls)
          .toEqual([[begin('some ref')], [failure('some ref', { error: 'some error' })]])

      })

      it('returns an object with the response', async () => {
        expect(result)
          .toEqual({ error: 'some error' })
      })
    })
  });
})