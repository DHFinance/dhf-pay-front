import { createAsyncThunk } from '@reduxjs/toolkit';
import { post } from '../../../../../api';

/**
 * @description User registration, stage 2. receives the confirmation code, compares it with what is written on the back. If the code is correct, you can log in to this user
 */
const postVerify = createAsyncThunk(
  'postVerify',
  async (
    payload: {
      email: string;
      code: string;
      captcha: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const result = await post('/auth/verify', payload);
      return result.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Server error');
    }
  },
);

export { postVerify };
