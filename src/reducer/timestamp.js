import {
  createDynamicReducer,
  createMetaReducer
} from 'alexs-redux-helpers/reducers'
import {
  BEGIN,
  SUCCESS,
} from './../constants';

const reducer = createMetaReducer('status', createDynamicReducer({
  initial: null,
  [SUCCESS]: [action => action.ref, (_, action) => action.timestamp]
}));

const getTimestamp = (state, ref) => state[ref];

export default reducer;

export const timestampSelectors = {
  getTimestamp
};
