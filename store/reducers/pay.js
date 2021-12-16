import {  POST_PAY_SUCCESS, POST_PAY_FAILED, POST_PAY_START }  from '../actions/pay';
import {POST_LOGOUT_SUCCESS} from "../actions/auth";

const initialState = {
  data: {},
  isLoading: false,
  error: '',
  isChanged: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
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
        data: action.payload,
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
    default:
      return state
  }
}
