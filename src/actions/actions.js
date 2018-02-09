import action from 'alexs-redux-helpers/actions'
import {
  BEGIN,
  SUCCESS,
  FAILURE,
  CANCEL
} from '../constants'

const createStatusAction = (payload = {}, meta = {}, ref, status) => action(
  `${ref}/${status}`,
  payload,
  {...meta, status: {ref, type: status, timestamp: Date.now()}}
)

export const begin = (ref, payload, meta) => createStatusAction(payload, meta, ref, BEGIN)
export const success = (ref, payload, meta) => createStatusAction(payload, meta, ref, SUCCESS)
export const failure = (ref, payload, meta) => createStatusAction(payload, meta, ref, FAILURE)
export const cancel = (ref, payload, meta) => createStatusAction(payload, meta, ref, CANCEL)
