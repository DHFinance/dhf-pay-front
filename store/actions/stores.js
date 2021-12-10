import {get} from "../../api"

export const GET_STORES_START = 'GET_STORES_START';
export const GET_STORES_SUCCESS = 'GET_STORES_SUCCESS';
export const GET_STORES_FAILED = 'GET_STORES_FAILED';
export const PUSH_STORES = 'PUSH_STORES';

const getStoresStart = () => ({
  type: GET_STORES_START,
});

const getStoresSuccess = (data) => ({
  type: GET_STORES_SUCCESS,
  payload: data
});

const getStoresFailed = (error) => ({
  type: GET_STORES_FAILED,
  payload: error
});



export const getStores = () => async (dispatch) => {
  dispatch(getStoresStart());
  await get(`/store`).then((result) => {
    dispatch(getStoresSuccess(result.data));
  }).catch((e) => dispatch(getStoresFailed(e)));
};

export const getUserStores = (userId) => async (dispatch) => {
  dispatch(getStoresStart());
  await get(`/store?filter=user.id||eq||${userId}`).then((result) => {
    dispatch(getStoresSuccess(result.data));
  }).catch((e) => dispatch(getStoresFailed(e)));
};