import { createAsyncThunk } from '@reduxjs/toolkit';
import { post } from '../../../../../api';
import { CreatePayment } from '../../../../interfaces/createPayment.interface';

/**
 * @description Adding a payment. Occurs on the store token, after which the success|failed method is called
 */
const addPayment = createAsyncThunk(
  'addPayment',
  async (
    payload: {
      data: CreatePayment;
      apiKey: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const result = await post('/payment', payload.data, {
        headers: { Authorization: `Bearer ${payload.apiKey}` },
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

export { addPayment };
