import { createAsyncThunk } from '@reduxjs/toolkit';
import { post } from '../../../../../api';

/**
 * @description Changing a user's ban status
 */
const blockUser = createAsyncThunk(
  'blockUser',
  async (payload: {
    id: number;
    blocked: boolean;
  }, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth?.data?.token;
      const result = await post(
        '/user/block',
        {
          id: payload.id,
          blocked: payload.blocked,
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

export { blockUser };
