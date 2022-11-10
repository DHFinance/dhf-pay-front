import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '../../../../../api';
import { RootState } from '../../../store';

/**
 * @description Receiving payments. All existing payments are returned. After the operation, the success|failed method is executed
 */
const getPayments = createAsyncThunk(
  'getPayments',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as RootState).auth?.data?.token;
      const result = await get('/payment', {
        headers: { Authorization: `Bearer ${token}` },
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

export { getPayments };
