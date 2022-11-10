import { createAsyncThunk } from '@reduxjs/toolkit';
import { post } from '../../../../../api';

/**
 * @description Password recovery stage 1. searches for a user by email sends a code to the mail. Return true to move to the next step
 */
const postRestoreStepEmail = createAsyncThunk(
  'postRestoreStepEmail',
  async (data: any, { rejectWithValue }) => {
    try {
      const result = await post('/auth/send-code', data);
      return {
        code: result.data,
        email: data.email,
      };
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Server error');
    }
  },
);

export { postRestoreStepEmail };
