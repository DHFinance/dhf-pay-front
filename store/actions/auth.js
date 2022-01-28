import {get, post} from "../../api"
import initStore from '../store';
import {Router} from "next/router";

export const POST_REGISTRATION_START = 'POST_REGISTRATION_START';
export const POST_REGISTRATION_SUCCESS = 'POST_REGISTRATION_SUCCESS';
export const POST_REGISTRATION_FAILED = 'POST_REGISTRATION_FAILED';
export const POST_VERIFY_START = 'POST_VERIFY_START';
export const POST_VERIFY_SUCCESS = 'POST_VERIFY_SUCCESS';
export const POST_VERIFY_FAILED = 'POST_VERIFY_FAILED';
export const POST_LOGIN_START = 'POST_LOGIN_START';
export const POST_LOGIN_SUCCESS = 'POST_LOGIN_SUCCESS';
export const POST_LOGIN_FAILED = 'POST_LOGIN_FAILED';
export const POST_LOGOUT_START = 'POST_LOGOUT_START';
export const POST_LOGOUT_SUCCESS = 'POST_LOGOUT_SUCCESS';
export const POST_LOGOUT_FAILED = 'POST_LOGOUT_FAILED';
export const POST_RESTORE_START = 'POST_RESTORE_START';
export const POST_RESTORE_SUCCESS = 'POST_RESTORE_SUCCESS';
export const POST_RESTORE_FAILED = 'POST_RESTORE_FAILED';
export const CLEAR_AUTH = 'CLEAR_AUTH';
export const CLEAR_AUTH_ERROR = 'CLEAR_AUTH_ERROR';
export const CLEAR_STORE = 'CLEAR_STORE';

export const clearAuth = () => ({
  type: CLEAR_AUTH
});

export const clearStore = () => ({
  type: CLEAR_STORE
});

export const clearAuthError = () => ({
  type: CLEAR_AUTH_ERROR
});


const postRegistrationStart = () => ({
  type: POST_REGISTRATION_START
});

const postRegistrationSuccess = () => ({
  type: POST_REGISTRATION_SUCCESS
});

const postRegistrationFailed = (error) => ({
  type: POST_REGISTRATION_FAILED,
  payload: error
});

/**
 * @description Регистрация пользователя, этап 1. Получает данные пользователя, отправляет код для подтверждения в письме на указанную email
 * @param data {object} - данные, передаваемые в теле запроса, соответствующие модели User
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const postRegistration = (data) => async (dispatch, getState) => {
  const loading = getState().auth.isLoading
  if (!loading) {
    dispatch(postRegistrationStart());
    await post(`/auth/register`, {...data, blocked: false}).then((result) => {
      dispatch(postRegistrationSuccess());
    }).catch(e => {
      dispatch(postRegistrationFailed(e));
    });
  }
};

const postVerifyStart = () => ({
  type: POST_VERIFY_START
});

const postVerifySuccess = (data) => ({
  type: POST_VERIFY_SUCCESS,
  payload: data
});

const postVerifyFailed = (error) => ({
  type: POST_VERIFY_FAILED,
  payload: error
});

/**
 * @description Регистрация пользователя, этап 2. принимает код подтвержения, сравнивает его с тем, что записан на беке. Если код верен - на этом пользователе можно авторизироваться
 * @param email
 * @param code
 * @param goStartPage - callback для перехода на главную страницу сайта
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const postVerify = (email, code, goStartPage) => async (dispatch, getState) => {
  const loading = getState().auth.isLoading
  if (!loading) {
    dispatch(postVerifyStart());
    await post(`/auth/verify`, {email, code}).then((result) => {
      dispatch(postVerifySuccess(result.data));
      goStartPage()
    }).catch(e => {
      dispatch(postVerifyFailed(e));
    });
  }
};

const postLoginStart = () => ({
  type: POST_LOGIN_START
});

const postLoginSuccess = (data) => ({
  type: POST_LOGIN_SUCCESS,
  payload: data
});

const postLoginFailed = (error) => {
  return {
    type: POST_LOGIN_FAILED,
        payload: error
  }
}

/**
 * @description проверка существования пользователя в базе данных. Происходит при каждой перезагрузке страницы
 * @param token {string} - уникальная строка в формате JWT. определяющая токен пользователя
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const reAuth = (token) => async (dispatch, getState) => {
  dispatch(postLoginStart());
  await get(`auth/reAuth?token=${token}`).then((result) => {
    dispatch(postLoginSuccess(result.data));
  }).catch(e => {
    dispatch(postLoginFailed(e));
  });
};

/**
 * @description вход в систему. ищет пользователя по email и сверяет пароль. Если все данные верны - выдает токен
 * @param data {object} - данные, передаваемые в теле запроса, соответствующие модели User
 * @param goStartPage - callback для перехода на главную страницу сайта
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const postLogin = (data, goStartPage) => async (dispatch, getState) => {
  const loading = getState().auth.isLoading
  if (!loading) {
    dispatch(postLoginStart());
    await post(`auth/login`, data).then((result) => {
      goStartPage()
      dispatch(postLoginSuccess(result.data));
    }).catch(e => {
      dispatch(postLoginFailed(e));
    });
  }
};

const postLogoutStart = () => ({
  type: POST_LOGOUT_START
});

const postLogoutSuccess = (data) => ({
  type: POST_LOGOUT_SUCCESS,
  payload: data
});

const postLogoutFailed = (error) => ({
  type: POST_LOGOUT_FAILED,
  payload: error
});

/**
 * @description Выход пользователя пользователь. После выхода пользователь перемещается на главную страницу сайта и записывается success|error state
 * @param goLoginPage - callback для перехода на страницу авторизации
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const postLogout = (goLoginPage) => async (dispatch, getState) => {
  const loading = getState().auth.isLoading
  if (!loading) {
    dispatch(postLogoutStart());
    try {
      dispatch(postLogoutSuccess());
      goLoginPage()
    } catch (e) {
      dispatch(postLogoutFailed(e));
    }
  }
};

const postRestoreStart = () => ({
  type: POST_RESTORE_START
});

const postRestoreSuccess = (data) => ({
  type: POST_RESTORE_SUCCESS,
  payload: data
});

const postRestoreFailed = (error) => ({
  type: POST_RESTORE_FAILED,
  payload: error
});

/**
 * @description Восстановление пароля этап 1. ищет пользователя по email отправляет на почту код. Return true для перехода к следующему этапу
 * @param data {object} - данные, необходимые для указания в теле запроса, соответствующие модели User
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const postRestoreStepEmail = (data) => async (dispatch, getState) => {
  const loading = getState().auth.isLoading
  if (!loading) {
    dispatch(postRestoreStart());
    await post('/auth/send-code', data).then((result) => {
      dispatch(postRestoreSuccess({
        code: result.data,
        email: data.email
      }));
    }).catch(e => {
      dispatch(postRestoreFailed(e));
    });
  }
};

/**
 * @description Восстановление пароля этап 2. Сравнение кода, пришедшего с фронта и кода из записи пользователя. Если коды совпадают - переходит к следующему этапу
 * @param data {object} - данные, необходимые для указания в теле запроса, соответствующие модели User
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const postRestoreStepCode = (data) => async (dispatch, getState) => {
  const auth = getState().auth
  
  if (!auth.isLoading) {
    dispatch(postRestoreStart())
    await post('/auth/check-code', data).then((result) => {
      dispatch(postRestoreSuccess({
        resetEnabled: true
      }));
    }).catch(e => {
      dispatch(postRestoreFailed(e));
    });
  }
};

/**
 * @description Восстановление пароля этап 3. Замена пароля, получает новый пароль и заменяет им текущий. Отправляет данные пользователя
 * @param data {object} - данные, необходимые для указания в теле запроса, соответствующие модели User
 * @param goStartPage - callback для перехода на главную страницу сайта
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const postRestoreStepPassword = (data, goStartPage) => async (dispatch, getState) => {
  const loading = getState().auth.isLoading
  if (!loading) {
    dispatch(postRestoreStart());
    await post('/auth/reset-pwd', data).then((result) => {
      dispatch(postRestoreSuccess({
        ...result.data,
        resetEnabled: false
      }));
      goStartPage();
    }).catch(e => {
      dispatch(postRestoreFailed(e));
    });
  }
};

