import {
  POST_LOGIN_FAILED,
  POST_LOGIN_START,
  POST_RESTORE_START,
  POST_LOGOUT_SUCCESS,
  POST_RESTORE_FAILED,
  POST_RESTORE_SUCCESS,
  POST_LOGOUT_FAILED,
  POST_LOGIN_SUCCESS,
  POST_REGISTRATION_FAILED,
  POST_LOGOUT_START,
  POST_REGISTRATION_SUCCESS,
  POST_REGISTRATION_START,
  CLEAR_AUTH, CLEAR_AUTH_ERROR
} from '../actions/auth';
import {AnyAction} from "redux";

export interface IAuthData {
  name: string,
  lastName: string,
  company: string,
  email: string,
  token: string,
  resetEnabled: boolean,
}

export interface IAuth {
  data: IAuthData,
  isLoading: boolean,
  error: Error | null,
  isChanged: boolean
}

const initialState: IAuth = {
  data: {
    name: "",
    lastName: "",
    company: "",
    email: "",
    token: "",
    resetEnabled: false,
  },
  isLoading: false,
  error: null,
  isChanged: false
};

export default function reducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case  CLEAR_AUTH:
      return initialState;
    case  CLEAR_AUTH_ERROR:
      return {
        ...state,
        error: initialState.error
      };
    case  POST_LOGOUT_START:
      return {
        ...state,
        isLoading: true,
        isChanged: true
      };
    case  POST_LOGOUT_SUCCESS:
      localStorage.removeItem('token');
      return initialState;
    case  POST_LOGOUT_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isChanged: true
      };
    case  POST_REGISTRATION_START:
      return {
        ...state,
        isLoading: true,
        isChanged: true
      };
    case  POST_REGISTRATION_SUCCESS:
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload
        },
        isLoading: false,
        isChanged: true
      };
    case  POST_REGISTRATION_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isChanged: true
      };
    case  POST_RESTORE_START:
      return {
        ...state,
        isLoading: true,
        isChanged: true
      };
    case  POST_RESTORE_SUCCESS:
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload
        },
        isLoading: false,
        isChanged: true
      };
    case  POST_RESTORE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isChanged: true
      };
    case  POST_LOGIN_START:
      return {
        ...state,
        isLoading: true,
        isChanged: true
      };
    case  POST_LOGIN_SUCCESS:
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload
        },
        isLoading: false,
        isChanged: true
      };
    case  POST_LOGIN_FAILED:
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
