import {  GET_TRANSACTIONS_FAILED, GET_TRANSACTIONS_START, GET_TRANSACTIONS_SUCCESS }  from '../actions/transacrions';
import {CLEAR_STORE, POST_LOGOUT_SUCCESS} from "../actions/auth";

const initialState = {
  data: [],
  isLoading: false,
  error: '',
  isChanged: false
};

/**
 * @description reducer of actions with transactions
 * @param state - the state of the transaction reducer, which is initially equal to initialState
 * @param action - an object that includes the type and data of the corresponding action
 * @returns {{isLoading: boolean, data: *[], isChanged: boolean, error: string}|{isLoading: boolean, data: [], isChanged: boolean, error}|{isLoading: boolean, data, isChanged: boolean, error: string}|{isLoading: boolean, data: [], isChanged: boolean, error: string}}
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case  CLEAR_STORE:
      return initialState;
    case  POST_LOGOUT_SUCCESS:
      return initialState;
    case  GET_TRANSACTIONS_START:
      return {
        ...state,
        error: '',
        isLoading: true,
        isChanged: true
      };
    case  GET_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        error: '',
        data: action.payload,
        isLoading: false,
        isChanged: true
      };
    case  GET_TRANSACTIONS_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isChanged: true
      };
    default:
      return state
  }
}
