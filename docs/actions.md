# Actions

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Action Types (ref => string)](#action-types-ref--string)
- [begin(ref, payload = {}, meta = {})](#beginref-payload---meta--)
- [success(ref, payload = {}, meta = {})](#successref-payload---meta--)
- [failure(ref, payload = {}, meta = {})](#failureref-payload---meta--)
- [cancel(ref/getRef, payload = {}, meta = {})](#cancelrefgetref-payload---meta--)
- [trackStatus(ref, getPromise, options = {}) [thunk]](#trackstatusref-getpromise-options---thunk)

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
     
## cancel(ref/getRef, payload = {}, meta = {})
  - status for the given ref will be set to null
  - resets failed count back to 0    

## trackStatus(ref, getPromise, options = {}) [thunk]
Options:
  - cache (default null) How much time in milliseconds to wait before another trackStatus function can be called
  - getStatus (default `state => state.status`) Function that returns the part of the redux state the status reducer is

This action handles the whole life cycle of an api request.
This function also handles checking if the given ref is already pending, or has recently been called and will bail out if so.

The steps this actions takes looks like
1. Check if ref is currently pending, trackStatus will resolve with `{ rejected: true }`
2. Check if ref has is within the specified cache time, trackStatus will resolve with `{ rejected: true }`
3. Dispatch begin
4. If promise is rejected, dispatches failure with the error's message, trackStatus will resolve with the error's message `{ error: error.message }`
    
   OR
    
   If promise resolves, dispatches success with the response as the payload, trackStatus will resolve with the response `{ response: response }`

In order to re-create the ref you provided, the `trackStatus` function has the attribute `getKey`.
If you didn't pass in a function as the first argument, getKey will just be a function that returns that value.
Otherwise the getKey function will just be the function you passed in.

*Example*

```js
const fetchCat = trackStatus(
  id => `CAT/FETCH/${id}`,
  id => api.getCat(id)
)

// ...
import { connect } from 'react-redux'

connect((state, props) => ({
  isPending: statusSelectors.getIsPending(state, fetchCat.getKey(props.catId))
})

```

