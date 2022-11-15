import { CheckOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { buttons } from '../../../data/buttonsBuilder';
import { CurrencyType } from '../../../enums/currency.enum';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Store } from '../../../interfaces/store.interface';
import { CurrencyFabric } from '../../../modules/curriencies/currencyFabric';
import { UserRole } from '../../../modules/user/enums/userRole.enum';
import { addPayment } from '../../../store/slices/payment/asyncThunks/addPayment';
import { getPayments } from '../../../store/slices/payments/asyncThunks/getPayments';
import { getUserPayments } from '../../../store/slices/payments/asyncThunks/getUserPayments';
import { getUserStores } from '../../../store/slices/stores/asyncThunks/getUserStores';
import { Loader } from '../../Loader';

const { Option } = Select;

const initialState = {
  amount: '',
  comment: '',
  type: null,
  text: '',
};

const Buttons = () => {
  const user = useTypedSelector((state) => state.auth.data);
  const stores = useTypedSelector((state) => state.stores.data);
  const storesStatus = useTypedSelector((state) => state.stores.status);
  const currentPayment = useTypedSelector((state) => state.payment.data);
  const course = useTypedSelector((state) => state.course.data.usd);
  const courseStatus = useTypedSelector((state) => state.course.status);

  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [chosenButton, setChosenButton] = useState(0);
  const [htmlCode, setHtmlCode] = useState('');
  const [visibleHtmlCode, setVisibleHtmlCode] = useState(false);
  const [paymentId, setPaymentId] = useState(false);
  const [payment, setPayment] = useState(initialState);
  const [availableCurrencies, setAvailableCurrencies] = useState<
  CurrencyType[]
  >([]);

  const dispatch = useTypedDispatch();

  useEffect(() => {
    if (user?.role === UserRole.Customer) {
      dispatch(getUserStores(user.id));
    }
  }, []);

  /** @description name of current domain */
  const domain = location.host;

  const [form] = Form.useForm();
  const activeStores =
    stores?.filter((store) => store.apiKey && !store.blocked) || [];

  const validate = async (nameField: string) => {
    await form.validateFields([nameField]);
  };

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

  /**
   * @description copying html code of button payment
   */
  const copyTextToClipboard = () => {
    const context = document.getElementById('textArea') as HTMLTextAreaElement;
    context.select();
    document.execCommand('copy');
    message.success('HTML-code copied');
  };

  const validateAmount = (rule: any, value: any, callback: any) => {
    if (value < 2.5) {
      callback('Must be at least 2.5 cspr');
    } else {
      callback();
    }
  };

  const validateName = (rule: any, value: any, callback: any) => {
    if (value.trim().length !== 0) {
      callback();
    }
    callback('Name cant be empty');
  };

  const validateKind = (rule: any, value: any, callback: any) => {
    if (chosenButton === 0) {
      callback('Please select a button style');
    } else {
      callback();
    }
  };

  /** @description generating html code of button payment */
  const handleGenerateHTML = () => {
    const buttonHTML = document.getElementById(
      'resultButton',
    ) as HTMLButtonElement;
    setHtmlCode(buttonHTML.outerHTML);
  };

  /**
   * @description save the payment and return the response
   */
  const handleOk = async () => {
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
        if (user?.role === UserRole.Admin) {
          await dispatch(getPayments());
        }
        if (user?.role === UserRole.Customer) {
          await dispatch(getUserPayments(currentStore!.apiKey));
        }
        setPaymentId(true);
        message.success('Payment was added');
        /** @description generating and showing html code of button payment */
        handleGenerateHTML();
        setVisibleHtmlCode(true);
      } catch (e) {
        console.log(e, 'registration error');
      }
    } catch (error) {
      console.log(error);
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
    validate(field);
  };

  /**
   * @description selecting of style button
   */
  const handleChooseButton = (itemButton: any) => {
    setChosenButton(itemButton.id);
    setPayment({
      ...payment,
      type: itemButton.id,
    });
    form.setFieldsValue({ kind: itemButton.id });
  };

  function handleChangeCurrency(event: CurrencyType) {
    const currency = CurrencyFabric.create(event);
    currency.getCourse();
    form.setFields([
      { name: 'currency', errors: [] },
    ]);
  }

  const handleResetForm = (event: any) => {
    event.preventDefault();
    form.resetFields();
    setPaymentId(false);
    setVisibleHtmlCode(false);
    setChosenButton(0);
  };

  useEffect(() => {
    form.setFieldValue(
      'currency',
      availableCurrencies[0] ?? 'No available currencies',
    );
  }, [availableCurrencies]);

  if (storesStatus.error) {
    return <p>Error</p>;
  }

  if (storesStatus.isLoading || stores === null) {
    return <Loader />;
  }

  return (
    <>
      {!activeStores.length && user.role !== UserRole.Admin && (
        <p>Create a store to be able to create payments</p>
      )}
      {user.role !== UserRole.Admin && !!activeStores.length && (
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          validateTrigger={'onSubmit'}
          form={form}
          className="payment-buttons"
          style={{ padding: '0 50px', marginTop: 64 }}
        >
          <Form.Item
            label="Name"
            name="text"
            rules={[
              { required: true, message: 'Please input button name!' },
              { validator: validateName },
            ]}
          >
            <Input type="text" onChange={onChangePayment('text')} />
          </Form.Item>
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
              options={Object.values(CurrencyType).map((currency) => ({
                value: currency,
                label: currency,
                key: currency,
              }))}
              onChange={handleChangeCurrency}
              style={{ width: '100px' }}
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
          {!!activeStores.length && (
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
          )}
          <Form.Item label="Comment" name="comment">
            <Input.TextArea autoSize onChange={onChangePayment('comment')} />
          </Form.Item>
          <Form.Item
            label="Button type"
            name="kind"
            rules={[{ validator: validateKind }]}
          >
            <div className="kind" style={{ display: 'flex', gap: '30px' }}>
              {buttons.map((item) => (
                <div
                  key={item.id}
                  className="kind-div"
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <Button
                    type="primary"
                    style={
                      chosenButton === item.id
                        ? {
                          ...item.style,
                          border: '2px #52c41a solid',
                        }
                        : { ...item.style }
                    }
                    onClick={() => handleChooseButton(item)}
                    className="login-form-button"
                  >
                    {item.name}
                  </Button>
                  <CheckOutlined
                    style={{
                      margin: '0 0 20px 0',
                      color: '#52C41A',
                      fontWeight: '900',
                      display: `${chosenButton === item.id ? 'block' : 'none'}`,
                    }}
                  />
                </div>
              ))}
            </div>
          </Form.Item>
          {paymentId ? (
            <Form.Item label="Result" name="description">
              <a
                rel="noreferrer"
                href={`http://${domain}/bill/${currentPayment?.id}`}
                id="resultButton"
                target="_blank"
                style={
                  payment.type
                    ? {
                      ...buttons[chosenButton - 1].style,
                      appearance: 'button',
                      textDecoration: 'none',
                      color: 'white',
                      padding: '5px 15px',
                    }
                    : undefined
                }
              >
                {payment.text}
              </a>
            </Form.Item>
          ) : null}

          <Form.Item
            label="HTML"
            name="htmlCode"
            style={{
              display: `${visibleHtmlCode ? '' : 'none'}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Input.TextArea
                id="textArea"
                value={htmlCode}
                readOnly
                autoSize
                style={{
                  marginBottom: '20px',
                  resize: 'none',
                  cursor: 'not-allowed',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Button type="primary" onClick={copyTextToClipboard}>
                  Copy html
                </Button>
              </div>
            </div>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 11, span: 12 }}>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {paymentId ? (
                <Button
                  type="primary"
                  style={{ padding: '5px 20px' }}
                  htmlType="button"
                  className="login-form-button"
                  onClick={(e) => handleResetForm(e)}
                >
                  Reset
                </Button>
              ) : (
                <Button
                  type="primary"
                  style={{ padding: '5px 20px' }}
                  htmlType="submit"
                  className="login-form-button"
                  onClick={handleOk}
                >
                  Save
                </Button>
              )}
            </div>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default Buttons;
