import {
  GET_PAYMENT_START,
  GET_PAYMENT_SUCCESS,
  GET_PAYMENT_FAILED,
  ADD_PAYMENT_START,
  ADD_PAYMENT_SUCCESS, ADD_PAYMENT_FAILED
} from '../actions/PAYMENT';

const initialState = {
  data: {},
  isLoading: false,
  error: '',
  isChanged: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case  GET_PAYMENT_START:
      return {
        ...state,
        start: true,
        isLoading: true,
        isChanged: true
      };
    case  GET_PAYMENT_SUCCESS:
      return {
        ...state,
        data: action.payload,
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
        ...state,
        // data: action.payload,
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
