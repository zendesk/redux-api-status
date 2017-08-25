import nestSelectors from 'alexs-redux-helpers/selectors/nest-selectors';

import reducer, { selectors } from './reducer';
import { trackApi } from './actions';
import { STATUS_ACTION_TYPES } from './constants';
import {
  beginType,
  successType,
  failureType,
  cancelType
} from './helpers';

const createStatusSelectors = (getState = state => state) => nestSelectors(selectors, getState);
const createReducer = () => reducer;

export default createReducer;

export {
  reducer,
  selectors,
  STATUS_ACTION_TYPES,
  beginType,
  successType,
  failureType,
  cancelType,
  trackApi,
  createStatusSelectors
}



