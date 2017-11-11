import reducer, { timestampSelectors } from './timestamp';
import {
  SUCCESS
} from './../constants';
import { success } from './../actions';
import { testStatusAction } from "./test-helpers";

Date.now = jest.genMockFunction().mockReturnValue(1337);

describe('reducer | timestamp', () => {
  describe('reducer', () => {
    let result

    describe('initial state', () => {
      beforeEach(() => {
        result = reducer(undefined, { type: 'SOMETHING' });
      })

      it('is an empty object', () => {
        expect(result)
          .toEqual({});
      })
    })

    testStatusAction({
      description: 'sets the ref to the timestamp',
      actionType: SUCCESS,
      action: success,
      expectedState: 1337,
      reducer
    });
  })

  describe('selectors', () => {
    describe('getTimestamp', () => {
      it('returns the current state of the provided ref', () => {
        expect(timestampSelectors.getTimestamp({ 'some ref': 'some value' }, 'some ref'))
          .toBe('some value')
      })
    })
  })
})