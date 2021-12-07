import {  GET_TRANSACTIONS_FAILED, GET_TRANSACTIONS_START, GET_TRANSACTIONS_SUCCESS }  from '../actions/transacrions';
import {IAuthData} from "./auth";
import {AnyAction} from "redux";

export interface ITransactions {
  data: any,
  isLoading: boolean,
  error: Error | null,
  isChanged: boolean
}

const initialState: ITransactions = {
  data: [],
  isLoading: false,
  error: null,
  isChanged: false
};

export default function reducer(state = initialState, action: AnyAction) {
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
