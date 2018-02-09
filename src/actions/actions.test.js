import { begin, success, failure, cancel } from './actions';
import { BEGIN, SUCCESS, FAILURE, CANCEL } from '../constants';


describe('actions', () => {
  const syncActions = {
    begin: { action: begin, type: BEGIN },
    success: { action: success, type: SUCCESS },
    failure: { action: failure, type: FAILURE },
    cancel: { action: cancel, type: CANCEL }
  };

  beforeEach(() => {
    Date.now = jest.genMockFunction().mockReturnValue(1337);
  })

  afterEach(() => {
    Date.now.mockClear()
  })

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
})