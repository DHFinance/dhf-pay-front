import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '../../../../../api';

const getCourse = createAsyncThunk('getCourse', async (_, { rejectWithValue }) => {
  try {
    const result = await get('https://api.coingecko.com/api/v3/simple/price?ids=casper-network&vs_currencies=usd');
    return result.data;
  } catch (error: any) {
    if (error.response) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue('Server error');
  }
});

export { getCourse };
