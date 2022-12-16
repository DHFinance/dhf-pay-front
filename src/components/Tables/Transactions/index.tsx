import { Select, Table } from 'antd';
import 'antd/dist/antd.css';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { UserRole } from '../../../modules/user/enums/userRole.enum';
import { getUserStores } from '../../../store/slices/stores/asyncThunks/getUserStores';
import { getTransactions } from '../../../store/slices/transactions/asyncThunks/getTransactions';
import { getUserTransactions } from '../../../store/slices/transactions/asyncThunks/getUserTransactions';
import { Loader } from '../../Loader';

const { Option } = Select;

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'TxHash',
    dataIndex: 'txHash',
    key: 'txHash',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Sender',
    key: 'sender',
    dataIndex: 'sender',
  },
];

const Transactions = () => {
  const transactionsStatus = useTypedSelector(
    (state) => state.transactions.status,
  );
  const transactions = useTypedSelector((state) => state.transactions.data);
  const stores = useTypedSelector((state) => state.stores.data);
  const storesStatus = useTypedSelector((state) => state.stores.status);
  const user = useTypedSelector((state) => state.auth.data);

  const router = useRouter();
  const dispatch = useTypedDispatch();

  const activeStores =
    stores?.filter((store) => store.apiKey && !store.blocked) || [];

  useEffect(() => {
    if (user?.role === UserRole.Admin) {
      dispatch(getTransactions());
    }
    if (user?.role === UserRole.Customer) {
      dispatch(getUserStores(user.id));
    }
  }, []);

  useEffect(() => {
    if (
      stores?.length &&
      user.role !== UserRole.Admin &&
      activeStores[0]?.apiKey
    ) {
      dispatch(getUserTransactions(activeStores[0]?.apiKey));
    }
  }, [stores?.length]);

  /**
   * @description handling every row,applying styles and a click event handler to it
   */
  const onRow = (record: any) => {
    return {
      style: { cursor: 'pointer' },
      onClick: () => router.push(`transactions/${record.txHash}`), // click row
    };
  };

  /**
   * @description handling change of select store and get transactions by a specific store api key
   */
  function handleChange(value: string) {
    dispatch(getUserTransactions(value));
  }

  if (
    (transactionsStatus.error && stores?.length) ||
    (user.role === UserRole.Customer && storesStatus.error)
  ) {
    router.push('/');
  }

  if (
    transactions === null ||
    transactionsStatus.isLoading ||
    (user.role === UserRole.Customer &&
      (stores === null || storesStatus.isLoading))
  ) {
    return <Loader />;
  }

  return (
    <>
      {!activeStores.length && user.role !== UserRole.Admin ? (
        <p>Create a store to be able to check transactions</p>
      ) : null}
      {user.role !== UserRole.Admin &&
      activeStores.length &&
      activeStores[0]?.name ? (
        <Select
          defaultValue={activeStores[0]?.name}
          style={{ width: 120, marginBottom: 20 }}
          onChange={handleChange}
        >
          {activeStores.map((store) => (
            <Option key={store.id} value={store.apiKey}>
              {store.name}
            </Option>
          ))}
        </Select>
        ) : null}
      <Table
        columns={columns}
        scroll={{ x: 0 }}
        onRow={onRow}
        dataSource={[...transactions].reverse()}
      />
    </>
  );
};

export default Transactions;
