import {GET_TRANSACTION_START, GET_TRANSACTION_SUCCESS, GET_TRANSACTION_FAILED} from "../actions/transaction";

const initialState = {
  data: {},
  isLoading: false,
  error: '',
  isChanged: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case  GET_TRANSACTION_START:
      return {
        ...state,
        start: true,
        isLoading: true,
        isChanged: true
      };
    case  GET_TRANSACTION_SUCCESS:
      return {
        ...state,
        data: action.payload,
        start: false,
        isLoading: false,
        isChanged: true
      };
    case  GET_TRANSACTION_FAILED:
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
