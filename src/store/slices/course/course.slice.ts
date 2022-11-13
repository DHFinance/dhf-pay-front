import { createSlice } from '@reduxjs/toolkit';
import {
  FULFILLED_FETCH_STATUS,
  INITIAL_FETCH_STATUS,
  REJECT_FETCH_STATUS,
  START_FETCH_STATUS,
} from '../../../constatnts/fetchStatuses.constant';
import { FetchStatus } from '../../../interfaces/fetchStatus.interface';
import { getCourse } from './asyncThunks/getCourse';

interface InitialState {
  data: {
    usd: number | null;
  };
  status: FetchStatus;
}

const initialState: InitialState = {
  data: {
    usd: null,
  },
  status: INITIAL_FETCH_STATUS,
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCourse.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(getCourse.rejected, (state, { payload: error }) => {
      state.status = REJECT_FETCH_STATUS(error as string);
    });
    builder.addCase(getCourse.fulfilled, (state, { payload }) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.data.usd = payload.usd;
    });
  },
});

export default courseSlice.reducer;
