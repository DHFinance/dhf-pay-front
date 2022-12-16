import { createSlice } from '@reduxjs/toolkit';
import {
  FULFILLED_FETCH_STATUS,
  INITIAL_FETCH_STATUS,
  REJECT_FETCH_STATUS,
  START_FETCH_STATUS,
} from '../../../constatnts/fetchStatuses.constant';
import { FetchStatus } from '../../../interfaces/fetchStatus.interface';
import { User } from '../../../interfaces/user.interface';
import { getUsers } from './asyncThunks/getUsers';

interface InitialState {
  data: User[] | null;
  status: FetchStatus;
}

const initialState: InitialState = {
  data: null,
  status: INITIAL_FETCH_STATUS,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(getUsers.rejected, (state, { payload: error }) => {
      state.status = REJECT_FETCH_STATUS(error as string);
    });
    builder.addCase(getUsers.fulfilled, (state, { payload }) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data = payload;
    });
  },
});

export default usersSlice.reducer;
