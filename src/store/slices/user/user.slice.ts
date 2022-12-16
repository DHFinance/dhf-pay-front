import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FULFILLED_FETCH_STATUS,
  INITIAL_FETCH_STATUS,
  REJECT_FETCH_STATUS,
  START_FETCH_STATUS,
} from '../../../constatnts/fetchStatuses.constant';
import { FetchStatus } from '../../../interfaces/fetchStatus.interface';
import { User } from '../../../interfaces/user.interface';
import { blockUser } from './asyncThunks/blockUser';
import { getUser } from './asyncThunks/getUser';

interface InitialState {
  data: User | null;
  status: FetchStatus;
  captchaToken: string;
  update: string;
}

const initialState: InitialState = {
  data: null,
  status: INITIAL_FETCH_STATUS,
  captchaToken: '',
  update: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUpdateCaptcha(state, { payload }: PayloadAction<string>) {
      state.update = payload;
    },
    setCaptchaToken(state, { payload }: PayloadAction<string>) {
      state.captchaToken = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(getUser.rejected, (state, { payload: error }) => {
      state.status = REJECT_FETCH_STATUS(error as string);
    });
    builder.addCase(getUser.fulfilled, (state, { payload }) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data = payload;
    });
    builder.addCase(blockUser.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(blockUser.rejected, (state, { payload: error }) => {
      state.status = REJECT_FETCH_STATUS(error as string);
    });
    builder.addCase(blockUser.fulfilled, (state, { payload }) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data = payload;
    });
  },
});

export default userSlice.reducer;
export const { setUpdateCaptcha, setCaptchaToken } = userSlice.actions;
