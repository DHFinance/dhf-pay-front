import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FULFILLED_FETCH_STATUS,
  INITIAL_FETCH_STATUS,
  REJECT_FETCH_STATUS,
  START_FETCH_STATUS,
} from '../../../constatnts/fetchStatuses.constant';
import { FetchStatus } from '../../../interfaces/fetchStatus.interface';
import { pay } from './asyncThunks/pay';

interface InitialState {
  data: any;
  status: FetchStatus;
}

const initialState: InitialState = {
  data: {},
  status: INITIAL_FETCH_STATUS,
};

const paySlice = createSlice({
  name: 'pay',
  initialState,
  reducers: {
    setCasperData(state, { payload }: PayloadAction<any>) {
      state.data = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(pay.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(pay.rejected, (state, { payload: error }) => {
      state.status = REJECT_FETCH_STATUS(error as string);
    });
    builder.addCase(pay.fulfilled, (state) => {
      state.status = FULFILLED_FETCH_STATUS;
    });
  },
});

export default paySlice.reducer;
export const { setCasperData } = paySlice.actions;
