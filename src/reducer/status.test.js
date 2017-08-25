import reducer, { statusSelectors } from './status';
import {
  PENDING,
  LOADED,
  FAILED,
  BEGIN,
  SUCCESS,
  FAILURE,
  CANCEL
} from './../constants';
import { begin, success, failure, cancel } from './../actions';
import { testStatusAction } from "./test-helpers";
import { NOT_LOADED } from "../constants"

describe('reducer | status', () => {
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

    const expectState = (actionType, action, expectedState) => testStatusAction({
      description: `sets the ref to ${actionType}`,
      actionType,
      reducer,
      action,
      expectedState
    });

    expectState(BEGIN, begin, PENDING);
    expectState(SUCCESS, success, LOADED);
    expectState(FAILURE, failure, FAILED);
    expectState(CANCEL, cancel, null);
  })

  describe('selectors', () => {
    describe('getStatus', () => {
      describe('when no state for provided ref', () => {
        it('returns NOT_LOADED', () => {
          expect(statusSelectors.getStatus({}, 'some ref'))
            .toBe(NOT_LOADED);
        })
      })

      describe('when state for provided ref', () => {
        it('returns the state of the ref', () => {
          expect(statusSelectors.getStatus({ 'some ref': 'some status' }, 'some ref'))
            .toBe('some status');
        })
      })
    });

    describe('getIsPending', () => {
      describe('when not pending', () => {
        it('returns false', () => {
          expect(statusSelectors.getIsPending({ 'some ref': 'not pending' }, 'some ref'))
            .toBe(false);
        })
      })

      describe('when pending', () => {
        it('returns true', () => {
          expect(statusSelectors.getIsPending({ 'some ref': PENDING }, 'some ref'))
            .toBe(true);
        })
      })
    });

    describe('getHasFailed', () => {
      describe('when not failed', () => {
        it('returns false', () => {
          expect(statusSelectors.getHasFailed({ 'some ref': 'not failed' }, 'some ref'))
            .toBe(false);
        })
      })

      describe('when failed', () => {
        it('returns true', () => {
          expect(statusSelectors.getHasFailed({ 'some ref': FAILED }, 'some ref'))
            .toBe(true);
        })
      })
    });

    describe('getHasLoaded', () => {
      describe('when not loaded', () => {
        it('returns false', () => {
          expect(statusSelectors.getHasLoaded({ 'some ref': 'not loaded' }, 'some ref'))
            .toBe(false);
        })
      })

      describe('when loaded ', () => {
        it('returns true', () => {
          expect(statusSelectors.getHasLoaded({ 'some ref': LOADED }, 'some ref'))
            .toBe(true);
        })
      })
    });
  })
})