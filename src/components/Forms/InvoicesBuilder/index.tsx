import { Button, Form, Input, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { CurrencyType } from '../../../enums/currency.enum';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Store } from '../../../interfaces/store.interface';
import { CurrencyFabric } from '../../../modules/curriencies/currencyFabric';
import { addPayment } from '../../../store/slices/payment/asyncThunks/addPayment';
import { getUserPayments } from '../../../store/slices/payments/asyncThunks/getUserPayments';
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

  useEffect(() => {
    if (stores?.length && activeStores[0]?.apiKey) {
      dispatch(getUserPayments(activeStores[0]?.apiKey));
    }
  }, [stores?.length]);

  const validate = async (nameField: string) => {
    await form.validateFields([nameField]);
  };

  const validateAmount = (rule: any, value: any, callback: any) => {
    if (value < 2.5) {
      callback('Must be at least 2.5 cspr');
    } else {
      callback();
    }
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
      if (!(form.getFieldValue('currency') in Object.values(CurrencyType))) {
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
        dispatch(getUserPayments(currentStore!.apiKey));
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
    const currency = CurrencyFabric.create(event);
    currency.getCourse();
    form.setFields([
      { name: 'currency', errors: [] },
    ]);
  }

  /**
   * @description set current store and get payments of a selected store
   */
  function handleChange(value: string) {
    const current = stores!.filter((store) => store.apiKey === value)[0];
    setCurrentStore(current);
    dispatch(getUserPayments(value));
    validate('store');
    setAvailableCurrencies(
      Object.values(CurrencyType).filter((el) =>
        current.wallets.find((wallet) => wallet.currency === el),
      ),
    );
  }

  useEffect(() => {
    form.setFieldValue(
      'currency',
      availableCurrencies[0] ?? 'No available currencies',
    );
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
              {courseStatus.isLoading
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
