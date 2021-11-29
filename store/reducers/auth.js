import {  POST_LOGIN_FAILED, POST_LOGIN_START, POST_RESTORE_START, POST_LOGOUT_SUCCESS, POST_RESTORE_FAILED, POST_RESTORE_SUCCESS, POST_LOGOUT_FAILED, POST_LOGIN_SUCCESS, POST_REGISTRATION_FAILED, POST_LOGOUT_START, POST_REGISTRATION_SUCCESS, POST_REGISTRATION_START }  from '../actions/auth';

const initialState = {
  data: {
    name: "",
    lastName: "",
    company: "",
    email: "",
    token: "",
    resetEnabled: false,
  },
  isLoading: false,
  error: '',
  isChanged: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
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
      localStorage.setItem('token', action.payload.token ?? action.payload.token);
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
      localStorage.setItem('token', action.payload.token ?? action.payload.token);
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
      localStorage.setItem('token', action.payload.token ?? action.payload.token);
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
