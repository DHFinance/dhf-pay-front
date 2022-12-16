import { createAsyncThunk } from '@reduxjs/toolkit';  
import { get } from '../../../../../api';

/**
 * @description Getting a list of all transactions created through a specific store
 */
const getUserTransactions = createAsyncThunk(
  'getUserTransactions',
  async (apiKey: string, { rejectWithValue }) => {
    try {
      const result = await get('/transaction', {
        headers: { Authorization: `Bearer ${apiKey}` },
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

export { getUserTransactions };
