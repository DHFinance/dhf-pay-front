// @ts-nocheck
import React, {useEffect, useState} from "react";
import {Table, Tag, Space, Button, Modal, Form, Input, Checkbox} from 'antd';
import "antd/dist/antd.css";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import Text from "antd/lib/typography/Text";
// @ts-ignore
import {addStore} from "../../../../store/actions/store";
import {getStores, getUserStores} from "../../../../store/actions/stores";
import {wrapper} from "../../../../store/store";
import WithLoadingData from "../../../../hoc/withLoadingData";
import {CLPublicKey} from "casper-js-sdk";

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
    {
        title: 'wallet',
        key: 'wallet',
        dataIndex: 'wallet',
        cursor: 'pointer',
    },
];

const initialState = {
    description: '',
    name: '',
    url: '',
    apiKey: '',
    wallet: ''
}

const Stores = () => {

    const stores = useSelector((state) => state.storesData.data);
    const user = useSelector((state) => state.auth.data);

    const storesTable = stores.map((store) => {
        return {
            ...store,
            user: store?.user?.email
        }
    }).reverse()

    const router = useRouter()
    const dispatch = useDispatch()



    const [isModalVisible, setIsModalVisible] = useState(false);
    const [store, setStore] = useState(initialState);

    const [form] = Form.useForm();

    useEffect(() => {
        if (user.role === 'admin') {
            dispatch(getStores())
        }
        if (user.role === 'customer') {
            dispatch(getUserStores(user.id))
        }
    }, [user.role])

    const onChangeStore = (field: string) => (e: any) => {
        const value = e.target.value
        setStore({
            ...store,
            [field]: value,
        })
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        await form.validateFields()
            .then(async (res) => {
                try {
                    await dispatch(addStore({
                        ...store,
                        user
                    }))
                    if (user.role === 'admin') {
                        dispatch(getStores())
                    }
                    if (user.role === 'customer') {
                        dispatch(getUserStores(user.id))
                    }
                    setStore(initialState)
                    form.resetFields();
                    setIsModalVisible(false);
                } catch (e) {
                    console.log(e, 'store creating error')
                }
            })
            .catch(async (err) => console.log(err))
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const generateKey = () => {
        function randomString(len) {
            const charSet =
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let randomString = '';
            for (let i = 0; i < len; i++) {
                const randomPoz = Math.floor(Math.random() * charSet.length);
                randomString += charSet.substring(randomPoz, randomPoz + 1);
            }
            return randomString;
        }
        setStore({
            ...store,
            apiKey: randomString(8)
        })
    };

    const deleteKey = () => {
        setStore({
            ...store,
            apiKey: ''
        })
    };

    const onRow=(record, rowIndex) => {
        return {
            style: {cursor: "pointer"},
            onClick: event => router.push(`stores/${record.id}`),
        };
    }

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

    return <>
        <WithLoadingData data={storesTable}>
            <Modal title="Add store" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
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
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input store name!' }]}
                    >
                        <Input onChange={onChangeStore('name')}/>
                    </Form.Item>
                    <Form.Item
                        label="Callback url"
                        name="url"
                        rules={[{ required: true, message: 'Please input callback url!' }]}
                    >
                        <Input onChange={onChangeStore('url')}/>
                    </Form.Item>
                    <Form.Item
                        label="Wallet"
                        name="wallet"
                        rules={[{ required: true, message: 'Please input wallet!' }, { validator: validateWallet }]}
                    >
                        <Input onChange={onChangeStore('wallet')}/>
                    </Form.Item>
                    <Form.Item
                        label="ApiKey"
                        name="apiKey"
                    >
                        <Input.Group compact>
                            <Input style={{ width: 'calc(100% - 90px)' }} value={store.apiKey} disabled onChange={onChangeStore('apiKey')}/>
                            {store.apiKey ?
                                <Button
                                    style={{ width: 90}}
                                    type="primary"
                                    danger
                                    onClick={deleteKey}
                                >
                                    Delete
                                </Button>
                                :
                                <Button
                                    style={{ width: 90}}
                                    type="primary"
                                    onClick={generateKey}
                                >
                                    Generate
                                </Button>
                            }


                        </Input.Group>
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <Input.TextArea onChange={onChangeStore('description')}/>
                    </Form.Item>
                </Form>
            </Modal>
            {
                user.role !== 'admin' ?
                    <Button onClick={showModal} type="primary" style={{margin: '0 0 20px 0'}} htmlType="submit" className="login-form-button">
                        Add Store
                    </Button>
                    : null
            }
            <Table columns={columns} scroll={{ x: 0 }} onRow={onRow} dataSource={storesTable} />
        </WithLoadingData>
    </>
}

export default wrapper.withRedux(Stores)