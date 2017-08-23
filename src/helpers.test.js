import { requestType, successType, failureType, cancelType } from './helpers';
import { REQUEST, SUCCESS, FAILURE, CANCEL } from './constants';

describe('helpers', () => {

  describe('requestType', () => {
    it('returns ref + REQUEST action type', () => {
      expect(requestType('something'))
        .toBe(`something/${REQUEST}`)
    })
  })

  describe('successType', () => {
    it('returns ref + SUCCESS action type', () => {
      expect(successType('something'))
        .toBe(`something/${SUCCESS}`)
    })
  })

  describe('failureType', () => {
    it('returns ref + FAILURE action type', () => {
      expect(failureType('something'))
        .toBe(`something/${FAILURE}`)
    })
  })

  describe('cancelType', () => {
    it('returns ref + CANCEL action type', () => {
      expect(cancelType('something'))
        .toBe(`something/${CANCEL}`)
    })
  })
})