import {get, post} from "../../api"

export const GET_TRANSACTION_START = 'GET_TRANSACTION_START';
export const GET_TRANSACTION_SUCCESS = 'GET_TRANSACTION_SUCCESS';
export const GET_TRANSACTION_FAILED = 'GET_TRANSACTION_FAILED';


const getTransactionStart = () => ({
  type: GET_TRANSACTION_START,
});

const getTransactionSuccess = (data) => ({
  type: GET_TRANSACTION_SUCCESS,
  payload: data
});

const getTransactionFailed = (error) => ({
  type: GET_TRANSACTION_FAILED,
  payload: error
});

/**
 * @description Getting a specific transaction by hash
 * @param txHash - the unique value of the transaction
 * @returns {(function(*, *): Promise<AxiosResponse<any>|void|undefined>)|*}
 */
export const getTransaction = (txHash = '') => async (dispatch, getState) => {
  const token = getState().auth?.data?.token
  dispatch(getTransactionStart());
  const result = await get(`/transaction/${txHash}`, {headers: {"Authorization": `Bearer ${token}`}}).catch(e => console.log(e));

  try {
    dispatch(getTransactionSuccess(result.data));
    return result
  } catch (e) {
    dispatch(getTransactionFailed(e));
  }
};

/**
 * @description Get the last transaction for payment with the given id
 * @param paymentId - unique payment value (default = "")
 * @returns {(function(*, *): Promise<AxiosResponse<any>|void|undefined>)|*}
 */
export const getLastTransaction = (paymentId = '') => async (dispatch, getState) => {
  const token = getState().auth?.data?.token
  dispatch(getTransactionStart());
  const result = await get(`/transaction/last/${paymentId}`, {headers: {"Authorization": `Bearer ${token}`}}).catch(e => console.log(e));
  try {
    dispatch(getTransactionSuccess(result.data));
    return result
  } catch (e) {
    dispatch(getTransactionFailed(e));
  }
};
