import {  GET_FAILED,  GET_START,  GET_SUCCESS }  from '../actions/getData';

const initialState = {
  data: {},
  isLoading: false,
  error: '',
  isChanged: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case  GET_START:
      return {
        ...state,
        isLoading: true,
        isChanged: true
      };
    case  GET_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        isChanged: true
      };
    case  GET_FAILED:
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
