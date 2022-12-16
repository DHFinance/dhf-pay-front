import { createSlice } from '@reduxjs/toolkit';
import {
  FULFILLED_FETCH_STATUS,
  INITIAL_FETCH_STATUS,
  START_FETCH_STATUS,
} from '../../../constatnts/fetchStatuses.constant';
import { FetchStatus } from '../../../interfaces/fetchStatus.interface';
import { Store } from '../../../interfaces/store.interface';
import { User } from '../../../interfaces/user.interface';
import { getStores } from './asyncThunks/getStores';
import { getUserStores } from './asyncThunks/getUserStores';

interface InitialState {
  data: Store[] | null;
  status: FetchStatus;
}

const initialState: InitialState = {
  data: null,
  status: INITIAL_FETCH_STATUS,
};

const storesSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStores.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(getStores.rejected, (state) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data = [];
    });
    builder.addCase(getStores.fulfilled, (state, { payload }) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data = payload.sort((a: Store, b: Store) => a.id - b.id);
    });
    builder.addCase(getUserStores.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(getUserStores.rejected, (state) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data = [];
    });
    builder.addCase(getUserStores.fulfilled, (state, { payload }) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data = payload.sort((a: User, b: User) => a.id - b.id);
    });
  },
});

export default storesSlice.reducer;
