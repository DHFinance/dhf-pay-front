// @ts-nocheck
import {Statistic, Row, Col, Button, Form, Input, Modal} from 'antd';
import {AreaChartOutlined, ClockCircleOutlined, CommentOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getStores, getUserStores} from "../../../../store/actions/stores";
import {blockStore, editStore, getStore, unblockStore} from "../../../../store/actions/store";
import WithLoadingData from "../../../../hoc/withLoadingData";
import {addPayment} from "../../../../store/actions/payment";
import {getPayments} from "../../../../store/actions/payments";
import {blockUser} from "../../../../store/actions/user";
import Title from "antd/lib/typography/Title";
import WithPageExist from "../../../../hoc/withPageExist";
import {CLPublicKey} from "casper-js-sdk";


const Store = () => {

    const [edit, setEdit] = useState(false)
    const store = useSelector((state) => state.storeData.data);
    const storeError = useSelector((state) => state.storeData.error);
    const user = useSelector((state) => state.auth.data);
    const [storeEdit, setStoreEdit] = useState(store);
    const dispatch = useDispatch()
    const router = useRouter()
    const [form] = Form.useForm();

    /**
     * @description generating store key
     */
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
        setStoreEdit({
            ...storeEdit,
            apiKey: randomString(36)
        })
    };

    const deleteKey = () => {
        setStoreEdit({
            ...storeEdit,
            apiKey: ''
        })
    };

    /**
     * @description set data into store object
     * @param {object} e - event
     * @param {string} field - field name
     */
    const onChangeStore = (field: string) => (e: any) => {
        const value = e.target.value
        setStoreEdit({
            ...storeEdit,
            [field]: value,
        })
    }

    /**
     * @description load data
     */
    useEffect(() => {
         /** @description if is query id, then get store by id */
        if (router.query.slug) {
            dispatch(getStore(router.query.slug))
        }
    }, [])

    const {
        id,
        description,
        name,
        url,
        apiKey,
        blocked
    } = store

    const onEdit = () => {
        setEdit(true)
    }

    /**
     * @description get store
     */
    const handleOk = async () => {
         /** @description validations of fields form */
        await form.validateFields()
            .then(async (res) => {
                try {
                    /** @description change current store */
                    await dispatch(editStore(router.query.slug, storeEdit))
                    form.resetFields();
                    setEdit(false);
                    await dispatch(getStore(router.query.slug))
                    await dispatch(getUserStores(router.query.slug))
                } catch (e) {
                    console.log(e, 'registration error')
                }
            })
            .catch(async (err) => console.log(err))
    }

    const handleCancel = () => {
        setEdit(false);
    };

    const unblockStoreButton = () => {
      dispatch(unblockStore(id))
    }

    const blockStoreButton = () => {
        dispatch(blockStore(id))
    }

    useEffect(() => {
        setStoreEdit(store)
    }, [store])

    /**
     * @description wallet validation. Occurs with the help of the CLPublicKey.fromHex function, which returns an error if the wallet is not valid
     * @param {object} rule - object field wallet
     * @param {any} value - value wallet
     * @param {function} callback - executed after successful validation of the wallet field
     */
    const validateWallet = (rule: any, value: any, callback: any) => {
        /** @description if value isn't empty, then verify wallet */
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

    return (
        <WithPageExist error={storeError} data={store}>
            <WithLoadingData data={storeEdit}>
            <Modal title="Edit store" visible={edit} onOk={handleOk} onCancel={handleCancel}>
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
                        initialValue={storeEdit.name}
                        rules={[{ required: true, message: 'Please input wallet!' }]}
                    >
                        <Input value={storeEdit.name} onChange={onChangeStore('name')}/>
                    </Form.Item>
                    <Form.Item
                        label="Callback url"
                        name="url"
                        initialValue={storeEdit.url}
                        rules={[{ required: true, message: 'Please input wallet!' }]}
                    >
                        <Input value={storeEdit.url} onChange={onChangeStore('url')}/>
                    </Form.Item>
                    <Form.Item
                        label="Wallet"
                        name="wallet"
                        initialValue={storeEdit.wallet}
                        rules={[{ required: true, message: 'Please input wallet!' }, { validator: validateWallet }]}
                    >
                        <Input onChange={onChangeStore('wallet')}/>
                    </Form.Item>
                    <Form.Item
                        label="ApiKey"
                        name="apiKey"
                    >
                        <Input.Group compact>
                            <Input style={{ width: 'calc(100% - 90px)' }} value={storeEdit.apiKey} disabled onChange={onChangeStore('apiKey')}/>
                            {storeEdit.apiKey ?
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
                        initialValue={storeEdit.description}
                    >
                        <Input.TextArea value={storeEdit.description} onChange={onChangeStore('description')}/>
                    </Form.Item>
                </Form>
            </Modal>
            {blocked ?
                <Title style={{width: '100%', textAlign: 'center', color: 'red'}}>Blocked</Title>
                :
                null
            }
            <Col  span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="name" value={name} prefix={<ClockCircleOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="url" value={url} prefix={<AreaChartOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0px 20px', background: 'white'}}>
                <Statistic title="api key" value={apiKey || 'None (generate an api key to perform actions)'} prefix={<CommentOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 20px 20px', background: 'white'}}>
                <Statistic title="description" value={description || 'none'} prefix={<CommentOutlined />} />
            </Col>
            {user?.id === store?.user?.id ?
                <Button type="primary" onClick={onEdit} style={{margin: '20px 20px 0 0'}} className="login-form-button">
                    Edit
                </Button>
                :
                null
            }
            {
                user?.role === 'admin' && <>
                    {blocked ?
                        <Button type="primary" onClick={unblockStoreButton} style={{margin: '20px 20px 0 0'}} className="login-form-button">
                            Unblock
                        </Button>
                        :
                        <Button danger type="primary" onClick={blockStoreButton} style={{margin: '20px 20px 0 0'}} className="login-form-button">
                            Block
                        </Button>
                    }
                </>
            }
                <Button onClick={() => router.back()} style={{margin: '20px 0 0 0'}} type="primary">
                    Back
                </Button>

        </WithLoadingData>
        </WithPageExist>
    );
};


export default Store