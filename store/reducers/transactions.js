import {  GET_TRANSACTIONS_FAILED, GET_TRANSACTIONS_START, GET_TRANSACTIONS_SUCCESS }  from '../actions/transacrions';

const initialState = {
  data: [],
  isLoading: false,
  error: '',
  isChanged: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case  GET_TRANSACTIONS_START:
      return {
        ...state,
        isLoading: true,
        isChanged: true
      };
    case  GET_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        isChanged: true
      };
    case  GET_TRANSACTIONS_FAILED:
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
