import nestSelectors from 'alexs-redux-helpers/selectors/nest-selectors';

import reducer, { selectors } from './reducer';
import { connectionStats, trackApi } from './actions';
import { STATUS_ACTION_TYPES } from './constants';
import {
  requestType,
  successType,
  failureType,
  cancelType
} from './helpers';

const createSelectors = (getState = state => state) => nestSelectors(selectors, getState);
const createReducer = () => reducer;

export default createReducer;

export {
  reducer,
  selectors,
  STATUS_ACTION_TYPES,
  requestType,
  successType,
  failureType,
  cancelType,
  connectionStats,
  trackApi,
  createSelectors
}



