import {
  GET_STORE_START,
  GET_STORE_SUCCESS,
  GET_STORE_FAILED,
  ADD_STORE_START,
  ADD_STORE_SUCCESS, ADD_STORE_FAILED, EDIT_STORE_SUCCESS, EDIT_STORE_FAILED, EDIT_STORE_START, BlOCK_STORE_FAILED, BlOCK_STORE_START, BlOCK_STORE_SUCCESS
} from '../actions/store';
import {POST_LOGOUT_SUCCESS,CLEAR_STORE} from "../actions/auth.js";



export const initialState = {
  data: {},
  isLoading: false,
  error: '',
  isChanged: false
};

/**
 * @description store action reducer
 * @param state - the state of the reducer by the store, which is initially equal to initialState
 * @param action - an object that includes the type and data of the corresponding action
 * @returns {{isLoading: boolean, data: {}, isChanged: boolean, error: string}|{isLoading: boolean, data, isChanged: boolean, start: boolean, error: string}|{isLoading: boolean, data: {}, isChanged: boolean, start: boolean, error: string}|{isLoading: boolean, data: {}, isChanged: boolean, error}}
 */
const storeData = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_STORE:
      return initialState;
    case POST_LOGOUT_SUCCESS:
      return initialState;
    case EDIT_STORE_START:
      return {
        ...state,
        start: true,
        isLoading: true,
        isChanged: true
      };
    case  EDIT_STORE_SUCCESS:
      return {
        ...state,
        data: action.payload,
        start: false,
        error: '',
        isLoading: false,
        isChanged: true
      };
    case  EDIT_STORE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isChanged: true
      };
    case  GET_STORE_START:
      return {
        ...state,
        start: true,
        isLoading: true,
        isChanged: true
      };
    case  GET_STORE_SUCCESS:
      return {
        ...state,
        data: action.payload,
        start: false,
        isLoading: false,
        isChanged: true
      };
    case  GET_STORE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isChanged: true
      };
    case  ADD_STORE_START:
      return {
        ...state,
        start: true,
        isLoading: true,
        isChanged: true
      };
    case  ADD_STORE_SUCCESS:
      return {
        ...state,
        // data: action.payload,
        start: false,
        isLoading: false,
        isChanged: true
      };
    case  ADD_STORE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isChanged: true
      };
    case  BlOCK_STORE_START:
      return {
        ...state,
        start: true,
        isLoading: true,
        isChanged: true
      };
    case  BlOCK_STORE_SUCCESS:
      return {
        ...state,
        data: action.payload,
        start: false,
        isLoading: false,
        isChanged: true
      };
    case  BlOCK_STORE_FAILED:
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

export default storeData;