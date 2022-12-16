import { FetchStatus } from '../interfaces/fetchStatus.interface';

const INITIAL_FETCH_STATUS: FetchStatus = {
  isLoading: false,
  error: '',
};

const START_FETCH_STATUS: FetchStatus = {
  isLoading: true,
  error: '',
};

const REJECT_FETCH_STATUS = (error: string): FetchStatus => ({
  isLoading: false,
  error,
});

const FULFILLED_FETCH_STATUS: FetchStatus = {
  isLoading: false,
  error: '',
};

export {
  INITIAL_FETCH_STATUS,
  FULFILLED_FETCH_STATUS,
  REJECT_FETCH_STATUS,
  START_FETCH_STATUS,
};
