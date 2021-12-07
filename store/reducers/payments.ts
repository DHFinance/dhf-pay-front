import {GET_PAYMENTS_START, GET_PAYMENTS_SUCCESS, GET_PAYMENTS_FAILED, PUSH_PAYMENT} from '../actions/payments';
import {IAuthData} from "./auth";
import {AnyAction} from "redux";

export interface IPayments {
  data: any,
  isLoading: boolean,
  error: Error | null,
  isChanged: boolean
}

const initialState: IPayments = {
  data: [],
  isLoading: false,
  error: null,
  isChanged: false
};

export default function reducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case  GET_PAYMENTS_START:
      return {
        ...state,
        isLoading: true,
        isChanged: true
      };
    case  GET_PAYMENTS_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        isChanged: true
      };
    case  PUSH_PAYMENT:
      return {
        ...state,
        data: [
            ...state.data,
          action.payload
        ],
        isLoading: false,
        isChanged: true
      };
    case  GET_PAYMENTS_FAILED:
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
