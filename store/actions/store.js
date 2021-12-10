import {get, patch, post} from "../../api"

export const GET_STORE_START = 'GET_STORE_START';
export const GET_STORE_SUCCESS = 'GET_STORE_SUCCESS';
export const GET_STORE_FAILED = 'GET_STORE_FAILED';
export const EDIT_STORE_START = 'EDIT_STORE_START';
export const EDIT_STORE_SUCCESS = 'EDIT_STORE_SUCCESS';
export const EDIT_STORE_FAILED = 'EDIT_STORE_FAILED';
export const ADD_STORE_START = 'ADD_STORE_START';
export const ADD_STORE_SUCCESS = 'ADD_STORE_SUCCESS';
export const ADD_STORE_FAILED = 'ADD_STORE_FAILED';

const editStoreStart = () => ({
  type: EDIT_STORE_START,
});

const editStoreSuccess = (data) => ({
  type: EDIT_STORE_SUCCESS,
  payload: data
});

const editStoreFailed = (error) => ({
  type: EDIT_STORE_FAILED,
  payload: error
});

export const editStore = (id = '', data) => async (dispatch) => {
  if (id) {
    dispatch(editStoreStart());
    await patch(`/store/${id}`, data).then(result => dispatch(editStoreSuccess(result.data))).catch(e => dispatch(editStoreFailed(e)));
  }
};

const getStoreStart = () => ({
  type: GET_STORE_START,
});

const getStoreSuccess = (data) => ({
  type: GET_STORE_SUCCESS,
  payload: data
});

const getStoreFailed = (error) => ({
  type: GET_STORE_FAILED,
  payload: error
});

export const getStore = (id = '') => async (dispatch) => {
  dispatch(getStoreStart());
  console.log({id})
  await get(`/store/${id}`).then(result => dispatch(getStoreSuccess(result.data))).catch(e => dispatch(getStoreFailed(e)));

};

const addStoreStart = () => ({
  type: ADD_STORE_START,
});

const addStoreSuccess = (data) => ({
  type: ADD_STORE_SUCCESS,
  payload: data
});

const addStoreFailed = (error) => ({
  type: ADD_STORE_FAILED,
  payload: error
});

export const addStore = (data) => async (dispatch) => {
  dispatch(addStoreStart());
  const result = await post(`/store`, data).then(result => dispatch(addStoreSuccess(result.data))).catch(e => dispatch(addStoreFailed(e)));
};