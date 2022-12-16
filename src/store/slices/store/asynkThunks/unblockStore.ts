import { createAsyncThunk } from '@reduxjs/toolkit';
import { post } from '../../../../../api';

const unblockStore = createAsyncThunk(
  'unblockStore',
  async (id: number, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth?.data?.token;
      const result = await post(
        '/store/unblock',
        {
          id,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return result.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Server error');
    }
  },
);

export { unblockStore };
