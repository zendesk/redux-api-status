import reducer, { failedCountSelectors } from './failed-count';
import {
  SUCCESS,
  FAILURE,
  CANCEL
} from './../constants';
import { begin, success, failure, cancel } from './../actions';
import { testStatusAction } from "./test-helpers";

describe('reducer | failed-count', () => {
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

    const expectCount = (actionType, action, expectedState, initialRefState) => {
      testStatusAction({
        description: `sets the ref to ${expectedState === null ? 'null' : expectedState}`,
        actionType,
        reducer,
        action,
        expectedState,
        initialRefState
      });
    };

    expectCount(SUCCESS, success, 0);
    expectCount(FAILURE, failure, 1);
    expectCount(FAILURE, failure, 6, 5);
    expectCount(CANCEL, cancel, 0);

  })

  describe('selectors', () => {

    describe('getFailedCount', () => {

      describe('when no count for ref in state', () => {
        it('returns 0', () => {
          expect(failedCountSelectors.getFailedCount({}, 'some ref'))
            .toBe(0)
        })
      })

      describe('when count for ref in state', () => {
        it('returns the value of ref in the state', () => {
          expect(failedCountSelectors.getFailedCount({ 'some ref': 1337 }, 'some ref'))
            .toBe(1337)
        })
      })

    })
  })
})