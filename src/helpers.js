import { STATUS_ACTION_TYPES } from './constants';

export const beginType = ref => `${ref}/${STATUS_ACTION_TYPES.BEGIN}`;
export const successType = ref => `${ref}/${STATUS_ACTION_TYPES.SUCCESS}`;
export const failureType = ref => `${ref}/${STATUS_ACTION_TYPES.FAILURE}`;
export const cancelType = ref => `${ref}/${STATUS_ACTION_TYPES.CANCEL}`;