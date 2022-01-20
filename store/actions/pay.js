import {post} from "../../api"
import {PUSH_PAYMENT} from "./payments";

export const POST_PAY_START = 'POST_PAY_START';
export const POST_PAY_SUCCESS = 'POST_PAY_SUCCESS';
export const POST_PAY_FAILED = 'POST_PAY_FAILED';
export const SET_CASPER_SUCCESS = 'SET_CASPER_SUCCESS';

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

const pushPayment = (data) => ({
  type: PUSH_PAYMENT,
  payload: data
});

export const pay = (data) => async (dispatch, getState) => {
  const token = getState().auth?.data?.token
  dispatch(payStart());
  await post('/transaction', data, {headers: {"Authorization": `Bearer ${token}`}}).then((result => {
    dispatch(paySuccess(result.data.data));
    dispatch(pushPayment(result.data.data));
  })).catch(e => {
    dispatch(payFailed(e));
  });
};

export const setCasperData = (data) => {
  return {
    type: SET_CASPER_SUCCESS,
    payload: data
  }
};
