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
 * @description Получение платежа по определенному id. Происходит по токену магазина, после которой вызывается success|failed метод
 * @param id {number} - id платежа
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
 * @description Отправка письма по почте. Происходит по токену магазина с переданным телом запроса.
 * @param id - payment id
 * @param email - email name
 * @param billUrl - ссылка на страницу оплаты платежа
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
 * @description Добавление платежа. Происходит по токену магазина, после которой вызывается success|failed метод
 * @param data {object} - тело запроса, соответствующее модели Payment
 * @param apiKey {string} - Уникальный ключ магазина, хранящийся в базе данных
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const addPayment = (data, apiKey) => async (dispatch, getState) => {
  const loading = getState().payment.isLoading
  if (!loading) {
    dispatch(addPaymentStart());
    const token = getState().auth?.data?.token;
    const result = await post(`/payment`, data, {headers: {"Authorization": `Bearer ${apiKey}`}});
    try {
      dispatch(addPaymentSuccess(result.data));
    } catch (e) {
      dispatch(addPaymentFailed(e));
    }
  }
};