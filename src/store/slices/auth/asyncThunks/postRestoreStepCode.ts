import { createAsyncThunk } from '@reduxjs/toolkit';
import { post } from '../../../../../api';

/**
 * @description Password recovery stage 2. Comparison of the code that came from the front and the code from the user's record. If the codes match, move on to the next step.
 */
const postRestoreStepCode = createAsyncThunk(
  'postRestoreStepCode',
  async (data: any, { rejectWithValue }) => {
    try {
      await post('/auth/check-code', data);
      return true;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Server error');
    }
  },
);

export { postRestoreStepCode };
