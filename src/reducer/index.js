import { combineReducers } from 'redux';
import nestSelectors from 'alexs-redux-helpers/selectors/nest-selectors';
import status, { statusSelectors } from "./status";
import failedCount, { failedCountSelectors } from "./failed-count";
import error, { errorSelectors } from "./error";
import timestamp, { timestampSelectors } from "./timestamp";

export default combineReducers({
  status,
  failedCount,
  error,
  timestamp
});

export const selectors = {
  ...nestSelectors(statusSelectors, state => state.status),
  ...nestSelectors(failedCountSelectors, state => state.failedCount),
  ...nestSelectors(errorSelectors, state => state.error),
  ...nestSelectors(timestampSelectors, state => state.timestamp)
};
