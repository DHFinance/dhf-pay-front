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
 * @description User registration, stage 1. Receives user data, sends a confirmation code in a letter to the specified email
 * @param data {object} - data passed in the request body, corresponding to the User model
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
 * @description User registration, stage 2. receives the confirmation code, compares it with what is written on the back. If the code is correct, you can log in to this user
 * @param email - user email
 * @param code - confirmation code
 * @param goStartPage - callback to go to the main page of the site
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
 * @description check if the user exists in the database. Occurs every time the page is reloaded
 * @param token {string} - unique string in JWT format. defining user token
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
 * @description login. searches for a user by email and checks the password. If all data is correct - issues a token
 * @param data {object} - data passed in the request body, corresponding to the User model
 * @param goStartPage - callback to go to the main page of the site
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
 * @description User exit user. After logging out, the user is redirected to the main page of the site and the success|error state is recorded
 * @param goLoginPage - callback to go to the authorization page
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
 * @description Password recovery stage 1. searches for a user by email sends a code to the mail. Return true to move to the next step
 * @param data {object} - data required to be specified in the request body, corresponding to the User model
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
 * @description Password recovery stage 2. Comparison of the code that came from the front and the code from the user's record. If the codes match, move on to the next step.
 * @param data {object} - data required to be specified in the request body, corresponding to the User model
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
 * @description Password recovery stage 3. Password change, receives a new password and replaces the current one with it. Sends user data
 * @param data {object} - data required to be specified in the request body, corresponding to the User model
 * @param goStartPage - callback to go to the main page of the site
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

