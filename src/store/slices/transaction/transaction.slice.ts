import { createSlice } from '@reduxjs/toolkit';
import {
  FULFILLED_FETCH_STATUS,
  INITIAL_FETCH_STATUS,
  REJECT_FETCH_STATUS,
  START_FETCH_STATUS,
} from '../../../constatnts/fetchStatuses.constant';
import { FetchStatus } from '../../../interfaces/fetchStatus.interface';
import { Transaction } from '../../../interfaces/transaction.interface';
import { getLastTransaction } from './asyncThunks/getLastTransaction';
import { getTransaction } from './asyncThunks/getTransaction';

interface InitialState {
  data: Transaction | null;
  status: FetchStatus;
}

const initialState: InitialState = {
  data: null,
  status: INITIAL_FETCH_STATUS,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTransaction.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(getTransaction.rejected, (state, { payload: error }) => {
      state.status = REJECT_FETCH_STATUS(error as string);
    });
    builder.addCase(getTransaction.fulfilled, (state, { payload }) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data = payload;
    });
    builder.addCase(getLastTransaction.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(getLastTransaction.rejected, (state, { payload: error }) => {
      state.status = REJECT_FETCH_STATUS(error as string);
    });
    builder.addCase(getLastTransaction.fulfilled, (state, { payload }) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data = payload;
    });
  },
});

export default transactionSlice.reducer;
