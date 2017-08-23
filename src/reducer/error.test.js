import reducer, { errorSelectors } from './error';
import {
  REQUEST,
  SUCCESS,
  FAILURE,
  CANCEL
} from './../constants';
import { begin, success, failure, cancel } from './../actions';
import { testStatusAction } from "./test-helpers";

describe('reducer | error', () => {
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

    const expectNull = (actionType, action) => testStatusAction({
      description: 'sets the ref to null',
      actionType,
      action,
      reducer,
      success,
      expectedState: null
    });

    expectNull(REQUEST, begin);
    expectNull(SUCCESS, success);
    expectNull(CANCEL, cancel);
    testStatusAction({
      description: 'sets the ref to the error message',
      actionType: FAILURE,
      reducer,
      action: ref => failure(ref, { error: 'some error' }),
      expectedState: 'some error'
    });
  })

  describe('selectors', () => {
    describe('getErrorMessage', () => {
      it('returns the current state of the provided ref', () => {
        expect(errorSelectors.getErrorMessage({ 'some ref': 'some value' }, 'some ref'))
          .toBe('some value')
      })
    })
  })
})