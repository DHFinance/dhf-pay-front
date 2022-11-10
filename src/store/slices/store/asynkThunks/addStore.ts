import { createAsyncThunk } from '@reduxjs/toolkit';
import { post } from '../../../../../api';
import { AddStore } from '../../../../interfaces/addStore.interface';
import { RootState } from '../../../store';

/**
 * @description Adding a store.
 */
const addStore = createAsyncThunk(
  'addStore',
  async (data: AddStore, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as RootState).auth?.data?.token;
      console.log(data);
      const result = await post(
        '/store',
        {
          ...data,
          blocked: false,
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

export { addStore };
