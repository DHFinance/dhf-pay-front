import { Button, Table } from 'antd';
import 'antd/dist/antd.css';
import React, { useEffect } from 'react';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { AddStoreModal } from '../../../modules/store/components/AddStoreModal';
import { UserRole } from '../../../modules/user/enums/userRole.enum';
import { getStores } from '../../../store/slices/stores/asyncThunks/getStores';
import { getUserStores } from '../../../store/slices/stores/asyncThunks/getUserStores';
import { wrapper } from '../../../store/store';
import { useStoresTable } from './hooks/useStoresTable';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'User',
    key: 'user',
    dataIndex: 'user',
  },
  {
    title: 'Available currencies',
    key: 'availableCurrencies',
    dataIndex: 'availableCurrencies',
  },
];

const Stores = () => {
  const stores = useTypedSelector((state) => state.stores.data);
  const user = useTypedSelector((state) => state.auth.data);

  const dispatch = useTypedDispatch();

  const {
    onRow,
    showModal,
    isModalVisible,
    setIsModalVisible,
  } = useStoresTable();

  /**
   * @description data for the table in right format
   */
  const storesTable = stores
    ?.map((el) => {
      return {
        ...el,
        user: el?.user?.email,
      };
    })
    .reverse();

  useEffect(() => {
    if (user.role === UserRole.Admin) {
      dispatch(getStores());
    }
    if (user.role === UserRole.Customer) {
      dispatch(getUserStores(user.id));
    }
  }, [user.role]);

  return (
    <>
      <AddStoreModal isModalVisible={isModalVisible} setParentModalVisible={setIsModalVisible} />
      {user.role !== UserRole.Admin ? (
        <Button
          onClick={showModal}
          type='primary'
          style={{ margin: '0 0 20px 0' }}
          htmlType='submit'
          className='login-form-button'
        >
          Add Store
        </Button>
      ) : null}
      <Table
        columns={columns}
        scroll={{ x: 0 }}
        onRow={onRow}
        dataSource={storesTable?.map((store) => ({ ...store, availableCurrencies: store.wallets.map((wallet) => wallet.currency).join(', ') })) || []}
      />
    </>
  );
};

export default wrapper.withRedux(Stores);
