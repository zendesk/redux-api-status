# Examples

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Making api calls](#making-api-calls)
- [Making api calls your own way](#making-api-calls-your-own-way)
- [Listening in to fetch actions in your own reducers](#listening-in-to-fetch-actions-in-your-own-reducers)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Making api calls
Getting started tracking API calls with this library is rather easy with the built in `trackApi` thunk action.

This function takes in three parameters

 - **Ref** The unique key for this api call
 - **Promise** Some promise (usually your api call)
  
Using it will look something like this

```js
import { trackApi } from 'alexs-redux-status';

export const fetchTodo = id => trackApi(
  `TODO/${id}/GET`,
  fetch(`/todo/${id}`).then(res => res.json())
)
```

This thunk action will perform the following steps:
1. Dispatch `begin`
2. Dispatch thunk `connectionStats`
3.  If promise is rejected, dispatches failure with the error's message
    
    OR
    
    If promise resolves, dispatches success

Keeping it simple, lets consider if we just wanted to keep track of the status of a todo api call.

When we call our `fetchTodo` action creator it will first dispatch the `begin` action. This will put the ref `TODO/${id}/GET` into a `PENDING` state.
 
We can use the selector `getIsPending` to check this.

```js
import React from 'react';
import { connect } from 'react-redux';
import { statusSelectors, todoSelectors } from './selectors';

const Todo = ({isPending, todo}) => {
  if (isPending) {
    return <div>Loading...</div>;
  }
  
  return <div>{todo.title}</div>;
};

export default connect(
  (state, ownProps) => ({
    todo: state.todos[ownProps.todoId],
    isPending: statusSelectors.getIsPending(state, `TODO/${ownProps.todoId}/GET`)
  })
)(Todo);
```

When a `success` action is dispatched, the ref will be marked as `SUCCESS`.
When a `failure` action is dispatched, the ref will be marked as `FAILED`.

Although it can be useful to know when an api call is successful, keep in mind that a single piece of data can be loaded in via a range of api calls, so it may be best to not conditionally display data based on this.

We can use a few other selectors to now display an error state as well.

```js
import React from 'react';
import { connect } from 'react-redux';
import { statusSelectors, todoSelectors } from './selectors';

const Todo = ({isPending, hasFailed, error, todo}) => {
  if (isPending) {
    return <div>Loading...</div>;
  }
  
  if (hasFailed) {
    return <div>Error: {error}</div>;
  }
  
  // assume it exists
  return <div>{todo.title}</div>;
};

export default connect(
  (state, ownProps) => ({
    todo: state.todos[ownProps.todoId],
    isPending: statusSelectors.getIsPending(state, `TODO/${ownProps.todoId}/GET`),
    hasFailed: statusSelectors.getHasFailed(state, `TODO/${ownProps.todoId}/GET`),
    error: statusSelectors.getErrorMessage(state, `TODO/${ownProps.todoId}/GET`)
  })
)(Todo);
```

## Making api calls your own way
The provided trackApi thunk is pretty basic

```js
export const trackApi = (ref, promise) => (dispatch, getState) => new Promise(res => {
  dispatch(begin(ref));

  dispatch(connectionStats(ref, promise));

  promise
    .then(response => {
      dispatch(success(ref, response));

      res({ response });
    })
    .catch(err => {
      const error = err.message;
      dispatch(failure(ref, { error }));
      res({ error });
    })
});
```

However, if you aren't using redux thunk, or if you want to implement your own logic, please feel free to build your own!

Maybe you don't care about connection stats and instead of rejecting a promise you resolve with an 'error' and 'response' attribute.

That's fine, just build up your own.

```js
export const trackApi = (ref, promise) => async (dispatch, getState) => {
  dispatch(begin(ref));
  
  const { response, error } = await promise;
  
  if (error) {
    dispatch(failure(ref, { error }));
    return;
   }
   
  dispatch(success(ref, response));
}
```

## Listening in to fetch actions in your own reducers
Sometimes you may want to have your own reducers react to the status actions being created via this library.

All of the status actions that are dispatched are of the format `${ref}_${type}`.

This means that when a begin action is dispatched, the type of that action is `${ref}_REQUEST`.

If for example, our ref was 'FETCH_ALL_THE_THINGS', the following action types that can be dispatched are:
- FETCH_ALL_THE_THINGS_REQUEST
- FETCH_ALL_THE_THINGS_SUCCESS
- FETCH_ALL_THE_THINGS_FAILURE
- FETCH_ALL_THE_THINGS_CANCEL

However, with any library this may change in the future, so instead of hard coding the strings yourself, functions are provided by this library to create the action type.

These functions are:
 - successType
 - pendingType
 - failedType
 - cancelType 
 
Each take the ref as a parameter and return the action type.

An example of using this:

```js
import { successType } from 'alexs-redux-status';

const isLoggedIn = (state = false, action) => {
  switch(action.type) {
    case successType('LOGIN'):
      return true;
    case successType('LOGOUT'):
      return false;
    default:
      return state;
  }
}
```
