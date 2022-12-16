import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import { useTypedDispatch } from '../../../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import { getPayments } from '../../../../../store/slices/payments/asyncThunks/getPayments';
import { Loader } from '../../../../Loader';
import PaymentsButton from '../../buttons';
import PaymentsInvoices from '../../invoices';

interface Props {
  entity: string;
}

const AdminPayments: FC<Props> = ({ entity }) => {
  const payments = useTypedSelector((state) => state.payments.data);
  const paymentsStatus = useTypedSelector((state) => state.payments.status);
  const totalPages = useTypedSelector((state) => state.payments.totalPages);
  
  const [page, setPage] = useState(1);

  const router = useRouter();
  const dispatch = useTypedDispatch();

  useEffect(() => {
    dispatch(getPayments(page));
  }, [page]);

  const paymentsTable = payments
    ?.map((payment: any) => {
      return {
        ...payment,
        datetime: new Date(payment?.datetime).toDateString(),
        status: payment?.status?.replace('_', ' '),
        store: payment?.store?.id,
      };
    });

  /**
   * @description handling every row,applying styles and a click event handler to it
   * @param {object} record - element of array entity
   */
  const onRow = (record: any) => {
    return {
      style: { cursor: 'pointer' },
      onClick: () => router.push(`${entity}/${record.url}`),
    };
  };

  if (paymentsStatus.error) {
    router.push('/');
  }

  if (paymentsStatus.isLoading || payments === null) {
    return <Loader />;
  }

  return (entity === 'buttons') ? (
    <PaymentsButton currentTable={paymentsTable} onRow={onRow} currentPage={page} changePage={(newPage) => setPage(newPage)} totalPages={totalPages} />
  ) : (
    <PaymentsInvoices currentTable={paymentsTable} onRow={onRow} currentPage={page} changePage={(newPage) => setPage(newPage)} totalPages={totalPages} />
  );
};

export { AdminPayments };
