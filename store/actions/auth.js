import {post} from "../../api"
import initStore from '../store';

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

export const postRegistration = (data, params) => async (dispatch) => {
  dispatch(postRegistrationStart());
  const result = await post('/auth/register', data, params);
  try {
    dispatch(postRegistrationSuccess());
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

const postLoginFailed = (error) => {
  console.log({error})
  return {
    type: POST_LOGIN_FAILED,
        payload: error
  }
}

export const postLogin = (data) => async (dispatch) => {
  dispatch(postLoginStart());
  const result = await post('auth/login', data);
  try {
    console.log('rusult', result.data)
    dispatch(postLoginSuccess(result.data));
  } catch (e) {
    dispatch(postLoginFailed(e));
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

export const postLogout = () => async (dispatch) => {
  dispatch(postLogoutStart());
  try {
    dispatch(postLogoutSuccess());
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
  const result = await post('/auth/send-code', data);
  try {
    dispatch(postRestoreSuccess({
      code: result.data,
      email: data.email
    }));
  } catch (e) {
    dispatch(postRestoreFailed('Email step error:',e));
  }
};

export const postRestoreStepCode = (data) => async (dispatch) => {
  dispatch(postRestoreStart())
  const result = await post('/auth/check-code', data);
  try {
    dispatch(postRestoreSuccess({
      resetEnabled: true
    }));
  } catch (e) {
    dispatch(postRestoreFailed('Code step error:',e));
  }
};

export const postRestoreStepPassword = (data) => async (dispatch) => {
  dispatch(postRestoreStart());
  const result = await post('/auth/reset-pwd', data);
  try {
    dispatch(postRestoreSuccess({
      ...result.data,
      resetEnabled: false
    }));
  } catch (e) {
    dispatch(postRestoreFailed('Password step error:',e));
  }
};

