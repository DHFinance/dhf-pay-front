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


/**
 * @description Receiving payments. All existing payments are returned. After the operation, the success|failed method is executed
 * @returns {(function(*, *): Promise<void>)|*}
 */
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
/**
 * @description Receiving payments. The payments of the store corresponding to the passed key are returned. After the operation, the success|failed method is executed
 * @param apiKey {string} - Unique store key stored in the database
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const getUserPayments = (apiKey) => async (dispatch, getState) => {
  dispatch(getPaymentsStart());
  const token = getState().auth?.data?.token
  await get(`/payment`, {headers: {"Authorization": `Bearer ${apiKey}`}}).then((result) => {
    dispatch(getPaymentsSuccess(result.data));
  }).catch((e) => dispatch(getPaymentsFailed(e)));
};