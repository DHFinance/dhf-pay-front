import { createAsyncThunk } from '@reduxjs/toolkit';
import { post } from '../../../../../api';
import { RootState } from '../../../store';

/**
 * @description Blocking a specific store.
 */
const blockStore = createAsyncThunk(
  'blockStore',
  async (id: number, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as RootState).auth?.data?.token;
      const result = await post(
        '/store/block',
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

export { blockStore };
