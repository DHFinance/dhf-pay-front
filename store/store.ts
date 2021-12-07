import {createStore, applyMiddleware, combineReducers, Middleware, AnyAction} from 'redux';
import { HYDRATE, createWrapper } from 'next-redux-wrapper';
import thunkMiddleware from 'redux-thunk';
import payments from "./reducers/payments"
import payment from "./reducers/payment"
import transactions from "./reducers/transactions"
import transaction from "./reducers/transaction";
import users from "./reducers/users"
import auth, {IAuth} from "./reducers/auth";
import pay from "./reducers/pay";

const bindMiddleware = (middleware: Middleware[]) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const combinedReducer = combineReducers({
  auth,
  payments,
  payment,
  transactions,
  users,
  pay,
  transaction
});

interface RootState {
  auth: IAuth,
  payments,
  payment,
  transactions,
  users,
  pay,
  transaction
}

const reducer = (state: RootState, action: AnyAction) => {
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
