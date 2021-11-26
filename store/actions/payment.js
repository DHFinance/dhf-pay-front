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

export const getPayment = (id = '') => async (dispatch) => {
  dispatch(getPaymentStart());
  const result = await get(`/payment/${id}`);

  try {
    dispatch(getPaymentSuccess(result.data));
    return result
  } catch (e) {
    dispatch(getPaymentFailed(e));
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

export const addPayment = (data) => async (dispatch) => {
  dispatch(addPaymentStart());
  const result = await post(`/payment`, data);
  try {
    dispatch(addPaymentSuccess(result.data));
  } catch (e) {
    dispatch(addPaymentFailed(e));
  }
};