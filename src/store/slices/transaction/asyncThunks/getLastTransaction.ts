import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '../../../../../api';

/**
 * @description Getting a list of all transactions created through a specific store
 */
const getLastTransaction = createAsyncThunk<any, number>(
  'getLastTransaction',
  async (paymentId, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth?.data?.token;
      const result = await get(`/transaction/last/${paymentId}`, {
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

export { getLastTransaction };
