import { STATUS_ACTION_TYPES } from './constants';

export const requestType = ref => `${ref}/${STATUS_ACTION_TYPES.REQUEST}`;
export const successType = ref => `${ref}/${STATUS_ACTION_TYPES.SUCCESS}`;
export const failureType = ref => `${ref}/${STATUS_ACTION_TYPES.FAILURE}`;
export const cancelType = ref => `${ref}/${STATUS_ACTION_TYPES.CANCEL}`;