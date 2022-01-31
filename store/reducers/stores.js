import {GET_STORES_START, GET_STORES_SUCCESS, GET_STORES_FAILED} from '../actions/stores';
import {CLEAR_STORE, POST_LOGOUT_SUCCESS} from "../actions/auth";

const initialState = {
  data: [],
  isLoading: false,
  error: '',
  isChanged: false
};

/**
 * @description shop action reducer
 * @param state - store reducer state, which is initially equal to initialState
 * @param action - an object that includes the type and data of the corresponding action
 * @returns {{isLoading: boolean, data: *[], isChanged: boolean, error: string}|{isLoading: boolean, data: [], isChanged: boolean, error}|{isLoading: boolean, data: [], isChanged: boolean, error: string}|{isLoading: boolean, data: *, isChanged: boolean, error: string}}
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case  CLEAR_STORE:
      return initialState;
    case  POST_LOGOUT_SUCCESS:
      return initialState;
    case  GET_STORES_START:
      return {
        ...state,
        isLoading: true,
        isChanged: true
      };
      /**
       * @description getting stores in a list sorted in descending order
       */
    case  GET_STORES_SUCCESS:
      return {
        ...state,
        data: action.payload.sort((a, b) => a.id - b.id),
        isLoading: false,
        isChanged: true
      };
    case  GET_STORES_FAILED:
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
