import { createAsyncThunk } from '@reduxjs/toolkit';
import { post } from '../../../../../api';

/**
 * @description Password recovery stage 3. Password change, receives a new password and replaces the current one with it. Sends user data
 */
const postRestoreStepPassword = createAsyncThunk(
  'postRestoreStepPassword',
  async (data: any, { rejectWithValue }) => {
    try {
      const result = await post('/auth/reset-pwd', data);
      return result.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Server error');
    }
  },
);

export { postRestoreStepPassword };
