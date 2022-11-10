import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '../../../../../api';

/**
 * @description Getting a user by id
 */
const getUser = createAsyncThunk(
  'getUser',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth?.data?.token;
      const result = await get(`/user/${id}`, {
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

export { getUser };
