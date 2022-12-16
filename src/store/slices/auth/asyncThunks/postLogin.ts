import { createAsyncThunk } from '@reduxjs/toolkit';
import { post } from '../../../../../api';

/**
 * @description login. searches for a user by email and checks the password. If all data is correct - issues a token
 */
const postLogin = createAsyncThunk(
  'postLogin',
  async (payload: any, { rejectWithValue }) => {
    try {
      const result = await post('auth/login', payload);
      return result.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Server error');
    }
  },
);

export { postLogin };
