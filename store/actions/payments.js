import {get} from "../../api"

export const GET_PAYMENTS_START = 'GET_PAYMENTS_START';
export const GET_PAYMENTS_SUCCESS = 'GET_PAYMENTS_SUCCESS';
export const GET_PAYMENTS_FAILED = 'GET_PAYMENTS_FAILED';

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

export const getPayments = () => async (dispatch) => {
  dispatch(getPaymentsStart());
  const result = await get(`/payment`);

  try {
    dispatch(getPaymentsSuccess(result.data));
  } catch (e) {
    dispatch(getPaymentsFailed(e));
  }
};
