import {get} from "../../api"

export const GET_TRANSACTIONS_START = 'GET_TRANSACTIONS_START';
export const GET_TRANSACTIONS_SUCCESS = 'GET_TRANSACTIONS_SUCCESS';
export const GET_TRANSACTIONS_FAILED = 'GET_TRANSACTIONS_FAILED';

const getTransactionsStart = () => ({
  type: GET_TRANSACTIONS_START
});

const getTransactionsSuccess = (data) => ({
  type: GET_TRANSACTIONS_SUCCESS,
  payload: data
});

const getTransactionsFailed = (error) => ({
  type: GET_TRANSACTIONS_FAILED,
  payload: error
});

export const getTransactions = () => async (dispatch) => {
  dispatch(getTransactionsStart());
  const result = await get('/transaction');
  try {
    dispatch(getTransactionsSuccess(result.data));
  } catch (e) {
    dispatch(getTransactionsFailed(e));
  }
};