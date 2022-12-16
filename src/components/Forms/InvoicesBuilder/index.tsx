import { Button, Form, Input, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { CurrencyType } from '../../../enums/currency.enum';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Store } from '../../../interfaces/store.interface';
import { CurrencyFabric } from '../../../modules/curriencies/currencyFabric';
import { clearCourse } from '../../../store/slices/course/course.slice';
import { addPayment } from '../../../store/slices/payment/asyncThunks/addPayment';
import { getUserStores } from '../../../store/slices/stores/asyncThunks/getUserStores';
import { Loader } from '../../Loader';

const { Option } = Select;

const createPaymentInitialState = {
  amount: '',
  comment: '',
};

const InvoicesBuilder = () => {
  const user = useTypedSelector((state) => state.auth.data);
  const stores = useTypedSelector((state) => state.stores.data);
  const storesStatus = useTypedSelector((state) => state.stores.status);
  const course = useTypedSelector((state) => state.course.data.usd);
  const courseStatus = useTypedSelector((state) => state.course.status);

  const [payment, setPayment] = useState(createPaymentInitialState);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [availableCurrencies, setAvailableCurrencies] = useState<
  CurrencyType[]
  >([]);

  const [form] = Form.useForm();
  const dispatch = useTypedDispatch();

  const activeStores =
    stores?.filter((store) => store.apiKey && !store.blocked) || [];

  useEffect(() => {
    dispatch(getUserStores(user.id));
  }, []);

  const validate = async (nameField: string) => {
    await form.validateFields([nameField]);
  };

  const validateAmount = (rule: any, value: any, callback: any) => {
    if (!course || !form.getFieldValue('currency')) {
      callback();
    }
    
    if (form.getFieldValue('currency') === CurrencyType.Casper) {
      if (value < 2.5) {
        return callback('Must be at least 2.5');
      }
      return callback();
    }
    
    if (course! * value < 0.1) {
      return callback('Must be at least 0.1$');
    }

    callback();
  };

  /**
   * @description set values to the payment object
   */
  const onChangePayment = (field: string) => (e: any) => {
    let value = e.target.value;
    setPayment({
      ...payment,
      [field]: value,
    });
    validate('amount');
  };

  /**
   * @description save the payment and return the response
   */
  async function handleOk() {
    try {
      await form.validateFields();
      if (
        !Object.values(CurrencyType).includes(form.getFieldValue('currency'))
      ) {
        form.setFields([
          { name: 'currency', errors: ['Please select currency!'] },
        ]);
        return;
      }
      try {
        await dispatch(
          addPayment({
            data: { ...payment, currency: form.getFieldValue('currency') },
            apiKey: currentStore!.apiKey,
          }),
        );
        setPayment(createPaymentInitialState);
        message.success('Payment was added');
        form.resetFields();
      } catch (e) {
        console.log(e, 'registration error');
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleChangeCurrency(event: CurrencyType) {
    dispatch(clearCourse());
    const currency = CurrencyFabric.create(event);
    currency.getCourse();
    form.setFields([{ name: 'currency', errors: [] }]);
    form.setFields([{ name: 'amount', errors: [] }]);
  }

  /**
   * @description set current store and get payments of a selected store
   */
  function handleChange(value: string) {
    const current = stores!.filter((store) => store.apiKey === value)[0];
    setCurrentStore(current);
    validate('store');
    setAvailableCurrencies(
      Object.values(CurrencyType).filter((el) =>
        current.wallets.find((wallet) => wallet.currency === el),
      ),
    );
  }

  useEffect(() => {
    dispatch(clearCourse());
    form.setFieldValue(
      'currency',
      availableCurrencies[0] ?? 'No available currencies',
    );
    if (availableCurrencies[0]) {
      handleChangeCurrency(availableCurrencies[0]);
      const newCurrency = CurrencyFabric.create(availableCurrencies[0]);
      newCurrency.getCourse();
    }
  }, [availableCurrencies]);

  if (storesStatus.error) {
    return <p>Error</p>;
  }

  if (stores === null || storesStatus.isLoading) {
    return <Loader />;
  }

  // @ts-ignore
  return (
    <>
      {activeStores.length === 0 ? (
        <p>Create a store to be able to create payments</p>
      ) : (
        <>
          <Form
            style={{ padding: '0 50px', marginTop: 64 }}
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            validateTrigger={'onSubmit'}
            form={form}
          >
            <Form.Item
              label="Amount"
              name="amount"
              rules={[
                { required: true, message: 'Please input amount!' },
                { validator: validateAmount },
              ]}
            >
              <Input type="number" onChange={onChangePayment('amount')} />
            </Form.Item>
            <Form.Item label="Currency" name="currency">
              <Select
                options={availableCurrencies.map((currency) => ({
                  value: currency,
                  label: currency,
                  key: currency,
                }))}
                onChange={handleChangeCurrency}
                style={{ width: '170px' }}
                defaultValue={'Please select store' as CurrencyType}
              />
            </Form.Item>
            <Form.Item label="Amount USD">
              {!currentStore
                ? 'Please select store'
                : courseStatus.isLoading
                  ? 'Loading'
                  : courseStatus.error
                    ? 'Error'
                    : (course! * +payment.amount).toFixed(2)}
            </Form.Item>
            <Form.Item label="Comment" name="comment">
              <Input.TextArea autoSize onChange={onChangePayment('comment')} />
            </Form.Item>
            <Form.Item
              label="Store"
              name="store"
              rules={[{ required: true, message: 'Please select store!' }]}
            >
              <Select
                defaultValue="choose store..."
                style={{ width: 150, marginBottom: 20 }}
                onChange={handleChange}
              >
                {activeStores.map((store) => (
                  <Option key={store.id} value={store.apiKey}>
                    {store.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 11, span: 12 }}>
              <Button type="primary" htmlType="submit" onClick={handleOk}>
                Add payment
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </>
  );
};

export default InvoicesBuilder;
