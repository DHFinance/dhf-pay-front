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

export const getTransaction = (id = '') => async (dispatch, getState) => {
  const token = getState().auth?.data?.token
  dispatch(getTransactionStart());
  const result = await get(`/transaction/${id}`, {headers: {"Authorization-x": token}}).catch(e => console.log(e));

  try {
    dispatch(getTransactionSuccess(result.data));
    return result
  } catch (e) {
    dispatch(getTransactionFailed(e));
  }
};
