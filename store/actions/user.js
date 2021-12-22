import {get, post} from "../../api"

export const GET_USER_START = 'GET_USER_START';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAILED = 'GET_USER_FAILED';
export const BLOCK_USER_START = 'BLOCK_USER_START';
export const BLOCK_USER_SUCCESS = 'BLOCK_USER_SUCCESS';
export const BLOCK_USER_FAILED = 'BLOCK_USER_FAILED';

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

export const getUser = (id) => async (dispatch) => {
  dispatch(getUserStart());
  await get(`/user/${id}`).then(result => dispatch(getUserSuccess(result.data))).catch(e => dispatch(getUserFailed(e)));
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

export const blockUser = (id, blocked) => async (dispatch) => {
  dispatch(blockUserStart());
  await post(`/user/block`, {id, blocked}).then(result => dispatch(blockUserSuccess(result.data))).catch(e => dispatch(blockUserFailed(e)));
};