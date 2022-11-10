import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import authSlice from './slices/auth/auth.slice';
import courseSlice from './slices/course/course.slice';
import paySlice from './slices/pay/pay.slice';
import paymentSlice from './slices/payment/payment.slice';
import paymentsSlice from './slices/payments/payments.slice';
import storeSlice from './slices/store/store.slice';
import storesSlice from './slices/stores/stores.slice';
import transactionSlice from './slices/transaction/transaction.slice';
import transactionsSlice from './slices/transactions/transactions.slice';
import userSlice from './slices/user/user.slice';
import usersSlice from './slices/users/users.slice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    course: courseSlice,
    pay: paySlice,
    payment: paymentSlice,
    payments: paymentsSlice,
    store: storeSlice,
    stores: storesSlice,
    transaction: transactionSlice,
    transactions: transactionsSlice,
    user: userSlice,
    users: usersSlice,
  },
  middleware: ((getDefaultMiddleware: any) => getDefaultMiddleware({
    serializableCheck: false,
  })),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;

const initStore = () => {
  return store;
};

export { store };

export const wrapper = createWrapper(initStore);
