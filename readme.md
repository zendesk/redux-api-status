# Redux Status
A set of redux actions/selectors/reducers that helps you keep track of api/promise statuses.

## Docs
 - [Getting Started](#getting-started)
 - [Actions](docs/actions.md)
 - [Selectors](docs/selectors.md)
 - [Examples](docs/examples.md)

## Overview

## Getting Started
All that is required to use this library is redux 

### 1. Pre-requisites
**Required**
- redux

**Optional**
- redux-thunk Although you can use the raw actions, the `trackStatus` thunk is provided

### 2. Install the library
```sh
npm install redux-api-status
```

### 3. Add the reducer to your root reducer
Import `createStatusReducer` from the library and add it into your root reducer.

```js
// your root reducer
import createStatusReducer from 'redux-api-status';

export default combineReducers({
  ..., // your other reducers,
  status: createStatusReducer()
})
```

### 4. Using the fetch actions
If you are using redux thunk, the [trackStatus](docs/actions.md#trackstatusref-getpromise-options---thunk) is a quick way to get started.

This action will handle dispatching all of the necessary functions for you to keep track of your api's status, including pending, success and failed.
 
However, if you would prefer to handle all of this yourself [(which is completely fine)](docs/examples.md#making-api-calls-your-own-way) there are non-thunk actions provided as well.

The way the library keeps track of your individual api calls is via a unique string. This unique string is used in actions to specify what request it is for, and selectors to check the status of that request.

Here is an example of making a request to fetch a todo item

```js
import { trackStatus, begin, success, failure } from 'redux-api-status/actions';

const fetchTodoApi = id => api.get(`/todos/${id}`)

// Here it is using the trackStatus thunk action
export const fetchTodo = trackStatus(
  // first argument is the unique string to represent the request
  // it can be a function for dynamic strings based on arguments, or a just a constant string
  id => `TODO/FETCH/${id}`,
  
  // second argument is a function that returns the promise to track
  id => fetchTodoApi(id)
);

// Here is an example using the raw actions
export const fetchTodo = id => async dispatch => {
  const ref = `TODO/FETCH/${id}`;
  
  dispatch(begin(ref))
  
  const { response, error } = await fetchTodoApi(id);
  
  if (error) {
    dispatch(failure(ref, { error }))
    return;
  }
  
  dispatch(success(ref, response))
}
```

### 6. Set up your selectors
To generate the selectors use `createStatusSelectors`, which takes one argument to get the part of the state you are storing this library in.   

```js
// wherever-you-keep-selectors.js
import { createStatusSelectors } from 'redux-api-status';

export const statusSelectors = createStatusSelectors(state => state.status);
```

Using the todo example from above, we can query its state like this

```js
dispatch(fetchTodo('1337'))

// While its pending
statusSelectors.getIsPending(state, `TODO/FETCH/1337`) // true
statusSelectors.getHasLoaded(state, `TODO/FETCH/1337`) // false

// Once its successful
statusSelectors.getIsPending(state, `TODO/FETCH/1337`) // false
statusSelectors.getHasLoaded(state, `TODO/FETCH/1337`) // true
statusSelectors.getTimestamp(state, `TODO/FETCH/1337`) // Timestamp of last successful request

// If it fails
statusSelectors.getIsPending(state, `TODO/FETCH/1337`) // false
statusSelectors.getHasLoaded(state, `TODO/FETCH/1337`) // false
statusSelectors.getHasFailed(state, `TODO/FETCH/1337`) // true
statusSelectors.getErrorMessage(state, `TODO/FETCH/1337`) // Some error message
statusSelectors.getTimestamp(state, `TODO/FETCH/1337`) // null
```

