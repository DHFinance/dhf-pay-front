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
  CLEAR_AUTH, CLEAR_AUTH_ERROR, POST_VERIFY_SUCCESS, POST_VERIFY_FAILED, POST_VERIFY_START, CLEAR_STORE
} from '../actions/auth';

const initialState = {
  data: {
    name: "",
    lastName: "",
    company: "",
    email: "",
    token: "",
    resetEnabled: false,
  },
  verify: false,
  isLoading: false,
  error: '',
  isChanged: false
};

/**
 * @description reducer аутентификации пользователя
 * @param state - состояние reducer авторизации, котоое изначально равно initialState
 * @param action - объект, котоырй включает себя тип и данные соответсвующего экшена
 * @returns {{isLoading: boolean, data: {lastName: string,resetEnabled: boolean, name: string, company: string, email: string, token: string}, isChanged: boolean, verify: boolean, error: string}|{isLoading: boolean, data: {lastName: string, resetEnabled: boolean, name: string, company: string, email: string, token: string}, isChanged: boolean, verify: boolean, error}|{isLoading: boolean, data: {lastName: string, resetEnabled: boolean, name: string, company: string, email: string, token: string}, isChanged: boolean, verify: boolean, error: string}|{isLoading: boolean, data: (*&{lastName: string, resetEnabled: boolean, name: string, company: string, email: string, token: string}), isChanged: boolean, verify: boolean, error: string}}
 */
export default function reducer(state = initialState, action) {
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
      /**
       * @description вызывается при успешном выходе пользователя, удаляет токен пользователя
       */
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
      return {
        ...state,
        verify: true,
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
    case  POST_VERIFY_START:
      return {
        ...state,
        isLoading: true,
        isChanged: true
      };
      /**
       * @description вызывается при успешной верификации пользователя, если токен передан в action.payload, то устанавливается этот токен
       */
    case  POST_VERIFY_SUCCESS:
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
    case  POST_VERIFY_FAILED:
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
      /**
       * @description вызывается при успешном сбросе пароля пользователя, если токен передан в action.payload, то устанавливается этот токен
       */
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
      /**
       * @description вызывается при успешной аунтефикации пользователя, если токен передан в action.payload, то устанавливается этот токен
       */
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
      localStorage.removeItem('token');
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
