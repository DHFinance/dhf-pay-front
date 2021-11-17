import {post} from "../../api"

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

export const postRegistration = (url, data, params) => async (dispatch) => {
  dispatch(postRegistrationStart());
  const result = await post(url, data, params);
  try {
    dispatch(postRegistrationSuccess(result.data.data));
  } catch (e) {
    dispatch(postRegistrationFailed(e));
  }
};

const postLoginStart = () => ({
  type: POST_LOGIN_START
});

const postLoginSuccess = (data) => ({
  type: POST_LOGIN_SUCCESS,
  payload: data
});

const postLoginFailed = (error) => ({
  type: POST_LOGIN_START,
  payload: error
});

export const postLogin = (url, data, params) => async (dispatch) => {
  dispatch(postLoginStart());
  const result = await post(url, data, params);
  try {
    dispatch(postLoginSuccess(result.data.data));
  } catch (e) {
    dispatch(postLoginFailed(e));
  }
};


const postLogoutStart = () => ({
  type: POST_LOGOUT_START
});

const postLogoutSuccess = (data) => ({
  type: POST_LOGOUT_START,
  payload: data
});

const postLogoutFailed = (error) => ({
  type: POST_LOGOUT_START,
  payload: error
});

export const postLogout = (url, data, params) => async (dispatch) => {
  dispatch(postLogoutStart());
  const result = await post(url, data, params);
  try {
    dispatch(postLogoutSuccess(result.data.data));
  } catch (e) {
    dispatch(postLogoutFailed(e));
  }
};

const postRestoreStart = () => ({
  type: POST_RESTORE_START
});

const postRestoreSuccess = (data) => ({
  type: POST_RESTORE_START,
  payload: data
});

const postRestoreFailed = (error) => ({
  type: POST_RESTORE_START,
  payload: error
});

export const postRestore = (url, data, params) => async (dispatch) => {
  dispatch(postRestoreStart());
  const result = await post(url, data, params);
  try {
    dispatch(postRestoreSuccess(result.data.data));
  } catch (e) {
    dispatch(postRestoreFailed(e));
  }
};

