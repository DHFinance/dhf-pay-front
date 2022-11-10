import { createAsyncThunk } from '@reduxjs/toolkit';
import { post } from '../../../../../api';

/**
 * @description check if the user exists in the database. Occurs every time the page is reloaded
 */
const reAuth = createAsyncThunk(
  'reAuth',
  async (token: string, { rejectWithValue }) => {
    try {
      const result = await post('auth/reAuth', { token });
      return result.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Server error');
    }
  },
);

export { reAuth };
