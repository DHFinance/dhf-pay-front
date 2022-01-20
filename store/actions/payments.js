import {get} from "../../api"

export const GET_PAYMENTS_START = 'GET_PAYMENTS_START';
export const GET_PAYMENTS_SUCCESS = 'GET_PAYMENTS_SUCCESS';
export const GET_PAYMENTS_FAILED = 'GET_PAYMENTS_FAILED';
export const PUSH_PAYMENT = 'PUSH_PAYMENT';

const getPaymentsStart = () => ({
  type: GET_PAYMENTS_START,
});

const getPaymentsSuccess = (data) => ({
  type: GET_PAYMENTS_SUCCESS,
  payload: data
});

const getPaymentsFailed = (error) => ({
  type: GET_PAYMENTS_FAILED,
  payload: error
});



export const getPayments = () => async (dispatch, getState) => {
  dispatch(getPaymentsStart());
  const token = getState().auth?.data?.token
  const result = await get(`/payment`, {headers: {"Authorization": `Bearer ${token}`}});

  try {
    dispatch(getPaymentsSuccess(result.data));
  } catch (e) {
    dispatch(getPaymentsFailed(e));
  }
};

export const getUserPayments = (apiKey) => async (dispatch, getState) => {
  dispatch(getPaymentsStart());
  const token = getState().auth?.data?.token
  await get(`/payment`, {headers: {"Authorization": `Bearer ${apiKey}`}}).then((result) => {
    dispatch(getPaymentsSuccess(result.data));
  }).catch((e) => dispatch(getPaymentsFailed(e)));
};