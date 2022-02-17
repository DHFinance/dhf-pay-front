import {get, post} from "../../api"

export const GET_PAYMENT_START = 'GET_PAYMENT_START';
export const GET_PAYMENT_SUCCESS = 'GET_PAYMENT_SUCCESS';
export const GET_PAYMENT_FAILED = 'GET_PAYMENT_FAILED';
export const ADD_PAYMENT_START = 'ADD_PAYMENT_START';
export const ADD_PAYMENT_SUCCESS = 'ADD_PAYMENT_SUCCESS';
export const ADD_PAYMENT_FAILED = 'ADD_PAYMENT_FAILED';

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

/**
 * @description Receiving a payment by a specific id. Occurs on the store token, after which the success|failed method is called
 * @param id {number} - payment id
 * @returns {(function(*, *): Promise<AxiosResponse<any>|void|undefined>)|*}
 */
export const getPayment = (id = '') => async (dispatch, getState) => {
  dispatch(getPaymentStart());
  const token = getState().auth?.data?.token
  const result = await get(`/payment/${id}`, {headers: {"Authorization": `Bearer ${token}`}}).catch(e => console.log(e));

  try {
    dispatch(getPaymentSuccess(result.data));
    return result
  } catch (e) {
    dispatch(getPaymentFailed(e));
  }

};

/**
 * @description Sending a letter by mail. Occurs on the store token with the passed request body.
 * @param id - payment id
 * @param email - user email
 * @param billUrl - link to payment page
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const sendMailBill = (id, email, billUrl) => async (dispatch, getState) => {
  const loading = getState().payment.isLoading
  if (!loading) {
    const token = getState().auth?.data?.token
    const result = await post(`payment/send-mail-bill`, {
      id,
      email,
      billUrl
    }, {headers: {"Authorization": `Bearer ${token}`}}).catch(e => console.log(e));
  }
};

const addPaymentStart = () => ({
  type: ADD_PAYMENT_START,
});

const addPaymentSuccess = (data) => ({
  type: ADD_PAYMENT_SUCCESS,
  payload: data
});

const addPaymentFailed = (error) => ({
  type: ADD_PAYMENT_FAILED,
  payload: error
});

/**
 * @description Adding a payment. Occurs on the store token, after which the success|failed method is called
 * @param data {object} - request body corresponding to the Payment model
 * @param apiKey {string} - Unique store key stored in the database
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const addPayment = (data, apiKey) => async (dispatch, getState) => {
    dispatch(addPaymentStart());
    const result = await post(`/payment`, data, {headers: {"Authorization": `Bearer ${apiKey}`}});
    try {
      dispatch(addPaymentSuccess(result.data));
    } catch (e) {
      dispatch(addPaymentFailed(e));
    }
};