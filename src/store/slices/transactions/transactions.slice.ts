import { createSlice } from '@reduxjs/toolkit';
import {
  FULFILLED_FETCH_STATUS,
  INITIAL_FETCH_STATUS,
  START_FETCH_STATUS,
} from '../../../constatnts/fetchStatuses.constant';
import { FetchStatus } from '../../../interfaces/fetchStatus.interface';
import { Transaction } from '../../../interfaces/transaction.interface';
import { getTransactions } from './asyncThunks/getTransactions';
import { getUserTransactions } from './asyncThunks/getUserTransactions';

interface InitialState {
  data: Transaction[] | null;
  status: FetchStatus;
}

const initialState: InitialState = {
  data: null,
  status: INITIAL_FETCH_STATUS,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTransactions.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(getTransactions.rejected, (state) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data = [];
    });
    builder.addCase(getTransactions.fulfilled, (state, { payload }) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data = payload;
    });
    builder.addCase(getUserTransactions.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(getUserTransactions.rejected, (state) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data = [];
    });
    builder.addCase(getUserTransactions.fulfilled, (state, { payload }) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data = payload;
    });
  },
});

export default transactionsSlice.reducer;
