import {  GET_USERS_FAILED, GET_USERS_SUCCESS, GET_USERS_START }  from '../actions/users';

const initialState = {
  data: [],
  isLoading: false,
  error: '',
  isChanged: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
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
