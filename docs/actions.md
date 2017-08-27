# Actions

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Action Types (ref => string)](#action-types-ref--string)
- [begin(ref, payload = {}, meta = {})](#beginref-payload---meta--)
- [success(ref, payload = {}, meta = {})](#successref-payload---meta--)
- [failure(ref, payload = {}, meta = {})](#failureref-payload---meta--)
- [cancel(ref, payload = {}, meta = {})](#cancelref-payload---meta--)
- [trackApi(ref, promise) [thunk]](#trackapiref-promise-thunk)

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

## trackApi(ref, promise) [thunk]
This action handles the whole life cycle of an api request.

The steps this actions takes looks like
1. Dispatch begin
2.  If promise is rejected, dispatches failure with the error's message
    
    OR
    
    If promise resolves, dispatches success with the response as the payload