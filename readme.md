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
- redux-thunk Although you can use the raw actions, the `trackApi` thunk is provided

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
If you are using redux thunk, the [trackApi](docs/fetch-api.md#fetchactionref-promise-optimistic-thunk) is a quick way to get started.

This action will handle dispatching all of the necessary functions for you to keep track of your api's status, including pending, success, failed and whether or not he connection is taking a while.
 
However, if you would prefer to handle all of this yourself [(which is completely fine)](docs/examples.md#making-api-calls-your-own-way) there are non-thunk actions provided as well.

The way the fetch feature keeps track of your individual api calls is via a unique ref.
It is recommended that you create ref generator functions to easily produce these refs.

```js
import { trackApi, begin, success, failure } from 'redux-api-status/actions';

const fetchTodoApi = id => api(`/todos/${id}`)
const fetchTodoRef = id => `/TODO/${id}/GET`;

const saveTodoApi = (id, fields) => api.post(`/todos/${id}`, fields)
const saveTodoRef = id => `/TODO/${id}/SAVE`;

const removeTodoApi = id => api
  .delete(`/todos/${id}`)
  .then(response => ({ response }))
  .then(err => ({ error: err.message }))

const removeTodoRef = id => `/TODO/${id}/REMOVE`;

/* Using trackApi thunk */

export const fetchTodo = id => trackApi(
  fetchTodoRef(id),
  fetchTodoApi(id)
);

export const saveTodo = (id, fields) => trackApi(
  saveTodoRef(id),
  saveTodoApi(id, fields)
);

/* Rolling your own */

export const removeTodo = id => async dispatch => {
  const ref = removeTodoRef(id);
  
  dispatch(begin(ref))
  
  const { response, error } = await removeTodoApi(id);
  
  if (error) {
    dispatch(failure(ref, { error }))
    return;
  }
  
  dispatch(success(ref, response))
}
```

### 6. Set up your selectors
To generate the selectors use `createSelectors`, which takes one argument to get the state.   

```js
// wherever-you-keep-selectors.js
import { createStatusSelectors } from 'redux-api-status';

export const fetchSelectors = createStatusSelectors(state => state.status);
```
