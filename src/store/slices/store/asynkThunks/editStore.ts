import { createAsyncThunk } from '@reduxjs/toolkit';
import { patch } from '../../../../../api';
import { Store } from '../../../../interfaces/store.interface';
import { RootState } from '../../../store';

/**
 * @description Changing a specific field (column) in the shop state.
 */
const editStore = createAsyncThunk(
  'editStore',
  async (
    payload: {
      id: string;
      data: Store;
    },
    { rejectWithValue, getState },
  ) => {
    try {
      const token = (getState() as RootState).auth?.data?.token;
      const result = await patch(`/store/${payload.id}`, payload.data, {
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

export { editStore };
