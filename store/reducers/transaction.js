import {GET_TRANSACTION_START, GET_TRANSACTION_SUCCESS, GET_TRANSACTION_FAILED} from "../actions/transaction";
import {CLEAR_STORE, POST_LOGOUT_SUCCESS} from "../actions/auth";

const initialState = {
  data: {},
  isLoading: false,
  error: '',
  isChanged: false
};

/**
 * @description action reducer with transaction
 * @param state - the state of the transaction reducer, which is initially equal to initialState
 * @param action - an object that includes the type and data of the corresponding action
 * @returns {{isLoading: boolean, data: {}, isChanged: boolean, error: string}|{isLoading: boolean, data, isChanged: boolean, start: boolean, error: string}|{isLoading: boolean, data: {}, isChanged: boolean, start: boolean, error: string}|{isLoading: boolean, data: {}, isChanged: boolean, error}}
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case  CLEAR_STORE:
      return initialState;
    case  POST_LOGOUT_SUCCESS:
      return initialState;
    case  GET_TRANSACTION_START:
      return {
        ...state,
        error: '',
        start: true,
        isLoading: true,
        isChanged: true
      };
    case  GET_TRANSACTION_SUCCESS:
      return {
        ...state,
        data: action.payload,
        start: false,
        error: '',
        isLoading: false,
        isChanged: true
      };
    case  GET_TRANSACTION_FAILED:
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
