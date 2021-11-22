import {post} from "../../api"

export const POST_START = 'POST_START';
export const POST_SUCCESS = 'POST_SUCCESS';
export const POST_FAILED = 'POST_FAILED';

const postDataStart = () => ({
  type: POST_START
});

const postDataSuccess = (data) => ({
  type: POST_SUCCESS,
  payload: data
});

const postDataFailed = (error) => ({
  type: POST_FAILED,
  payload: error
});

export const postQuery = (url, data, params) => async (dispatch) => {
  dispatch(postDataStart());
  const result = await post(url, data, params);
  try {
    dispatch(postDataSuccess(result.data.data));
  } catch (e) {
    dispatch(postDataFailed(e));
  }
};
