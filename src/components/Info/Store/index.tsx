import {
  AreaChartOutlined,
  ClockCircleOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Statistic,
} from 'antd';
import Title from 'antd/lib/typography/Title';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CurrencyType } from '../../../enums/currency.enum';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Store as IStore } from '../../../interfaces/store.interface';
import { CurrencyFabric } from '../../../modules/curriencies/currencyFabric';
import { UserRole } from '../../../modules/user/enums/userRole.enum';
import { blockStore } from '../../../store/slices/store/asynkThunks/blockStore';
import { editStore } from '../../../store/slices/store/asynkThunks/editStore';
import { getStore } from '../../../store/slices/store/asynkThunks/getStore';
import { unblockStore } from '../../../store/slices/store/asynkThunks/unblockStore';
import { getUserStores } from '../../../store/slices/stores/asyncThunks/getUserStores';
import styles from '../../Tables/Stores/stores.module.css';

interface StoreWallet {
  currency: CurrencyType;
  value: string;
  id?: string;
}

const currenciesToString = Object.values(CurrencyType);

const Store = () => {
  const store = useTypedSelector((state) => state.store.data);
  useTypedSelector((state) => state.store.status.error);
  const isStoreLoading = useTypedSelector(
    (state) => state.store.status.isLoading,
  );
  const user = useTypedSelector((state) => state.auth.data);

  const [edit, setEdit] = useState(false);
  const [storeEdit, setStoreEdit] = useState(store);
  const [wallets, setWallets] = useState<StoreWallet[]>([]);
  const [currentWallet, setCurrentWallet] = useState<StoreWallet>({
    currency: currenciesToString[0],
    value: '',
  });
  const [availableCurrencies, setAvailableCurrencies] =
    useState(currenciesToString);

  const dispatch = useTypedDispatch();
  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
    if (store) {
      setWallets(store.wallets);
    }
  }, [store]);

  /**
   * @description generating store key
   */
  const generateKey = () => {
    function randomString(len: number) {
      const charSet =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let randomStr = '';
      for (let i = 0; i < len; i++) {
        const randomPoz = Math.floor(Math.random() * charSet.length);
        randomStr += charSet.substring(randomPoz, randomPoz + 1);
      }
      return randomStr;
    }

    setStoreEdit({
      ...(storeEdit as IStore),
      apiKey: randomString(36),
    });
  };

  const deleteKey = () => {
    setStoreEdit({
      ...(storeEdit as IStore),
      apiKey: '',
    });
  };

  /**
   * @description set data into store object
   * @param {string} field - field name
   */
  const onChangeStore = (field: string) => (e: any) => {
    const value = e.target.value;
    setStoreEdit({
      ...(storeEdit as IStore),
      [field]: value,
    });
  };

  /**
   * @description load data
   */
  useEffect(() => {
    /** @description if is query id, then get store by id */
    if (router.query.slug) {
      dispatch(getStore(router.query.slug as string));
    }
  }, []);

  useEffect(() => {
    setStoreEdit(store);
  }, [store]);

  const { id, description, name, url, apiKey, blocked } = store ?? {};

  const onEdit = () => {
    setEdit(true);
  };

  /**
   * @description get store
   */
  const handleOk = async () => {
    if (wallets.length === 0) {
      form.setFields([
        { name: 'wallets', errors: ['Please add at least 1 wallet!'] },
      ]);
      return;
    }

    try {
      await form.validateFields();
      try {
        await dispatch(
          editStore({
            id: router.query.slug as string,
            data: {
              ...storeEdit,
              wallets: wallets.map((wallet) => ({
                value: wallet.value,
                currency: wallet.currency,
              })),
            },
          }),
        );
        form.resetFields();
        setEdit(false);
        await dispatch(getStore(router.query.slug as string));
        await dispatch(getUserStores(+(router.query.slug as string)));
      } catch (e) {
        console.log(e);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setEdit(false);
  };

  const unblockStoreButton = () => {
    dispatch(unblockStore(id as number));
  };

  const blockStoreButton = () => {
    dispatch(blockStore(id as number));
  };

  useEffect(() => {
    setStoreEdit(store);
  }, [store]);

  function addWallet() {
    const newCurrency = CurrencyFabric.create(currentWallet.currency);
    const isValid = newCurrency.validateWallet(currentWallet.value);
    if (!isValid) {
      form.setFields([{ name: 'wallets', errors: ['Wallet is not valid!'] }]);
      return;
    }
    setWallets((prev) => [...prev, { ...currentWallet, id: uuidv4() }]);
    const filteredCurrency = availableCurrencies.filter(
      (currency) => currency !== currentWallet.currency,
    );
    setAvailableCurrencies(filteredCurrency);
    setCurrentWallet((prev) => ({ ...prev, currency: filteredCurrency[0] }));
  }

  function removeWallet(walletId: string) {
    const walletToDelete = wallets.find((wallet) => wallet.id === walletId);
    setAvailableCurrencies((prev) => [...prev, walletToDelete!.currency]);
    const filteredWallets = wallets.filter((wallet) => wallet.id !== walletId);
    setWallets(filteredWallets);
  }

  function changeWalletValue(event: ChangeEvent<HTMLInputElement>) {
    setCurrentWallet((prev) => ({ ...prev, value: event.target.value }));
    form.setFields([{ name: 'wallets', errors: [] }]);
  }

  function changeCurrency(event: CurrencyType) {
    form.setFields([{ name: 'wallets', errors: [] }]);
    setCurrentWallet((prev) => ({ ...prev, currency: event }));
  }

  if (isStoreLoading || store === null || storeEdit === null) {
    return (
      <Spin
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      />
    );
  }

  return (
    <>
      <Modal
        title="Edit store"
        visible={edit}
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
            initialValue={storeEdit!.name}
            rules={[{ required: true, message: 'Please input wallet!' }]}
          >
            <Input value={storeEdit!.name} onChange={onChangeStore('name')} />
          </Form.Item>
          <Form.Item
            label="Callback url"
            name="url"
            initialValue={storeEdit!.url}
            rules={[{ required: true, message: 'Please input wallet!' }]}
          >
            <Input value={storeEdit!.url} onChange={onChangeStore('url')} />
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
          <Form.Item label="Wallets" name="wallets">
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
                <Button
                  style={{ width: 90 }}
                  type="primary"
                  onClick={addWallet}
                >
                  Add wallet
                </Button>
              ) : null}
            </Space.Compact>
          </Form.Item>
          <Form.Item label="ApiKey" name="apiKey">
            <Input.Group compact>
              <Input
                style={{ width: 'calc(100% - 90px)' }}
                value={storeEdit!.apiKey}
                disabled
                onChange={onChangeStore('apiKey')}
              />
              {storeEdit!.apiKey ? (
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
          <Form.Item
            label="Description"
            name="description"
            initialValue={storeEdit!.description}
          >
            <Input.TextArea
              value={storeEdit!.description}
              onChange={onChangeStore('description')}
            />
          </Form.Item>
        </Form>
      </Modal>
      {blocked ? (
        <Title style={{ width: '100%', textAlign: 'center', color: 'red' }}>
          Blocked
        </Title>
      ) : null}
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic title="name" value={name} prefix={<ClockCircleOutlined />} />
      </Col>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic title="url" value={url} prefix={<AreaChartOutlined />} />
      </Col>
      <Col
        span={24}
        style={{ padding: '20px 0 0px 20px', background: 'white' }}
      >
        <Statistic
          title="api key"
          value={apiKey || 'None (generate an api key to perform actions)'}
          prefix={<CommentOutlined />}
        />
      </Col>
      <Col
        span={24}
        style={{ padding: '20px 0 20px 20px', background: 'white' }}
      >
        <Statistic
          title="description"
          value={description || 'none'}
          prefix={<CommentOutlined />}
        />
      </Col>
      {user?.id === store?.user?.id ? (
        <Button
          type="primary"
          onClick={onEdit}
          style={{ margin: '20px 20px 0 0' }}
          className="login-form-button"
        >
          Edit
        </Button>
      ) : null}
      {user?.role === UserRole.Admin && (
        <>
          {blocked ? (
            <Button
              type="primary"
              onClick={unblockStoreButton}
              style={{ margin: '20px 20px 0 0' }}
              className="login-form-button"
            >
              Unblock
            </Button>
          ) : (
            <Button
              danger
              type="primary"
              onClick={blockStoreButton}
              style={{ margin: '20px 20px 0 0' }}
              className="login-form-button"
            >
              Block
            </Button>
          )}
        </>
      )}
      <Button
        onClick={() => router.back()}
        style={{ margin: '20px 0 0 0' }}
        type="primary"
      >
        Back
      </Button>
    </>
  );
};

export default Store;
