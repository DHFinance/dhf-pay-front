import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FULFILLED_FETCH_STATUS,
  INITIAL_FETCH_STATUS,
  REJECT_FETCH_STATUS,
  START_FETCH_STATUS,
} from '../../../constatnts/fetchStatuses.constant';
import { FetchStatus } from '../../../interfaces/fetchStatus.interface';
import { Payment } from '../../../interfaces/payment.interface';
import { getPayments } from './asyncThunks/getPayments';
import { getUserPayments } from './asyncThunks/getUserPayments';

interface InitialState {
  data: Payment[] | null;
  status: FetchStatus;
  totalPages: number;
}

const initialState: InitialState = {
  data: null,
  status: INITIAL_FETCH_STATUS,
  totalPages: 0,
};

const paymentsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPayments.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(getPayments.rejected, (state, { payload: error }) => {
      state.status = REJECT_FETCH_STATUS(error as string);
    });
    builder.addCase(getPayments.fulfilled, (state, { payload }: PayloadAction<{ payments: Payment[], count: number }>) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data = payload.payments;
      state.totalPages = payload.count;
    });
    builder.addCase(getUserPayments.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(getUserPayments.rejected, (state, { payload: error }) => {
      state.status = REJECT_FETCH_STATUS(error as string);
    });
    builder.addCase(getUserPayments.fulfilled, (state, { payload }: PayloadAction<{ payments: Payment[], count: number }>) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data = payload.payments;
      state.totalPages = payload.count;
    });
  },
});

export default paymentsSlice.reducer;
