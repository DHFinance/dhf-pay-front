import {GET_TRANSACTION_START, GET_TRANSACTION_SUCCESS, GET_TRANSACTION_FAILED} from "../actions/transaction";
import {IAuthData} from "./auth";
import {AnyAction} from "redux";

export interface IAuth {
  data: IAuthData,
  isLoading: boolean,
  error: Error | null,
  isChanged: boolean
}

const initialState = {
  data: {},
  isLoading: false,
  error: '',
  isChanged: false
};

export default function reducer(state = initialState, action: AnyAction) {
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
