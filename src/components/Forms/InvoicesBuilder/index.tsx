// @ts-nocheck
import React, {useEffect, useState} from 'react';
import {Form, Input, Modal, Button, Select, Table, message} from "antd";
import {addPayment} from "../../../../store/actions/payment";
import {getPayments, getUserPayments} from "../../../../store/actions/payments";
import {useDispatch, useSelector} from "react-redux";
import WithLoadingData from "../../../../hoc/withLoadingData";
import {getUserStores} from "../../../../store/actions/stores";
const { Option } = Select;

const initialState = {
    amount: '',
    comment: ''
};

const InvoicesBuilder = () => {
    const [payment, setPayment] = useState(initialState);
    const [currentStore, setCurrentStore] = useState(null);

    const user = useSelector((state) => state.auth.data);
    const stores = useSelector((state) => state.storesData.data);
    const storesLoaded = useSelector((state) => state.storesData.isChanged);
    const paymentsLoaded = useSelector((state) => state.payments.isChanged);

    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const activeStores = stores.filter((store) => store.apiKey && !store.blocked);

    useEffect(() => {
        if (user?.role === 'admin') {
            dispatch(getPayments())
        }
        if (user?.role === 'customer') {
            dispatch(getUserStores(user.id))
        }
    }, []);

    useEffect(() => {
        if (stores.length && user.role !== 'admin' && activeStores[0]?.apiKey) {
            dispatch(getUserPayments(activeStores[0]?.apiKey))
        }
    }, [stores.length]);

    const validateAmount = (rule: any, value: any, callback: any) => {
        if (value < 2.5) {
            callback("Must be at least 2.5 cspr");
        } else {
            callback();
        }
    };

    const onChangePayment = (field: string) => (e: any) => {
        let value = e.target.value;
        if (field === "amount") value = value * 1000000000;
        setPayment({
            ...payment,
            [field]: value,
        })
    };

    const handleOk = async () => {
        await form.validateFields()
            .then(async (res) => {
                try {
                    await dispatch(addPayment(payment, currentStore.apiKey))
                    if (user?.role === 'admin') {
                        dispatch(getPayments())
                    }
                    if (user?.role === 'customer') {
                        dispatch(getUserPayments(currentStore.apiKey))
                    }
                    setPayment(initialState);
                    message.success('Payment was added');
                    form.resetFields();
                } catch (e) {
                    console.log(e, 'registration error')
                }
            })
            .catch(async (err) => console.log(err))
    };

    function handleChange(value) {
        const current = stores.filter((store) => store.apiKey === value)[0];
        setCurrentStore(current);
        dispatch(getUserPayments(value));
    }

    return (
        <WithLoadingData data={(user.role === 'admin' ? paymentsLoaded : storesLoaded)}>
            { !activeStores.length && user.role !== 'admin' ?
                <p>
                    Create a store to be able to create payments
                </p>
                :
                null
            }
            {user.role !== 'admin' && activeStores.length ?
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
                            rules={[{ required: true, message: 'Please input amount!' }, { validator: validateAmount }]}
                        >
                            <Input type='number' onChange={onChangePayment('amount')}/>
                        </Form.Item>
                        <Form.Item
                            label="Comment"
                            name="comment"
                        >
                            <Input.TextArea autoSize onChange={onChangePayment('comment')}/>
                        </Form.Item>

                            <Form.Item
                                label="Store"
                                name="store"
                                rules={[{ required: true, message: 'Please select store!' }]}
                            >
                                <Select defaultValue="choose store..." style={{ width: 150, marginBottom: 20 }} onChange={handleChange}>
                                    {
                                        activeStores.map((store) => <Option key={store.id} value={store.apiKey}>{store.name}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                        <Form.Item wrapperCol={{ offset: 11, span: 12 }}>
                            <Button type="primary" htmlType="submit" onClick={handleOk}>Add payment</Button>
                        </Form.Item>
                    </Form>
                </>
                : null
            }
        </WithLoadingData>
    );
};

export default InvoicesBuilder;
