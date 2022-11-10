import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '../../../../../api';
import { RootState } from '../../../store';

/**
 * @description Getting a list of all transactions
 */
const getTransactions = createAsyncThunk(
  'getTransactions',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as RootState).auth?.data?.token;
      const result = await get('/transaction', {
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

export { getTransactions };