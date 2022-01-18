// @ts-nocheck
import React, {useEffect, useState} from "react";
import {Table, Tag, Space, Button, Modal, Form, Input, Checkbox, Select} from 'antd';
import "antd/dist/antd.css";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {addPayment} from "../../../../store/actions/payment";
import {wrapper} from "../../../../store/store";
import {getPayments, getUserPayments} from "../../../../store/actions/payments";
import WithLoadingData from "../../../../hoc/withLoadingData";
import {getUserStores} from "../../../../store/actions/stores";
import axios from "axios";
import {CSPRtoUSD} from "../../../../utils/CSPRtoUSD";
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
        title: 'status',
        key: 'status',
        dataIndex: 'status',
    },
];

const initialState = {
    amount: '',
    comment: ''
}


const Payments = () => {

    const payments = useSelector((state) => state.payments.data);
    const user = useSelector((state) => state.auth.data);
    const stores = useSelector((state) => state.storesData.data);
    const storesLoaded = useSelector((state) => state.storesData.isChanged);
    const paymentsLoaded = useSelector((state) => state.payments.isChanged);

    useEffect(async () => {
        const courseUsd = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=casper-network&vs_currencies=usd')
        setCourse(courseUsd.data['casper-network'].usd)
    }, [])

    useEffect(() => {
        if (user?.role === 'admin') {
            dispatch(getPayments())
        }
        if (user?.role === 'customer') {
            dispatch(getUserStores(user.id))
        }
    }, [])

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


    const activeStores = stores.filter((store) => store.apiKey && !store.blocked)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [payment, setPayment] = useState(initialState);
    const [currentStore, setCurrentStore] = useState(null);
    const [course, setCourse] = useState(null);

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

    const validateAmount = (rule: any, value: any, callback: any) => {
        if (value < 2500000000) {
            callback("Must be at least 2500000000");
        } else {
            callback();
        }
    };

    useEffect(() => {
        if (stores.length && user.role !== 'admin' && activeStores[0]?.apiKey) {
            dispatch(getUserPayments(activeStores[0]?.apiKey))
        }
    }, [stores.length])

    useEffect(() => {
        if (!currentStore) {
            setCurrentStore(activeStores[0])
        }
    }, [activeStores])

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
                    setPayment(initialState)
                    form.resetFields();
                    setIsModalVisible(false);
                } catch (e) {
                    console.log(e, 'registration error')
                }
            })
            .catch(async (err) => console.log(err))
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onRow=(record, rowIndex) => {
        return {
            style: {cursor: "pointer"},
            onClick: event => router.push(`payments/${record.id}`),
        };
    }

    function handleChange(value) {
        const current = stores.filter((store) => store.apiKey === value)[0]
        setCurrentStore(current)
        dispatch(getUserPayments(value))
    }

    return <>
        <WithLoadingData data={(user.role === 'admin' ? paymentsLoaded : storesLoaded)}>
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
                        label="Amount CSPR"
                        name="amount"
                        rules={[{ required: true, message: 'Please input amount!' }, { validator: validateAmount }]}
                    >
                        <Input type='number' onChange={onChangePayment('amount')}/>
                    </Form.Item>
                    <Form.Item
                        label="Amount USD"
                        name="amount"
                        rules={[{ required: true, message: 'Please input amount!' }, { validator: validateAmount }]}
                    >
                        ${CSPRtoUSD(+payment.amount, +course)}
                    </Form.Item>

                    <Form.Item
                        label="Comment"
                        name="comment"
                    >
                        <Input.TextArea onChange={onChangePayment('comment')}/>
                    </Form.Item>
                </Form>
            </Modal>
            { !activeStores.length && user.role !== 'admin' ?
                <p>
                    Create a store to be able to create payments
                </p>
                :
                null
            }
            {user.role !== 'admin' && activeStores.length && currentStore ?
                <>
                    <Button onClick={showModal} type="primary" style={{margin: '0 0 20px 0'}} htmlType="submit" className="login-form-button">
                        Add Payment
                    </Button>
                    <br/>

                    {console.log(currentStore)}
                    <Select defaultValue={currentStore.name} style={{ width: 120, margin: '0 0 20px 0'}} onChange={handleChange}>
                        {
                            activeStores.map((store) => <Option key={store.id} value={store.apiKey}>{store.name}</Option>)
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