import {  POST_PAY_SUCCESS, POST_PAY_FAILED, POST_PAY_START }  from '../actions/pay';
import {AnyAction} from "redux";

export interface IPayData {
  name: string,
  lastName: string,
  company: string,
  email: string,
  token: string,
  resetEnabled: boolean,
}

export interface IPay {
  data: any,
  isLoading: boolean,
  error: Error | null,
  isChanged: boolean
}

const initialState: IPay = {
  data: {},
  isLoading: false,
  error: null,
  isChanged: false
};

export default function reducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case  POST_PAY_FAILED:
      return {
        ...state,
        isLoading: true,
        isChanged: true
      };
    case  POST_PAY_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        isChanged: true
      };
    case  POST_PAY_START:
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
