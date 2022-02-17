import {
  GET_PAYMENT_START,
  GET_PAYMENT_SUCCESS,
  GET_PAYMENT_FAILED,
  ADD_PAYMENT_START,
  ADD_PAYMENT_SUCCESS, ADD_PAYMENT_FAILED
} from '../actions/payment';
import {CLEAR_STORE, POST_LOGOUT_SUCCESS} from "../actions/auth";

export const initialState = {
  data: {},
  isLoading: false,
  error: '',
  isChanged: false
};

/**
 * @description payment action reducer
 * @param state - the state of the payment reducer, which is initially equal to initialState
 * @param action - an object that includes the type and data of the corresponding action
 * @returns {{isLoading: boolean, data: {}, isChanged: boolean, error: string}|{isLoading: boolean, data, isChanged: boolean, start: boolean}|{isLoading: boolean, data, isChanged: boolean, start: boolean, error: string}|{isLoading: boolean, data: {}, isChanged: boolean, start: boolean, error: string}|{isLoading: boolean, data: {}, isChanged: boolean, error}}
 */
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case  CLEAR_STORE:
      return initialState;
    case  POST_LOGOUT_SUCCESS:
      return initialState;
    case  GET_PAYMENT_START:
      return {
        ...state,
        error: '',
        start: true,
        isLoading: true,
        isChanged: true
      };
    case  GET_PAYMENT_SUCCESS:
      return {
        ...state,
        data: action.payload,
        error: '',
        start: false,
        isLoading: false,
        isChanged: true
      };
    case  GET_PAYMENT_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isChanged: true
      };
    case  ADD_PAYMENT_START:
      return {
        ...state,
        start: true,
        isLoading: true,
        isChanged: true
      };
    case  ADD_PAYMENT_SUCCESS:
      return {
        // ...state,
        data: action.payload,
        start: false,
        isLoading: false,
        isChanged: true
      };
    case  ADD_PAYMENT_FAILED:
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

export default reducer;