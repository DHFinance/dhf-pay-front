import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '../../../../../api';

/**
 * @description Get a list of stores for a specific user.
 */ 
const getUserStores = createAsyncThunk(
  'getUserTransactions',
  async (userId: number, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth?.data?.token;
      const result = await get('/store', {
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

export { getUserStores };
