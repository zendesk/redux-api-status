import {
  createDynamicReducer,
  createMetaReducer
} from 'alexs-redux-helpers/reducers'
import {
  BEGIN,
  SUCCESS,
  FAILURE,
  CANCEL
} from './../constants';

const reducer = createMetaReducer('status', createDynamicReducer({
  initial: null,
  [BEGIN]: [action => action.ref, null],
  [SUCCESS]: [action => action.ref, null],
  [CANCEL]: [action => action.ref, null],
  [FAILURE]: [action => action.ref, (_, __, action) => action.payload.error],
}));

const getErrorMessage = (state, ref) => state[ref];

export default reducer;

export const errorSelectors = {
  getErrorMessage
};
