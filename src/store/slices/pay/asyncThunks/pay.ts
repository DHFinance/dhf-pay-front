import { createAsyncThunk } from '@reduxjs/toolkit';
import { post } from '../../../../../api';
import { RootState } from '../../../store';

/**
 * @description Payment payment. Payment is made by the user's token, after which the success|failed method is called
 */
const pay = createAsyncThunk(
  'pay',
  async (data: any, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as RootState).auth?.data?.token;
      const result = await post('/transaction', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return result.data.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Server error');
    }
  },
);

export { pay };
