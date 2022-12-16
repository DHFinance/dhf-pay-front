import { createAsyncThunk } from '@reduxjs/toolkit';
import { put } from '../../../../../api';
import { RootState } from '../../../store';

const cancelPayment = createAsyncThunk(
  'cancelPayment',
  async (
    id: number,
    { rejectWithValue, getState },
  ) => {
    try {
      const token = (getState() as RootState).auth?.data?.token;
      const result = await put(
        `payment/cancel/${id}`,
        {},
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

export { cancelPayment };
