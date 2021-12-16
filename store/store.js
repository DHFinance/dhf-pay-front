import { createStore, applyMiddleware, combineReducers } from 'redux';
import { HYDRATE, createWrapper } from 'next-redux-wrapper';
import thunkMiddleware from 'redux-thunk';
import getQuery from "./reducers/getQuery";
import postQuery from "./reducers/postQuery";
import payments from "./reducers/payments"
import payment from "./reducers/payment"
import transactions from "./reducers/transactions"
import transaction from "./reducers/transaction";
import users from "./reducers/users"
import user from "./reducers/user"
import auth from "./reducers/auth";
import pay from "./reducers/pay";
import storeData from "./reducers/store";
import storesData from "./reducers/stores";


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
  auth,
  payments,
  payment,
  transactions,
  users,
  pay,
  transaction,
  storeData,
  storesData,
  user
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

const store = createStore(reducer, bindMiddleware([thunkMiddleware]));

const initStore = () => {
  return store
};

export const wrapper = createWrapper(initStore);
