import {get, post} from "../../api"
import initStore from '../store';
import {Router} from "next/router";

export const POST_REGISTRATION_START = 'POST_REGISTRATION_START';
export const POST_REGISTRATION_SUCCESS = 'POST_REGISTRATION_SUCCESS';
export const POST_REGISTRATION_FAILED = 'POST_REGISTRATION_FAILED';
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

const postRegistrationStart = () => ({
  type: POST_REGISTRATION_START
});

const postRegistrationSuccess = (data) => ({
  type: POST_REGISTRATION_SUCCESS,
  payload: data
});

const postRegistrationFailed = (error) => ({
  type: POST_REGISTRATION_FAILED,
  payload: error
});

export const clearAuth = () => ({
  type: CLEAR_AUTH
});

export const clearAuthError = () => ({
  type: CLEAR_AUTH_ERROR
});

export const postRegistration = (data, goStartPage) => async (dispatch) => {
  dispatch(postRegistrationStart());
  await post(`/auth/register`, data).then((result) => {
    dispatch(postRegistrationSuccess(result.data));
    goStartPage()
  }).catch(e => {
    dispatch(postRegistrationFailed(e));
  });
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

export const reAuth = (token) => async (dispatch) => {
  dispatch(postLoginStart());
  await get(`auth/reAuth?token=${token}`).then((result) => {
    dispatch(postLoginSuccess(result.data));
  }).catch(e => {
    dispatch(postLoginFailed(e));
  });
};

export const postLogin = (data, goStartPage) => async (dispatch) => {
  dispatch(postLoginStart());
  await post(`auth/login`, data).then((result) => {
    goStartPage()
    dispatch(postLoginSuccess(result.data));
  }).catch(e => {
    dispatch(postLoginFailed(e));
  });
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

export const postLogout = (goLoginPage) => async (dispatch) => {
  dispatch(postLogoutStart());
  try {
    dispatch(postLogoutSuccess());
    goLoginPage()
  } catch (e) {
    dispatch(postLogoutFailed(e));
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

export const postRestoreStepEmail = (data) => async (dispatch) => {
  dispatch(postRestoreStart());
  await post('/auth/send-code', data).then((result) => {
    dispatch(postRestoreSuccess({
      code: result.data,
      email: data.email
    }));
  }).catch(e => {
    dispatch(postRestoreFailed(e));
  });
};

export const postRestoreStepCode = (data) => async (dispatch) => {
  dispatch(postRestoreStart())
  await post('/auth/check-code', data).then((result) => {
    dispatch(postRestoreSuccess({
      resetEnabled: true
    }));
  }).catch(e => {
    dispatch(postRestoreFailed(e));
  });
};

export const postRestoreStepPassword = (data, goStartPage) => async (dispatch) => {
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
};

