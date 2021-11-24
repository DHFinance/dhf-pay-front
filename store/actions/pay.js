import {post} from "../../api"

export const POST_PAY_START = 'POST_PAY_START';
export const POST_PAY_SUCCESS = 'POST_PAY_SUCCESS';
export const POST_PAY_FAILED = 'POST_PAY_FAILED';

const payStart = () => ({
  type: POST_PAY_START
});

const paySuccess = (data) => ({
  type: POST_PAY_SUCCESS,
  payload: data
});

const payFailed = (error) => ({
  type: POST_PAY_FAILED,
  payload: error
});

export const pay = (data) => async (dispatch) => {
  dispatch(payStart());
  const result = await post('/transaction', data);
  try {
    dispatch(paySuccess(result.data.data));
  } catch (e) {
    dispatch(payFailed(e));
  }
};
