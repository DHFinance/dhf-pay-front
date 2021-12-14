// @ts-nocheck
import {Statistic, Row, Col, Button, Form, Input, Modal} from 'antd';
import {AreaChartOutlined, ClockCircleOutlined, CommentOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getStores} from "../../../../store/actions/stores";
import {editStore, getStore} from "../../../../store/actions/store";
import WithLoadingData from "../../../../hoc/withLoadingData";
import {addPayment} from "../../../../store/actions/payment";
import {getPayments} from "../../../../store/actions/payments";


const Store = () => {

    const [edit, setEdit] = useState(false)
    const store = useSelector((state) => state.storeData.data);
    const user = useSelector((state) => state.auth.data);
    const [storeEdit, setStoreEdit] = useState(store);
    const dispatch = useDispatch()
    const router = useRouter()
    const [form] = Form.useForm();

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
            apiKey: randomString(8)
        })
    };

    const deleteKey = () => {
        setStoreEdit({
            ...storeEdit,
            apiKey: ''
        })
    };

    const onChangeStore = (field: string) => (e: any) => {
        const value = e.target.value
        setStoreEdit({
            ...storeEdit,
            [field]: value,
        })
    }

    useEffect(() => {
        dispatch(getStore(router.query.slug))
    }, [])

    const {
        description,
        name,
        url,
        apiKey,
    } = store

    const onEdit = () => {
        setEdit(true)
    }

    const handleOk = async () => {
        await form.validateFields()
            .then(async (res) => {
                try {
                    await dispatch(editStore(router.query.slug, storeEdit))
                    form.resetFields();
                    setEdit(false);
                    await dispatch(getStore(router.query.slug))
                } catch (e) {
                    console.log(e, 'registration error')
                }
                console.log(res, 'valid')
            })
            .catch(async (err) => console.log(err))
    }

    const handleCancel = () => {
        setEdit(false);
    };

    useEffect(() => {
        setStoreEdit(store)
    }, [store])

    return (
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
            <Col  span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="name" value={name} prefix={<ClockCircleOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="url" value={url} prefix={<AreaChartOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0px 20px', background: 'white'}}>
                <Statistic title="apiKey" value={apiKey} prefix={<CommentOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 20px 20px', background: 'white'}}>
                <Statistic title="description" value={description} prefix={<CommentOutlined />} />
            </Col>
            {user?.id === store?.user?.id ?
                <Button type="primary" onClick={onEdit} style={{margin: '20px 0 0 0'}} className="login-form-button">
                    Edit
                </Button>
                :
                null
            }
            {user?.role === 'admin' ?
                <Button danger type="primary" onClick={onEdit} style={{margin: '20px 0 0 0'}} className="login-form-button">
                    Block store
                </Button>
                :
                null
            }
        </WithLoadingData>
    );
};


export default Store