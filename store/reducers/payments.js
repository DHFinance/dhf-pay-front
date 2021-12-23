import {GET_PAYMENTS_START, GET_PAYMENTS_SUCCESS, GET_PAYMENTS_FAILED, PUSH_PAYMENT} from '../actions/payments';
import {CLEAR_STORE, POST_LOGOUT_SUCCESS} from "../actions/auth";

const initialState = {
  data: [],
  isLoading: false,
  error: '',
  isChanged: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case  CLEAR_STORE:
      return initialState;
    case  POST_LOGOUT_SUCCESS:
      return initialState;
    case  GET_PAYMENTS_START:
      return {
        ...state,
        error: '',
        isLoading: true,
        isChanged: true
      };
    case  GET_PAYMENTS_SUCCESS:
      return {
        ...state,
        error: '',
        data: action.payload,
        isLoading: false,
        isChanged: true
      };
    case  PUSH_PAYMENT:
      return {
        ...state,
        data: [
            ...state.data,
          action.payload
        ],
        isLoading: false,
        isChanged: true
      };
    case  GET_PAYMENTS_FAILED:
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
