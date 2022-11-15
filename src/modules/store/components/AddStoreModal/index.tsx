import { Button, Form, Input, Modal, Select, Space } from 'antd';
import React, { FC, useEffect } from 'react';
import { useStoresTable } from '../../../../components/Tables/Stores/hooks/useStoresTable';
import styles from '../../../../components/Tables/Stores/stores.module.css';

interface Props {
  isModalVisible: boolean;
  setParentModalVisible: any;
}

const AddStoreModal: FC<Props> = ({ isModalVisible: visible, setParentModalVisible }) => {
  const {
    form,
    store,
    deleteKey,
    generateKey,
    onChangeStore,
    wallets,
    addWallet,
    removeWallet,
    changeWalletValue,
    changeCurrency,
    availableCurrencies,
    currentWallet,
    isModalVisible,
    handleOk,
    handleCancel,
    setIsModalVisible,
  } = useStoresTable();
  
  useEffect(() => {
    setIsModalVisible(visible);
  }, [visible]);
  
  useEffect(() => {
    setParentModalVisible(isModalVisible);
  }, [isModalVisible]);
  
  return (
    <Modal
      title="Add store"
      open={isModalVisible}
      onCancel={handleCancel}
      onOk={form.submit}
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        validateTrigger={'onSubmit'}
        form={form}
        onFinish={handleOk}
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
        <div className={styles.wallets}>
          {wallets.map((wallet) => (
            <div className={styles.wallet} key={wallet.id}>
              <p className={styles.value}>{wallet.value}</p>
              <p className={styles.currency}>{wallet.currency}</p>
              <Button
                style={{ width: 90 }}
                type="primary"
                danger
                onClick={() => removeWallet(wallet.id as string)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
        <Form.Item
          label="Wallets"
          name="wallets"
        >
          <Space.Compact block>
            <Input onChange={changeWalletValue} />
            <Select
              options={availableCurrencies.map((currency) => ({
                value: currency,
                label: currency,
              }))}
              onChange={changeCurrency}
              value={currentWallet.currency}
            />
            {availableCurrencies.length > 0 ? (
              <Button style={{ width: 90 }} type="primary" onClick={addWallet}>
                Add wallet
              </Button>
            ) : null}
          </Space.Compact>
        </Form.Item>
        <Form.Item label="ApiKey" name="apiKey">
          <Input.Group compact>
            <Input
              style={{ width: 'calc(100% - 90px)' }}
              value={store?.apiKey}
              disabled
            />
            <Button
              style={{ width: 90 }}
              type="primary"
              danger
              onClick={store?.apiKey ? deleteKey : generateKey}
            >
              {store?.apiKey ? 'Delete' : 'Generate'}
            </Button>
          </Input.Group>
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea onChange={onChangeStore('description')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export { AddStoreModal };
