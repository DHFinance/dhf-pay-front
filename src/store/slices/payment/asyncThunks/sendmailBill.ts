import { createAsyncThunk } from '@reduxjs/toolkit';
import { put } from '../../../../../api';
import { RootState } from '../../../store';

/**
 * @description Sending a letter by mail. Occurs on the store token with the passed request body.
 */ 
const sendMailBill = createAsyncThunk(
  'sendMailBill',
  async (
    payload: {
      id: number;
      email: string;
      billUrl: string;
    },
    { rejectWithValue, getState },
  ) => {
    try {
      const token = (getState() as RootState).auth?.data?.token;
      const result = await put(
        'payment/send-mail-bill',
        { id: payload.id, billUrl: payload.billUrl, email: payload.email },
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

export { sendMailBill };
