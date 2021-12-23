import {get} from "../../api"

export const GET_START = 'GET_START';
export const GET_SUCCESS = 'GET_SUCCESS';
export const GET_FAILED = 'GET_FAILED';

const getDataStart = () => ({
  type: GET_START
});

const getDataSuccess = (data) => ({
  type: GET_SUCCESS,
  payload: data
});

const getDataFailed = (error) => ({
  type: GET_FAILED,
  payload: error
});

export const getQuery = (url) => async (dispatch, getState) => {
  dispatch(getDataStart());
  const result = await get(url);
  try {
    dispatch(getDataSuccess(result.data.data));
  } catch (e) {
    dispatch(getDataFailed(e));
  }
};
