import { createAsyncThunk } from '@reduxjs/toolkit';
import { post } from '../../../../../api';
import { RootState } from '../../../store';

/**
 * @description User exit user. After logging out, the user is redirected to the main page of the site and the success|error state is recorded
 */
const postLogout = createAsyncThunk(
  'postLogout',
  async (_, { rejectWithValue, getState }) => {
    try {
      const user = (getState() as RootState).auth;
      const result = await post('/auth/logout', {
        email: user.data.email,
        token: user.data.token,
      });
      return result.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Server error');
    }
  },
);

export { postLogout };
