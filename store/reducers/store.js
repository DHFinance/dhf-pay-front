import {
  GET_STORE_START,
  GET_STORE_SUCCESS,
  GET_STORE_FAILED,
  ADD_STORE_START,
  ADD_STORE_SUCCESS, ADD_STORE_FAILED, EDIT_STORE_SUCCESS, EDIT_STORE_FAILED, EDIT_STORE_START
} from '../actions/store';

const initialState = {
  data: {},
  isLoading: false,
  error: '',
  isChanged: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case  EDIT_STORE_START:
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
    default:
      return state
  }
}
