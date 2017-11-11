# Actions

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Action Types (ref => string)](#action-types-ref--string)
- [begin(ref, payload = {}, meta = {})](#beginref-payload---meta--)
- [success(ref, payload = {}, meta = {})](#successref-payload---meta--)
- [failure(ref, payload = {}, meta = {})](#failureref-payload---meta--)
- [cancel(ref, payload = {}, meta = {})](#cancelref-payload---meta--)
- [trackApi(ref, promise, options = {}) [thunk]](#trackapiref-promise-options---thunk)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Action Types (ref => string)
To generate action types you can import and use the following functions 

- beginType
- successType
- failureType
- cancelType

## begin(ref, payload = {}, meta = {})
  - status for the given ref will be set to PENDING
    
## success(ref, payload = {}, meta = {})
  - status for the given ref will be set to LOADED
  - timestamp for the given ref will be set
  - resets failed count back to 0
    
## failure(ref, payload = {}, meta = {})
   - status for the given ref will be set to FAILED
   - increases the failed count by 1
     
## cancel(ref, payload = {}, meta = {})
  - status for the given ref will be set to null
  - resets failed count back to 0    

## trackApi(ref, promise, options = {}) [thunk]
Options:
  - cacheTime (default 30000) How much time in milliseconds to wait before another trackApi function can be called
  - getStatus (default `state => state.status`) Function that returns the part of the redux state the status reducer is

This action handles the whole life cycle of an api request.
This function also handles checking if the given ref is already pending, or has recently been called and will bail out if so.

The steps this actions takes looks like
1. Check if ref is currently pending, bail out if it is
2. Check if ref has is within the specified cache time, bail out if it is
3. Dispatch begin
4.  If promise is rejected, dispatches failure with the error's message
    
    OR
    
    If promise resolves, dispatches success with the response as the payload