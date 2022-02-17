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
export const BlOCK_STORE_START = 'BlOCK_STORE_START';
export const BlOCK_STORE_SUCCESS = 'BlOCK_STORE_SUCCESS';
export const BlOCK_STORE_FAILED = 'BlOCK_STORE_FAILED';

export const editStoreStart = () => ({
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

/**
 * @description Changing a specific field (column) in the shop state.
 * @param id - store unique value (default = "")
 * @param data - data passed in the request body, corresponding to the Store model
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const editStore = (id = '', data) => async (dispatch, getState) => {
  const loading = getState().storeData.isLoading
  if (!loading) {
    const token = getState().auth?.data?.token
    if (id) {
      dispatch(editStoreStart());
      await patch(`/store/${id}`, data, {headers: {"Authorization": `Bearer ${token}`}}).then(result => dispatch(editStoreSuccess(result.data))).catch(e => dispatch(editStoreFailed(e)));
    }
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

/**
 * @@description Getting a specific store by id
 * @param id - store unique value (default = "")
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const getStore = (id = '') => async (dispatch, getState) => {
  const token = getState().auth?.data?.token
  dispatch(getStoreStart());
  await get(`/store/${id}`, {headers: {"Authorization": `Bearer ${token}`}}).then(result => dispatch(getStoreSuccess(result.data))).catch(e => dispatch(getStoreFailed(e)));

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

/**
 * @description Adding a store.
 * @param data - data passed in the request body, corresponding to the Store model
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const addStore = (data) => async (dispatch, getState) => {
  console.log(getState())
  const loading = getState().storeData.isLoading

  if (!loading) {
    const token = getState().auth?.data?.token
    dispatch(addStoreStart());
    const result = await post(`/store`, {
      ...data,
      blocked: false
    }, {headers: {"Authorization": `Bearer ${token}`}}).then(result => dispatch(addStoreSuccess(result.data))).catch(e => dispatch(addStoreFailed(e)));
  }
};

const blockStoreStart = () => ({
  type: BlOCK_STORE_START,
});

const blockStoreSuccess = (data) => ({
  type: BlOCK_STORE_SUCCESS,
  payload: data
});

const blockStoreFailed = (error) => ({
  type: BlOCK_STORE_FAILED,
  payload: error
});

/**
 * @description Blocking a specific store.
 * @param id - store unique value
 * @param blocked - true|false state
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const blockStore = (id, blocked) => async (dispatch, getState) => {
  const loading = getState().storeData.isLoading
  if (!loading) {
    const token = getState().auth?.data?.token
    dispatch(blockStoreStart());
    await post(`/store/block`, {
      id,
      blocked
    }, {headers: {"Authorization": `Bearer ${token}`}}).then(result => dispatch(blockStoreSuccess(result.data))).catch(e => dispatch(blockStoreFailed(e)));
  }
};