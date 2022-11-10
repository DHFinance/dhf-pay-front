import { Button, Form, Input, Modal, Table } from 'antd';
import 'antd/dist/antd.css';
import React, { useEffect } from 'react';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
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
    title: 'Wallet',
    key: 'wallet',
    dataIndex: 'wallet',
    cursor: 'pointer',
  },
];

const Stores = () => {
  const stores = useTypedSelector((state) => state.stores.data);
  const user = useTypedSelector((state) => state.auth.data);

  const dispatch = useTypedDispatch();

  const {
    form,
    isModalVisible,
    store,
    onRow,
    handleCancel,
    handleOk,
    deleteKey,
    generateKey,
    onChangeStore,
    showModal,
    validateWallet,
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
      <Modal
        title="Add store"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          validateTrigger={'onSubmit'}
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input store name!' }]}
          >
            <Input onChange={onChangeStore('name')} />
          </Form.Item>
          <Form.Item
            label="Callback url"
            name="url"
            rules={[{ required: true, message: 'Please input callback url!' }]}
          >
            <Input onChange={onChangeStore('url')} />
          </Form.Item>
          <Form.Item
            label="Wallet"
            name="wallet"
            rules={[
              { required: true, message: 'Please input wallet!' },
              { validator: validateWallet },
            ]}
          >
            <Input onChange={onChangeStore('wallet')} />
          </Form.Item>
          <Form.Item label="ApiKey" name="apiKey">
            <Input.Group compact>
              <Input
                style={{ width: 'calc(100% - 90px)' }}
                value={store?.apiKey}
                disabled
                onChange={onChangeStore('apiKey')}
              />
              {store?.apiKey ? (
                <Button
                  style={{ width: 90 }}
                  type="primary"
                  danger
                  onClick={deleteKey}
                >
                  Delete
                </Button>
              ) : (
                <Button
                  style={{ width: 90 }}
                  type="primary"
                  onClick={generateKey}
                >
                  Generate
                </Button>
              )}
            </Input.Group>
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea onChange={onChangeStore('description')} />
          </Form.Item>
        </Form>
      </Modal>
      {user.role !== UserRole.Admin ? (
        <Button
          onClick={showModal}
          type="primary"
          style={{ margin: '0 0 20px 0' }}
          htmlType="submit"
          className="login-form-button"
        >
          Add Store
        </Button>
      ) : null}
      <Table
        columns={columns}
        scroll={{ x: 0 }}
        onRow={onRow}
        dataSource={storesTable}
      />
    </>
  );
};

export default wrapper.withRedux(Stores);
