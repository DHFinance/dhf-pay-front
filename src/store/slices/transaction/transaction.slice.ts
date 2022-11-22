import { createSlice } from '@reduxjs/toolkit';
import {
  FULFILLED_FETCH_STATUS,
  INITIAL_FETCH_STATUS,
  REJECT_FETCH_STATUS,
  START_FETCH_STATUS,
} from '../../../constatnts/fetchStatuses.constant';
import { FetchStatus } from '../../../interfaces/fetchStatus.interface';
import { Transaction } from '../../../interfaces/transaction.interface';
import { generateTransaction } from './asyncThunks/generateTransaction';
import { getLastTransaction } from './asyncThunks/getLastTransaction';
import { getTransaction } from './asyncThunks/getTransaction';

interface InitialState {
  data: Transaction | null;
  status: FetchStatus;
  generateData: Transaction | null;
  generateStatus: FetchStatus;
}

const initialState: InitialState = {
  data: null,
  status: INITIAL_FETCH_STATUS,
  generateData: null,
  generateStatus: INITIAL_FETCH_STATUS,
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
    builder.addCase(generateTransaction.pending, (state) => {
      state.generateStatus = START_FETCH_STATUS;
    });
    builder.addCase(generateTransaction.rejected, (state, { payload: error }) => {
      state.generateStatus = REJECT_FETCH_STATUS(error as string);
    });
    builder.addCase(generateTransaction.fulfilled, (state, { payload }) => {
      state.generateStatus = FULFILLED_FETCH_STATUS;
      state.generateData = payload;
    });
  },
});

export default transactionSlice.reducer;
