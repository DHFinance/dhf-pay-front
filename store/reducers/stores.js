import {GET_STORES_START, GET_STORES_SUCCESS, GET_STORES_FAILED} from '../actions/stores';

const initialState = {
  data: [],
  isLoading: false,
  error: '',
  isChanged: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case  GET_STORES_START:
      return {
        ...state,
        isLoading: true,
        isChanged: true
      };
    case  GET_STORES_SUCCESS:
      return {
        ...state,
        data: action.payload,
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
