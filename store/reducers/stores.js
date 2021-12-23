import {GET_STORES_START, GET_STORES_SUCCESS, GET_STORES_FAILED} from '../actions/stores';
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
    case  GET_STORES_START:
      return {
        ...state,
        isLoading: true,
        isChanged: true
      };
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
