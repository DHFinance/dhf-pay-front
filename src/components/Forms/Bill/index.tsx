import React, { useEffect } from 'react';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Transaction } from '../../../interfaces/transaction.interface';
import { getCourse } from '../../../store/slices/course/asyncThunks/getCourse';
import { getPayment } from '../../../store/slices/payment/asyncThunks/getPayment';
import { getLastTransaction } from '../../../store/slices/transaction/asyncThunks/getLastTransaction';
import { Loader } from '../../Loader';
import CasperBill from './components/CasperBill';
import FakeBill from './components/FakeBill';

/**
 *
 * @description wrapper component. Depending on the value of NEXT_PUBLIC_FAKE_TRANSACTION, it will issue a fake payment component (without using a signer) or a real one (capable of working with the signer extension)
 */
const Bill = () => {
  const isFake = process.env.NEXT_PUBLIC_FAKE_TRANSACTION === '1';
  const course = useTypedSelector((state) => state.course.data.usd);
  const courseStatus = useTypedSelector((state) => state.course.status);
  const payment = useTypedSelector((state) => state.payment.data);
  const paymentStatus = useTypedSelector((state) => state.payment.status);
  const transaction = useTypedSelector((state) => state.transaction.data);
  const transactionStatus = useTypedSelector((state) => state.transaction.status);
  const dispatch = useTypedDispatch();

  useEffect(() => {
    const pathname = window.location.pathname.split('/');
    const id = pathname && pathname[pathname.length - 1];
    dispatch(getPayment(id));
    dispatch(getCourse());
  }, []);

  useEffect(() => {
    if (payment?.store?.id) {
      dispatch(getLastTransaction(payment?.id));
    }
  }, [payment]);
  
  if (paymentStatus.error || courseStatus.error || transactionStatus.error) {
    return <p>Error</p>;
  }
  
  if (paymentStatus.isLoading || payment === null || courseStatus.isLoading || course === null || transactionStatus.isLoading || transaction === null) {
    return <Loader />;
  }

  if (isFake) {
    return (
      <FakeBill billInfo={payment} transaction={transaction} course={course} />
    );
  }

  return (
    <CasperBill
      billInfo={payment}
      course={course}
      payment={payment}
      transaction={transaction as Transaction}
    />
  );
};

export default Bill;
