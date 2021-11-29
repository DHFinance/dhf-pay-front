import React, {useEffect, useState} from "react";
import {Table, Tag, Space, Button, Modal, Form, Input, Checkbox} from 'antd';
import "antd/dist/antd.css";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import Text from "antd/lib/typography/Text";
import {addPayment} from "../../../../store/actions/payment";
import {reAuth} from "../../../../store/actions/auth";
import {wrapper} from "../../../../store/store";
import {getPayments} from "../../../../store/actions/payments";

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
        title: 'user',
        key: 'user',
        dataIndex: 'user',
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
    user: '',
    comment: '',
    wallet: ''
}

const Payments = () => {

    const payments = useSelector((state) => state.payments.data);
    const user = useSelector((state) => state.auth.data.id);

    const paymentsTable = payments.map((payment) => {
        return {
            ...payment,
            status: payment.status.replace('_', ' '),
            user: payment.user.email,
            datetime: new Date(payment.datetime).toDateString()
        }
    }).reverse()

    const router = useRouter()
    const dispatch = useDispatch()

    const localToken = localStorage.getItem('token')

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [payment, setPayment] = useState(initialState);

    const onChangePayment = (field: string) => (e: any) => {
        const value = e.target.value
        setPayment({
            ...payment,
            [field]: value,
        })
    }

    useEffect(() => {
        dispatch(reAuth(localToken))
    }, [])

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        if (payment.amount < 2500000000) {
            alert('сумма должна быть больше 2500000000')
            return false
        }
        await dispatch(addPayment({
            ...payment,
            status: 'Not_paid',
            user,
            datetime: new Date()
        }))
        await dispatch(getPayments())
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };



    const onRow=(record, rowIndex) => {
        return {
            onDoubleClick: event => router.push(`payments/${record.id}`),
        };
    }

    return <>
        <Modal title="Add payment" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                autoComplete="off"
            >
                <Form.Item
                    label="Wallet"
                    name="wallet"
                    rules={[{ required: true, message: 'Please input wallet!' }]}
                >
                    <Input onChange={onChangePayment('wallet')}/>
                </Form.Item>
                <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[{ required: true, message: 'Please input amount!' }]}
                >
                    <Input onChange={onChangePayment('amount')}/>
                    <Text>Minimum 2500000000</Text>
                </Form.Item>
                <Form.Item
                    label="Comment"
                    name="comment"
                >
                    <Input.TextArea onChange={onChangePayment('comment')}/>
                </Form.Item>
            </Form>
        </Modal>
        <Button onClick={showModal} type="primary" style={{margin: '0 0 20px 0'}} htmlType="submit" className="login-form-button">
             Add Payment
        </Button>
        <Table columns={columns} scroll={{ x: 0 }} onRow={onRow} dataSource={paymentsTable} />
    </>
}

export default wrapper.withRedux(Payments)