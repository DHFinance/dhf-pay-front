import { Select } from 'antd';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import { useTypedDispatch } from '../../../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import { Store } from '../../../../../interfaces/store.interface';
import { getUserPayments } from '../../../../../store/slices/payments/asyncThunks/getUserPayments';
import { getUserStores } from '../../../../../store/slices/stores/asyncThunks/getUserStores';
import { Loader } from '../../../../Loader';
import PaymentsButton from '../../buttons';
import PaymentsInvoices from '../../invoices';

const { Option } = Select;

interface Props {
  entity: string;
}

const UserPayments: FC<Props> = ({ entity }) => {
  const user = useTypedSelector((state) => state.auth.data);
  const stores = useTypedSelector((state) => state.stores.data);
  const payments = useTypedSelector((state) => state.payments.data);
  const storesStatus = useTypedSelector((state) => state.stores.status);
  const totalPages = useTypedSelector((state) => state.payments.totalPages);

  const [page, setPage] = useState(1);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);

  const router = useRouter();
  const dispatch = useTypedDispatch();

  const activeStores = stores?.filter((store) => store.apiKey && !store.blocked) || [];

  const paymentsTable = payments
    ?.map((payment: any) => {
      return {
        ...payment,
        datetime: new Date(payment?.datetime).toDateString(),
        status: payment?.status?.replace('_', ' '),
        store: payment?.store?.id,
      };
    });

  useEffect(() => {
    dispatch(getUserStores(user.id));
  }, []);

  /**
   * @description function to load payments of a specific store by apiKey
   */
  useEffect(() => {
    /** @description if the stores are not empty and the user does not have the admin role, get payments */
    if (stores?.length && activeStores[0]?.apiKey) {
      dispatch(getUserPayments({ apiKey: activeStores[0]?.apiKey, page: 1 }));
    }
  }, [stores?.length]);

  useEffect(() => {
    if (!currentStore) {
      setCurrentStore(activeStores[0]);
    }
  }, [activeStores]);

  /**
   * @description handling every row,applying styles and a click event handler to it
   * @param {object} record - element of array entity
   */
  const onRow = (record: any) => {
    return {
      style: { cursor: 'pointer' },
      onClick: () => router.push(`${entity}/${record.id}`),
    };
  };

  /**
   * @description handling change of select store
   * @param {string} value
   */
  function handleChange(value: string) {
    const current = stores!.filter((store) => store.apiKey === value)[0];
    setCurrentStore(current);
    setPage(1);
    dispatch(getUserPayments({ apiKey: value, page }));
  }
  
  useEffect(() => {
    if (!currentStore) {
      return;
    }

    dispatch(getUserPayments({ apiKey: currentStore.apiKey, page }));
  }, [page]);
  
  if (storesStatus.error) {
    router.push('/');
  }

  if (storesStatus.isLoading || stores === null) {
    return <Loader />;
  }

  return (
    <>
      {!activeStores.length ? (
        <p>Create a store to be able to create payments</p>
      ) : null}
      {activeStores.length && currentStore ? (
        <>
          <Select
            defaultValue={currentStore.name}
            style={{ width: 120, margin: '0 0 20px 0' }}
            onChange={handleChange}
          >
            {activeStores.map((store) => (
              <Option key={store.id} value={store.apiKey}>
                {store.name}
              </Option>
            ))}
          </Select>
        </>
      ) : null}
      {entity === 'buttons' ? (
        <PaymentsButton currentTable={paymentsTable} onRow={onRow} currentPage={page} changePage={(newPage) => setPage(newPage)} totalPages={totalPages} />
      ) : (
        <PaymentsInvoices currentTable={paymentsTable} onRow={onRow} currentPage={page} changePage={(newPage) => setPage(newPage)} totalPages={totalPages} />
      )}
    </>
  );
};

export { UserPayments };
