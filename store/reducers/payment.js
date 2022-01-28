import {
  GET_PAYMENT_START,
  GET_PAYMENT_SUCCESS,
  GET_PAYMENT_FAILED,
  ADD_PAYMENT_START,
  ADD_PAYMENT_SUCCESS, ADD_PAYMENT_FAILED
} from '../actions/payment';
import {CLEAR_STORE, POST_LOGOUT_SUCCESS} from "../actions/auth";

const initialState = {
  data: {},
  isLoading: false,
  error: '',
  isChanged: false
};

/**
 * @description reducer действий с платежом
 * @param state - состояние reducer платежа, котоое изначально равно initialState
 * @param action - объект, котоырй включает себя тип и данные соответсвующего экшена
 * @returns {{isLoading: boolean, data: {}, isChanged: boolean, error: string}|{isLoading: boolean, data, isChanged: boolean, start: boolean}|{isLoading: boolean, data, isChanged: boolean, start: boolean, error: string}|{isLoading: boolean, data: {}, isChanged: boolean, start: boolean, error: string}|{isLoading: boolean, data: {}, isChanged: boolean, error}}
 */
export default function reducer(state = initialState, action) {
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
