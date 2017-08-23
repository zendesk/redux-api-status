import { begin, success, failure, cancel, trackApi } from './actions';
import { REQUEST, SUCCESS, FAILURE, CANCEL } from './constants';

Date.now = jest.genMockFunction().mockReturnValue(1337);

describe('actions', () => {

  const syncActions = {
    begin: { action: begin, type: REQUEST },
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
    describe('always', () => {
      let dispatch;
      let result;

      beforeEach(() => {
        dispatch = jest.fn();
        result = trackApi('some ref', new Promise(res => res()))(dispatch);
      })

      it('dispatches a begin action', () => {
        expect(dispatch)
          .toHaveBeenCalledWith(begin('some ref'))
      })
    })

    describe('when promise is successful', () => {
      let dispatch;
      let result;

      beforeEach(async () => {
        dispatch = jest.fn();
        result = await trackApi('some ref', new Promise(res => res({ some: 'result' })))(dispatch);
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
      let dispatch;
      let result;

      beforeEach(async () => {
        dispatch = jest.fn();
        result = await trackApi('some ref', new Promise((_, rej) => rej(new Error('some error'))))(dispatch);
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