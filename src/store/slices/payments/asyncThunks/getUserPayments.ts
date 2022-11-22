import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '../../../../../api';

/**
 * @description Receiving payments. The payments of the store corresponding to the passed key are returned. After the operation, the success|failed method is executed
 */
const getUserPayments = createAsyncThunk(
  'getUserPayments',
  async (payload: { apiKey: string, page: number }, { rejectWithValue }) => {
    try {
      const result = await get('/payment', {
        headers: { Authorization: `Bearer ${payload.apiKey}` },
        params: { limit: 10, page: payload.page },
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

export { getUserPayments };
