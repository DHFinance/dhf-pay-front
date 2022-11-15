import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '../../../../../api';

const getCourse = createAsyncThunk('getCourse', async (currency: string, { rejectWithValue }) => {
  console.log('currency', currency);
  try {
    const result = await get(`https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=usd`);
    console.log('result', result);
    return result.data[currency];
  } catch (error: any) {
    if (error.response) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue('Server error');
  }
});

export { getCourse };
