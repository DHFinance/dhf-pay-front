import { createStore, applyMiddleware, combineReducers } from 'redux';
import { HYDRATE, createWrapper } from 'next-redux-wrapper';
import thunkMiddleware from 'redux-thunk';
import getQuery from "./reducers/getQuery";
import postQuery from "./reducers/postQuery";
import auth from "./reducers/auth";


const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const combinedReducer = combineReducers({
  getQuery,
  postQuery,
  auth
});

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
    };

    for(const item in action.payload) {
      if (action.payload[item].isChanged) {
        nextState[item] = action.payload[item];
      }
    }
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

export const initStore = () => {
  return createStore(reducer, bindMiddleware([thunkMiddleware]));
};

export const wrapper = createWrapper(initStore);
