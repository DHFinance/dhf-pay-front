import { createAsyncThunk } from '@reduxjs/toolkit';
import { post } from '../../../../../api';

/**
 * @description User registration, stage 1. Receives user data, sends a confirmation code in a letter to the specified email
 */
const postRegistration = createAsyncThunk(
  'postRegistration',
  async (payload: any, { rejectWithValue }) => {
    try {
      const result = await post('/auth/register', {
        ...payload,
        blocked: false,
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

export { postRegistration };
