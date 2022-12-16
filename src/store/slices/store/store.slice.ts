import { createSlice } from '@reduxjs/toolkit';
import {
  FULFILLED_FETCH_STATUS,
  INITIAL_FETCH_STATUS,
  REJECT_FETCH_STATUS,
  START_FETCH_STATUS,
} from '../../../constatnts/fetchStatuses.constant';
import { FetchStatus } from '../../../interfaces/fetchStatus.interface';
import { Store } from '../../../interfaces/store.interface';
import { addStore } from './asynkThunks/addStore';
import { blockStore } from './asynkThunks/blockStore';
import { editStore } from './asynkThunks/editStore';
import { getStore } from './asynkThunks/getStore';
import { unblockStore } from './asynkThunks/unblockStore';

interface InitialState {
  data: Store | null;
  status: FetchStatus;
}

const initialState: InitialState = {
  data: null,
  status: INITIAL_FETCH_STATUS,
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStore.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(getStore.rejected, (state) => {
      state.status = FULFILLED_FETCH_STATUS;
    });
    builder.addCase(getStore.fulfilled, (state, { payload }) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data = payload;
    });
    builder.addCase(blockStore.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(blockStore.rejected, (state, { payload: error }) => {
      state.status = REJECT_FETCH_STATUS(error as string);
    });
    builder.addCase(blockStore.fulfilled, (state, { payload }) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data = payload;
    });
    builder.addCase(unblockStore.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(unblockStore.rejected, (state, { payload: error }) => {
      state.status = REJECT_FETCH_STATUS(error as string);
    });
    builder.addCase(unblockStore.fulfilled, (state, { payload }) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data = payload;
    });
    builder.addCase(editStore.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(editStore.rejected, (state, { payload: error }) => {
      state.status = REJECT_FETCH_STATUS(error as string);
    });
    builder.addCase(editStore.fulfilled, (state, { payload }) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data = payload;
    });
    builder.addCase(addStore.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(addStore.rejected, (state, { payload: error }) => {
      state.status = REJECT_FETCH_STATUS(error as string);
    });
    builder.addCase(addStore.fulfilled, (state) => {
      state.status = FULFILLED_FETCH_STATUS;
    });
  },
});

export default storeSlice.reducer;
