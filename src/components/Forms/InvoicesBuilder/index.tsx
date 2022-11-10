import { Button, Form, Input, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { CreatePayment } from '../../../interfaces/createPayment.interface';
import { Store } from '../../../interfaces/store.interface';
import { CSPRtoUsd } from '../../../../utils/CSPRtoUSD';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { UserRole } from '../../../modules/user/enums/userRole.enum';
import { getCourse } from '../../../store/slices/course/asyncThunks/getCourse';
import { addPayment } from '../../../store/slices/payment/asyncThunks/addPayment';
import { getPayments } from '../../../store/slices/payments/asyncThunks/getPayments';
import { getUserPayments } from '../../../store/slices/payments/asyncThunks/getUserPayments';
import { getUserStores } from '../../../store/slices/stores/asyncThunks/getUserStores';
import { Loader } from '../../Loader';
const { Option } = Select;

const createPaymentInitialState: CreatePayment = {
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

  const [form] = Form.useForm();
  const dispatch = useTypedDispatch();

  const activeStores = stores?.filter((store) => store.apiKey && !store.blocked) || [];

  useEffect(() => {
    if (user?.role === UserRole.Admin) {
      dispatch(getPayments());
    }
    if (user?.role === UserRole.Customer) {
      dispatch(getUserStores(user.id));
    }
    dispatch(getCourse());
  }, []);

  useEffect(() => {
    if (stores?.length && user.role !== UserRole.Admin && activeStores[0]?.apiKey) {
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
      try {
        await dispatch(addPayment({ data: payment, apiKey: currentStore!.apiKey }));
        if (user?.role === UserRole.Admin) {
          dispatch(getPayments());
        }
        if (user?.role === UserRole.Customer) {
          dispatch(getUserPayments(currentStore!.apiKey));
        }
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

  /**
   * @description set current store and get payments of a selected store
   */
  function handleChange(value: string) {
    const current = stores!.filter((store) => store.apiKey === value)[0];
    setCurrentStore(current);
    dispatch(getUserPayments(value));
    validate('store');
  }
  
  if (courseStatus.error || storesStatus.error) {
    return <p>Error</p>;
  }
  
  if (stores === null || storesStatus.isLoading) {
    return <Loader />;
  }

  if (course === null || courseStatus.isLoading) {
    return <Loader />;
  }

  return (
    <>
      {!activeStores.length && user.role !== UserRole.Admin ? (
        <p>Create a store to be able to create payments</p>
      ) : null}
      {user.role !== UserRole.Admin && activeStores.length ? (
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
            <Form.Item label="Amount USD">
              {CSPRtoUsd(+payment.amount, course)}$
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
      ) : null}
    </>
  );
};

export default InvoicesBuilder;
