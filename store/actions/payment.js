import {get} from "../../api"

export const GET_PAYMENT_START = 'GET_PAYMENT_START';
export const GET_PAYMENT_SUCCESS = 'GET_PAYMENT_SUCCESS';
export const GET_PAYMENT_FAILED = 'GET_PAYMENT_FAILED';

const getPaymentStart = () => ({
  type: GET_PAYMENT_START,
});

const getPaymentSuccess = (data) => ({
  type: GET_PAYMENT_SUCCESS,
  payload: data
});

const getPaymentFailed = (error) => ({
  type: GET_PAYMENT_FAILED,
  payload: error
});

export const getPayment = (id = '') => async (dispatch) => {
  dispatch(getPaymentStart());
  const result = await get(`/payment/${id}`);
  try {
    dispatch(getPaymentSuccess(result.data));
  } catch (e) {
    dispatch(getPaymentFailed(e));
  }
};
