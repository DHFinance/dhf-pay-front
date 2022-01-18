import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal, Select, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import WithLoadingData from "../../../../hoc/withLoadingData";
const { Option } = Select;
import {useRouter} from "next/router";
import {getUserStores} from "../../../../store/actions/stores";
import {getPayments, getUserPayments} from "../../../../store/actions/payments";

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

const Buttons = () => {
    const [currentStore, setCurrentStore] = useState(null);

    const stores = useSelector((state) => state.storesData.data);
    const storesLoaded = useSelector((state) => state.storesData.isChanged);
    const user = useSelector((state) => state.auth.data);

    useEffect(() => {
        if (user?.role === 'customer') {
            dispatch(getUserStores(user.id))
        }
    }, [])

    const [form] = Form.useForm();
    const activeStores = stores.filter((store) => store.apiKey && !store.blocked)
    const dispatch = useDispatch();

    function handleChange(value) {
        const current = stores.filter((store) => store.apiKey === value)[0]
        setCurrentStore(current)
        dispatch(getUserPayments(value))
    }
    const validateAmount = (rule: any, value: any, callback: any) => {
        if (value < 2500000000) {
            callback("Must be at least 2500000000");
        } else {
            callback();
        }
    };

    return <WithLoadingData data={storesLoaded ?? null}>
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
                <Input/>
            </Form.Item>
            <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: 'Please input callback url!' },{ validator: validateAmount }]}
            >
                <Input />
            </Form.Item>
            <Select defaultValue={activeStores[0]?.name} style={{ width: 120, marginBottom: 20 }} onChange={handleChange}>
                {
                    activeStores.map((store) => <Option key={store.id} value={store.apiKey}>{store.name}</Option>)
                }

            </Select>
            <Form.Item
                label="Description"
                name="description"
            >
                <Input.TextArea />
            </Form.Item>
        </Form>
    </WithLoadingData>
};

export default Buttons;
