export const testStatusAction = ({
                                   description,
                                   actionType,
                                   reducer,
                                   action,
                                   expectedState,
                                   initialRefState = undefined
                                 }) => {
  describe(`when called with a ${actionType} meta action`, () => {
    let result

    beforeEach(() => {
      result = reducer({ 'some ref': initialRefState }, action('some ref'))
    })

    it(description, () => {
      expect(result)
        .toEqual({ 'some ref': expectedState });
    })
  });
}

export const testSelectors = (selector, expectedZeroState) => {
  describe('when no state for provided ref', () => {
    it(`returns ${expectedZeroState}`, () => {
      expect(selector({}, 'some ref'))
        .toBe(expectedZeroState);
    })
  })

  describe('when state for provided ref', () => {
    it('returns the state of the ref', () => {
      expect(selector({ 'some ref': 'some value' }, 'some ref'))
        .toBe('some value');
    })
  })
}