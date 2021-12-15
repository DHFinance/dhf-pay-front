import {  GET_USER_FAILED, GET_USER_SUCCESS, GET_USER_START, BLOCK_USER_SUCCESS, BLOCK_USER_START, BLOCK_USER_FAILED }  from '../actions/user';

const initialState = {
  data: {},
  isLoading: false,
  error: '',
  isChanged: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case  GET_USER_START:
      return {
        ...state,
        isLoading: true,
        isChanged: true
      };
    case  GET_USER_SUCCESS:
      return {
        ...state,
        data: action.payload,
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
