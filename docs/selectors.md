<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Selectors](#selectors)
  - [getStatus(state, ref) -> (NOT_LOADED | LOADED | PENDING | FAILED)](#getstatusstate-ref---not_loaded--loaded--pending--failed)
  - [getIsPending(state, ref) -> Bool](#getispendingstate-ref---bool)
  - [getHasLoaded(state, ref) -> Bool](#gethasloadedstate-ref---bool)
  - [getHasFailed(state, ref) -> Bool](#gethasfailedstate-ref---bool)
  - [getFailedAttempts(state, ref) -> Int](#getfailedattemptsstate-ref---int)
  - [getTimestamp(state, ref) -> timestamp](#gettimestampstate-ref---timestamp)
  - [getErrorMessage(state, ref) -> Any (Whatever you set as the error message)](#geterrormessagestate-ref---any-whatever-you-set-as-the-error-message)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Selectors

## getStatus(state, ref) -> (NOT_LOADED | LOADED | PENDING | FAILED)
Returns the status of the ref, if no status is in state this function will return NOT_LOADED.

## getIsPending(state, ref) -> Bool
Returns whether or not a ref is currently pending.

## getHasLoaded(state, ref) -> Bool
Returns true if the ref has a status of LOADED

## getHasFailed(state, ref) -> Bool
Returns true if the ref has a status of FAILED

## getFailedAttempts(state, ref) -> Int
Returns the amount of failed attempts for the given ref

## getTimestamp(state, ref) -> timestamp
Returns the timestamp of the last successful api request for the given ref.

## getErrorMessage(state, ref) -> Any (Whatever you set as the error message)
Returns the error message for the give ref.
