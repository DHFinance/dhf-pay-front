import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FULFILLED_FETCH_STATUS,
  INITIAL_FETCH_STATUS,
  REJECT_FETCH_STATUS,
  START_FETCH_STATUS,
} from '../../../constatnts/fetchStatuses.constant';
import { AuthUser } from '../../../interfaces/authUser.interface';
import { FetchStatus } from '../../../interfaces/fetchStatus.interface';
import { UserRole } from '../../../modules/user/enums/userRole.enum';
import { postLogin } from './asyncThunks/postLogin';
import { postLogout } from './asyncThunks/postLogout';
import { postRegistration } from './asyncThunks/postRegistration';
import { postRestoreStepCode } from './asyncThunks/postRestoreStepCode';
import { postRestoreStepEmail } from './asyncThunks/postRestoreStepEmail';
import { postRestoreStepPassword } from './asyncThunks/postRestoreStepPassword';
import { postVerify } from './asyncThunks/postVerify';
import { reAuth } from './asyncThunks/reAuth';

interface InitialState {
  data: AuthUser;
  verify: boolean;
  status: FetchStatus;
}

const initialState: InitialState = {
  data: {
    id: -1,
    name: '',
    lastName: '',
    resetEnabled: false,
    email: '',
    token: '',
    company: '',
    role: UserRole.Customer,
  },
  verify: false,
  status: INITIAL_FETCH_STATUS,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth(state) {
      state.data = initialState.data;
      state.verify = initialState.verify;
      state.status = INITIAL_FETCH_STATUS;
    },
    clearAuthError(state) {
      state.status.error = INITIAL_FETCH_STATUS.error;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postRegistration.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(postRegistration.rejected, (state, { payload: error }) => {
      state.status = REJECT_FETCH_STATUS(error as string);
      state.verify = true;
    });
    builder.addCase(postRegistration.fulfilled, (state) => {
      state.status = FULFILLED_FETCH_STATUS;
      state.verify = true;
    });
    builder.addCase(postLogin.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(postLogin.rejected, (state, { payload: error }) => {
      state.status = REJECT_FETCH_STATUS(error as string);
      localStorage.removeItem('token');
    });
    builder.addCase(
      postLogin.fulfilled,
      (state, { payload }: PayloadAction<any>) => {
        state.status = FULFILLED_FETCH_STATUS;
        state.data = payload;
        window.location.replace('/');
        if (payload.token) {
          localStorage.setItem('token', payload.token);
        }
      },
    );
    builder.addCase(postLogout.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(postLogout.rejected, (state, { payload: error }) => {
      state.status = REJECT_FETCH_STATUS(error as string);
    });
    builder.addCase(postLogout.fulfilled, (state) => {
      localStorage.removeItem('token');
      state.data = initialState.data;
      state.status = FULFILLED_FETCH_STATUS;
      state.verify = initialState.verify;
      window.location.replace('/');
    });
    builder.addCase(postVerify.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(postVerify.rejected, (state, { payload: error }) => {
      state.status = REJECT_FETCH_STATUS(error as string);
      if (!error || error === 'code') {
        state.status.error = 'Wrong code';
      }
    });
    builder.addCase(postVerify.fulfilled, (state, { payload }: any) => {
      if (payload.token) {
        localStorage.setItem('token', payload.token);
      }
      window.location.replace('/');
      state.data = payload;
      state.status = FULFILLED_FETCH_STATUS;
    });
    builder.addCase(reAuth.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(reAuth.rejected, (state, { payload: error }) => {
      state.status = REJECT_FETCH_STATUS(error as string);
      localStorage.removeItem('token');
    });
    builder.addCase(
      reAuth.fulfilled,
      (state, { payload }: PayloadAction<any>) => {
        state.status = FULFILLED_FETCH_STATUS;
        state.data = payload;
        if (payload?.token) {
          localStorage.setItem('token', payload.token);
        }
      },
    );
    builder.addCase(postRestoreStepEmail.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(
      postRestoreStepEmail.rejected,
      (state, { payload: error }) => {
        state.status = REJECT_FETCH_STATUS(error as string);
      },
    );
    builder.addCase(
      postRestoreStepEmail.fulfilled,
      (state, { payload }: PayloadAction<any>) => {
        state.status = FULFILLED_FETCH_STATUS;
        state.data.email = payload.email;
      },
    );
    builder.addCase(postRestoreStepCode.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(
      postRestoreStepCode.rejected,
      (state, { payload: error }) => {
        state.status = REJECT_FETCH_STATUS(error as string);
      },
    );
    builder.addCase(
      postRestoreStepCode.fulfilled,
      (state, { payload }: PayloadAction<boolean>) => {
        state.status = FULFILLED_FETCH_STATUS;
        state.data.resetEnabled = payload;
      },
    );
    builder.addCase(postRestoreStepPassword.pending, (state) => {
      state.status = START_FETCH_STATUS;
    });
    builder.addCase(
      postRestoreStepPassword.rejected,
      (state, { payload: error }) => {
        state.status = REJECT_FETCH_STATUS(error as string);
      },
    );
    builder.addCase(
      postRestoreStepPassword.fulfilled,
      (state, { payload }: PayloadAction<any>) => {
        state.status = FULFILLED_FETCH_STATUS;
        state.data = payload;
        state.data.resetEnabled = true;
        window.location.replace('/');
      },
    );
  },
});

export default authSlice.reducer;
export const { clearAuth, clearAuthError } = authSlice.actions;
