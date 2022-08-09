import { SET_UPDATE_CAPTCHA, GET_USER_FAILED, GET_USER_SUCCESS, GET_USER_START, SET_CAPTCHA_TOKEN, BLOCK_USER_SUCCESS, BLOCK_USER_START, BLOCK_USER_FAILED }  from '../actions/user';
import {CLEAR_STORE} from "../actions/auth";

const initialState = {
  data: {},
  isLoading: false,
  error: '',
  isChanged: false,
  captchaToken: '',
  update: '',
};

/**
 * @description user action reducer
 * @param state - the state of the user's reducer, which is initially equal to initialState
 * @param action - an object that includes the type and data of the corresponding action
 * @returns {{isLoading: boolean, data: {}, isChanged: boolean, error: string}|{isLoading: boolean, data: {}, isChanged: boolean, error: string}|{isLoading: boolean, data: {}, isChanged: boolean, error}|{isLoading: boolean, data, isChanged: boolean, error: string}}
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case  CLEAR_STORE:
      return initialState;
    case  GET_USER_START:
      return {
        ...state,
        isLoading: true,
        isChanged: true
      };
    case SET_UPDATE_CAPTCHA:
      return {
        ...state,
        update: action.payload
      }
    case SET_CAPTCHA_TOKEN:
      return {
        ...state,
        captchaToken: action.payload
      }
    case  GET_USER_SUCCESS:
      return {
        ...state,
        data: action.payload,
        error: '',
        isLoading: false,
        isChanged: true
      };
    case  GET_USER_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isChanged: true
      };
    case  BLOCK_USER_START:
      return {
        ...state,
        isLoading: true,
        isChanged: true
      };
    case  BLOCK_USER_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        isChanged: true
      };
    case  BLOCK_USER_FAILED:
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
