// @ts-nocheck
import React, {useEffect, useState} from "react";
import {Table, Tag, Space, Button, Modal, Form, Input, Checkbox, Select} from 'antd';
import "antd/dist/antd.css";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {addPayment} from "../../../../store/actions/payment";
import {wrapper} from "../../../../store/store";
import {getPayments, getUserPayments} from "../../../../store/actions/payments";
import {CLPublicKey} from "casper-js-sdk";
import WithLoadingData from "../../../../hoc/withLoadingData";
import {getUserTransactions} from "../../../../store/actions/transacrions";
import {getUserStores} from "../../../../store/actions/stores";
const { Option } = Select;

const columns = [
    {
        title: 'id',
        dataIndex: 'id',
        key: 'id',

    },
    {
        title: 'datetime',
        key: 'datetime',
        dataIndex: 'datetime',
    },
    {
        title: 'amount',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: 'comment',
        key: 'comment',
        dataIndex: 'comment',
    },
    {
        title: 'wallet',
        key: 'wallet',
        dataIndex: 'wallet',
    },
    {
        title: 'status',
        key: 'status',
        dataIndex: 'status',
    },
];

interface IPayment {
    datetime: "2014-12-24 23:12:00",
    amount: 2500000000,
    user: 11,
    comment: "test comment",
    wallet: "016ecf8a64f9b341d7805d6bc5041bc42139544561f07a7df5a1d660d8f2619fee"
}

const initialState = {
    datetime: '',
    amount: '',
    comment: '',
    wallet: ''
}

const Payments = () => {

    const payments = useSelector((state) => state.payments.data);
    const user = useSelector((state) => state.auth.data);
    const stores = useSelector((state) => state.storesData.data);

    useEffect(() => {
        if (user?.role === 'admin') {
            dispatch(getPayments())
        }
        if (user?.role === 'customer') {
            dispatch(getUserStores(user.id))
        }
    }, [])

    useEffect(() => {
        if (stores.length) {
            dispatch(getUserPayments(stores[0]?.apiKey))
        }
    }, [stores.length])

    const paymentsTable = payments.map((payment) => {
        return {
            ...payment,
            status: payment?.status?.replace('_', ' '),
            store: payment?.store?.name,
            datetime: new Date(payment?.datetime).toDateString()
        }
    }).reverse()

    const router = useRouter()
    const dispatch = useDispatch()

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [payment, setPayment] = useState(initialState);
    const [currentStore, setCurrentStore] = useState(stores[0]);

    const [form] = Form.useForm();

    const onChangePayment = (field: string) => (e: any) => {
        const value = e.target.value
        setPayment({
            ...payment,
            [field]: value,
        })
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const validateWallet = (rule: any, value: any, callback: any) => {
        if (value) {
            try {
                CLPublicKey.fromHex(value)
                callback();
            } catch (e) {
                callback("This wallet not exist!");
            }
        } else {
            callback();
        }
    };

    const validateAmount = (rule: any, value: any, callback: any) => {
        if (value < 2500000000) {
            callback("Must be at least 2500000000");
        } else {
            callback();
        }
    };

    useEffect(() => {
        if (stores.length) {
            dispatch(getUserPayments(stores[0]?.apiKey))
        }
    }, [stores.length])

    const handleOk = async () => {
        await form.validateFields()
            .then(async (res) => {
                try {
                    console.log(currentStore)
                    await dispatch(addPayment({
                        ...payment,
                        status: 'Not_paid',
                        datetime: new Date()
                    }, currentStore.apiKey))
                    if (user?.role === 'admin') {
                        dispatch(getPayments())
                    }
                    if (user?.role === 'customer') {
                        dispatch(getUserPayments(currentStore.apiKey))
                    }
                    setPayment(initialState)
                    form.resetFields();
                    setIsModalVisible(false);
                } catch (e) {
                    console.log(e, 'registration error')
                }
                console.log(res, 'valid')
            })
            .catch(async (err) => console.log(err))
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onRow=(record, rowIndex) => {
        return {
            onDoubleClick: event => router.push(`payments/${record.id}`),
        };
    }

    function handleChange(value) {
        const current = stores.filter((store) => store.apiKey === value)[0]
        setCurrentStore(current)
        dispatch(getUserPayments(value))
    }

    return <>
        <WithLoadingData data={user.role === 'admin' ? payments.length : stores.length}>
            <Modal title="Add payment" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
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
                        label="Wallet"
                        name="wallet"
                        rules={[{ required: true, message: 'Please input wallet!' }, { validator: validateWallet }]}
                    >
                        <Input onChange={onChangePayment('wallet')}/>
                    </Form.Item>
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
                        <Input.TextArea onChange={onChangePayment('comment')}/>
                    </Form.Item>
                </Form>
            </Modal>
            {user.role !== 'admin' ?
                <>
                    <Button onClick={showModal} type="primary" style={{margin: '0 0 20px 0'}} htmlType="submit" className="login-form-button">
                        Add Payment
                    </Button>
                    <br/>

                    <Select defaultValue={stores[0]?.name} style={{ width: 120, margin: '0 0 20px 0'}} onChange={handleChange}>
                        {
                            stores.filter((store) => store.apiKey).map((store) => <Option key={store.id} value={store.apiKey}>{store.name}</Option>)
                        }

                    </Select>
                </>
            : null
            }
            <Table columns={columns} scroll={{ x: 0 }} onRow={onRow} dataSource={paymentsTable} />
        </WithLoadingData>
    </>
}

export default wrapper.withRedux(Payments)