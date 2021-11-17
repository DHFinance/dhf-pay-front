import { createStore, applyMiddleware, combineReducers } from 'redux';
import { HYDRATE, createWrapper } from 'next-redux-wrapper';
import thunkMiddleware from 'redux-thunk';
import discounts from './reducers/discounts';
import residentials from "./reducers/residentials";
import filter from "./reducers/getData";
import residential from "./reducers/residential";
import modal from "./reducers/modal";
import carousel from "./reducers/carousel";
import map from "./reducers/map";
import developers from "./reducers/developers";
import mortgage from "./reducers/mortgage";

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const combinedReducer = combineReducers({
  discounts,
  residentials,
  carousel,
  filter,
  residential,
  modal,
  map,
  developers,
  mortgage,
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

const initStore = () => {
  return createStore(reducer, bindMiddleware([thunkMiddleware]));
};

export const wrapper = createWrapper(initStore);
