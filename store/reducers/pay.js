import {  POST_PAY_SUCCESS, POST_PAY_FAILED, POST_PAY_START, SET_CASPER_SUCCESS }  from '../actions/pay';
import {CLEAR_STORE, POST_LOGOUT_SUCCESS} from "../actions/auth";

const initialState = {
  data: {},
  isLoading: false,
  error: '',
  isChanged: false
};

/**
 * @description reducer оплаты платежа
 * @param state - состояние reducer оплаты, котоое изначально равно initialState
 * @param action - объект, котоырй включает себя тип и данные соответсвующего экшена
 * @returns {{isLoading: boolean, data: {}, isChanged: boolean, error: string}|{isLoading: boolean, data: {}, isChanged: boolean, error: string}|{isLoading: boolean, data: {}, isChanged: boolean, error}|{isLoading: boolean, data, isChanged: boolean, error: string}}
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case  CLEAR_STORE:
      return initialState;
    case  POST_LOGOUT_SUCCESS:
      return initialState;
    case  POST_PAY_FAILED:
      return {
        ...state,
        isLoading: true,
        isChanged: true
      };
    case  POST_PAY_SUCCESS:
      return {
        ...state,
        // data: action.payload,
        isLoading: false,
        isChanged: true
      };
    case  POST_PAY_START:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isChanged: true
      };
    case SET_CASPER_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        isChanged: true
      };
    default:
      return state
  }
}
