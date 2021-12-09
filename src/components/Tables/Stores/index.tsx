// @ts-nocheck
import React, {useEffect, useState} from "react";
import {Table, Tag, Space, Button, Modal, Form, Input, Checkbox} from 'antd';
import "antd/dist/antd.css";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import Text from "antd/lib/typography/Text";
// @ts-ignore
import {addPayment} from "../../../../store/actions/payment";
import {postLogin, reAuth} from "../../../../store/actions/auth";
import {wrapper} from "../../../../store/store";
import {getPayments, getUserPayments} from "../../../../store/actions/payments";
import {CLPublicKey} from "casper-js-sdk";
import WithLoadingData from "../../../../hoc/withLoadingData";
import {getTransactions} from "../../../../store/actions/transacrions";

const columns = [
    {
        title: 'id',
        dataIndex: 'id',
        key: 'id',

    },
    {
        title: 'name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'user',
        key: 'user',
        dataIndex: 'user',
    },
];

const initialState = {
    description: '',
    name: '',
    user: '',
    comment: '',
    wallet: ''
}

const Payments = () => {

    const payments = useSelector((state) => state.payments.data);
    const user = useSelector((state) => state.auth.data);

    useEffect(() => {
        if (user?.role === 'admin') {
            dispatch(getPayments())
        }
        if (user?.role === 'customer') {
            dispatch(getUserPayments(user.id))
        }
    }, [user])

    const paymentsTable = payments.map((payment) => {
        return {
            ...payment,
            status: payment.status.replace('_', ' '),
            user: payment?.user?.email,
            datetime: new Date(payment.datetime).toDateString()
        }
    }).reverse()

    const router = useRouter()
    const dispatch = useDispatch()

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [payment, setPayment] = useState(initialState);

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

    const handleOk = async () => {
        await form.validateFields()
            .then(async (res) => {
                try {
                    await dispatch(addPayment({
                        ...payment,
                        status: 'Not_paid',
                        user,
                        datetime: new Date()
                    }))
                    await dispatch(getPayments())
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

    return <>
        <WithLoadingData data={paymentsTable}>
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
            <Button onClick={showModal} type="primary" style={{margin: '0 0 20px 0'}} htmlType="submit" className="login-form-button">
                 Add Payment
            </Button>
            <Table columns={columns} scroll={{ x: 0 }} onRow={onRow} dataSource={paymentsTable} />
        </WithLoadingData>
    </>
}

export default wrapper.withRedux(Payments)