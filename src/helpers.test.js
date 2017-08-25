import { beginType, successType, failureType, cancelType } from './helpers';
import { BEGIN, SUCCESS, FAILURE, CANCEL } from './constants';

describe('helpers', () => {

  describe('beginType', () => {
    it('returns ref + BEGIN action type', () => {
      expect(beginType('something'))
        .toBe(`something/${BEGIN}`)
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