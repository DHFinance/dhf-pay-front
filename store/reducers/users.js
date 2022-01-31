import {  GET_USERS_FAILED, GET_USERS_SUCCESS, GET_USERS_START }  from '../actions/users';
import {CLEAR_STORE, POST_LOGOUT_SUCCESS} from "../actions/auth";

const initialState = {
  data: [],
  isLoading: false,
  error: '',
  isChanged: false
};

/**
 * @description user action reducer
 * @param state - the state of the reducer by the users, which is initially equal to initialState
 * @param action - an object that includes the type and data of the corresponding action
 * @returns {{isLoading: boolean, data: *[], isChanged: boolean, error: string}|{isLoading: boolean, data: [], isChanged: boolean, error}|{isLoading: boolean, data, isChanged: boolean, error: string}|{isLoading: boolean, data: [], isChanged: boolean, error: string}}
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case  CLEAR_STORE:
      return initialState;
    case  POST_LOGOUT_SUCCESS:
      return initialState;
    case  GET_USERS_START:
      return {
        ...state,
        isLoading: true,
        isChanged: true
      };
    case  GET_USERS_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        isChanged: true
      };
    case  GET_USERS_FAILED:
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
