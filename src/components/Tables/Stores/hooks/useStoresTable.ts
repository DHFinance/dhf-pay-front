import { Form } from 'antd';
import { CLPublicKey } from 'casper-js-sdk';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTypedDispatch } from '../../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { AddStore } from '../../../../interfaces/addStore.interface';
import { Store } from '../../../../interfaces/store.interface';
import { UserRole } from '../../../../modules/user/enums/userRole.enum';
import { addStore } from '../../../../store/slices/store/asynkThunks/addStore';
import { getStores } from '../../../../store/slices/stores/asyncThunks/getStores';
import { getUserStores } from '../../../../store/slices/stores/asyncThunks/getUserStores';

function useStoresTable() {
  const user = useTypedSelector((state) => state.auth.data);

  const [store, setStore] = useState<Store | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useTypedDispatch();

  /**
   * @description wallet validation. Occurs with the help of the CLPublicKey.fromHex function, which returns an error if the wallet is not valid
   * @param {object} rule - object field wallet
   * @param {any} value - value wallet
   * @param {function} callback - executed after successful validation of the wallet field
   */
  const validateWallet = (rule: any, value: any, callback: any) => {
    /** @description if value isn't empty, then verify wallet */
    if (value) {
      try {
        CLPublicKey.fromHex(value);
        callback();
      } catch (e) {
        callback('This wallet not exist!');
      }
    } else {
      callback();
    }
  };

  /**
   * @description handling every row,applying styles and a click event handler to it
   * @param {object} record - element of array entity
   */
  const onRow = (record: any) => {
    return {
      style: { cursor: 'pointer' },
      onClick: () => router.push(`stores/${record.id}`),
    };
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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

    setStore({
      ...(store as Store),
      apiKey: randomString(36),
    });
  };

  const deleteKey = () => {
    setStore({
      ...(store as Store),
      apiKey: '',
    });
  };

  /**
   * @description set data into store object
   * @param {string} field - field name
   */
  const onChangeStore = (field: string) => (e: any) => {
    const value = e.target.value;
    setStore({
      ...(store as Store),
      [field]: value,
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  /**
   * @description add new the store
   */
  const handleOk = async () => {
    /** @description validations of fields form */
    try {
      await form.validateFields();
      try {
        await dispatch(
          addStore({
            ...store,
            user,
          } as unknown as AddStore),
        );
        if (user.role === UserRole.Admin) {
          dispatch(getStores());
        }
        if (user.role === UserRole.Customer) {
          dispatch(getUserStores(user.id));
        }
        setStore(null);
        form.resetFields();
        setIsModalVisible(false);
      } catch (e) {
        console.log(e, 'store creating error');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleCancel,
    handleOk,
    onRow,
    deleteKey,
    generateKey,
    isModalVisible,
    store,
    validateWallet,
    showModal,
    onChangeStore,
    form,
  };
}

export { useStoresTable };
