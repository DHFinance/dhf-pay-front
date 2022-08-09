import {get, post} from "../../api"

export const GET_USER_START = 'GET_USER_START';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAILED = 'GET_USER_FAILED';
export const BLOCK_USER_START = 'BLOCK_USER_START';
export const BLOCK_USER_SUCCESS = 'BLOCK_USER_SUCCESS';
export const BLOCK_USER_FAILED = 'BLOCK_USER_FAILED';
export const SET_CAPTCHA_TOKEN = 'SET_CAPTCHA_TOKEN';
export const SET_UPDATE_CAPTCHA = 'SET_UPDATE_CAPTCHA';

const getUserStart = () => ({
  type: GET_USER_START
});

const getUserSuccess = (data) => ({
  type: GET_USER_SUCCESS,
  payload: data
});

const getUserFailed = (error) => ({
  type: GET_USER_FAILED,
  payload: error
});

export const setCaptchaToken = (token) => ({
  type: SET_CAPTCHA_TOKEN,
  payload: token
})

export const setCaptchaUpdate = (payload) => ({
  type: SET_UPDATE_CAPTCHA,
  payload: payload
});

/**
 * @description Getting a user by id
 * @param id - the unique value of the user
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const getUser = (id) => async (dispatch, getState) => {
  const token = getState().auth?.data?.token
  dispatch(getUserStart());
  await get(`/user/${id}`, {headers: {"Authorization": `Bearer ${token}`}}).then(result => dispatch(getUserSuccess(result.data))).catch(e => dispatch(getUserFailed(e)));
};

const blockUserStart = () => ({
  type: BLOCK_USER_START
});

const blockUserSuccess = (data) => ({
  type: BLOCK_USER_SUCCESS,
  payload: data
});

const blockUserFailed = (error) => ({
  type: BLOCK_USER_FAILED,
  payload: error
});

/**
 * @description Changing a user's ban status
 * @param id - unique user value
 * @param blocked - blocking status
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const blockUser = (id, blocked) => async (dispatch, getState) => {
  const loading = getState().user.isLoading
  if (!loading) {
    const token = getState().auth?.data?.token
    dispatch(blockUserStart());
    await post(`/user/block`, {
      id,
      blocked
    }, {headers: {"Authorization": `Bearer ${token}`}}).then(result => dispatch(blockUserSuccess(result.data))).catch(e => dispatch(blockUserFailed(e)));
  }
};