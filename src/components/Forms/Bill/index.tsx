import { DAppProvider } from '@usedapp/core';
import React, { useEffect } from 'react';
import { configDapp } from '../../../../ethConfig/config';
import { CurrencyType } from '../../../enums/currency.enum';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Payment } from '../../../interfaces/payment.interface';
import { Transaction } from '../../../interfaces/transaction.interface';
import { CurrencyFabric } from '../../../modules/curriencies/currencyFabric';
import { clearCourse } from '../../../store/slices/course/course.slice';
import { getPayment } from '../../../store/slices/payment/asyncThunks/getPayment';
import { getLastTransaction } from '../../../store/slices/transaction/asyncThunks/getLastTransaction';
import { Loader } from '../../Loader';
import CasperBill from './components/CasperBill';
import { DefaultBill } from './components/DefaultBill';
import { EthereumBill } from './components/EthereumBill';

/**
 *
 * @description wrapper component. Depending on the value of NEXT_PUBLIC_FAKE_TRANSACTION, it will issue a fake payment component (without using a signer) or a real one (capable of working with the signer extension)
 */
const Bill = () => {
  const course = useTypedSelector((state) => state.course.data.usd);
  const courseStatus = useTypedSelector((state) => state.course.status);
  const payment = useTypedSelector((state) => state.payment.data);
  const paymentStatus = useTypedSelector((state) => state.payment.status);
  const transaction = useTypedSelector((state) => state.transaction.data);
  const transactionStatus = useTypedSelector(
    (state) => state.transaction.status,
  );
  const dispatch = useTypedDispatch();

  useEffect(() => {
    dispatch(clearCourse());
    const pathname = window.location.pathname.split('/');
    const id = pathname && pathname[pathname.length - 1];
    dispatch(getPayment(id));
  }, []);

  useEffect(() => {
    if (!payment || !payment.currency) {
      return;
    }
    const currency = CurrencyFabric.create(payment.currency);
    currency.getCourse();
  }, [payment]);

  useEffect(() => {
    if (payment?.store?.id) {
      dispatch(getLastTransaction(payment?.id));
    }
  }, [payment]);

  if (paymentStatus.error || courseStatus.error) {
    return <p>Error</p>;
  }

  if (
    paymentStatus.isLoading ||
    payment === null ||
    courseStatus.isLoading ||
    course === null ||
    transactionStatus.isLoading
  ) {
    return <Loader />;
  }

  function getBill() {
    switch (payment?.currency) {
      case CurrencyType.Ethereum: {
        return (
          <DAppProvider config={configDapp}>
            <EthereumBill
              billInfo={payment}
              course={course}
              transaction={transaction as Transaction}
              date={new Date()}
            />
          </DAppProvider>
        );
      }
      case CurrencyType.Casper: {
        return (
          <CasperBill
            billInfo={payment}
            course={course as number}
            payment={payment}
            transaction={transaction as Transaction}
          />
        );
      }
      default: {
        return <DefaultBill billInfo={payment as Payment} course={course as number} />;
      }
    }
  }

  return getBill();
};

export default Bill;
