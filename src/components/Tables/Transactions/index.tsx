// @ts-nocheck
import React, {useEffect} from "react";
import {Table, Tag, Space, Select} from 'antd';
import "antd/dist/antd.css";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import WithLoadingData from "../../../../hoc/withLoadingData";
import {getTransactions, getUserTransactions} from "../../../../store/actions/transacrions";
import {getUserStores} from "../../../../store/actions/stores";
const { Option } = Select;

const columns = [
    {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'txHash',
        dataIndex: 'txHash',
        key: 'txHash',
    },
    {
        title: 'status',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'sender',
        key: 'sender',
        dataIndex: 'sender'
    },
    {
        title: 'receiver',
        key: 'receiver',
        dataIndex: 'receiver',
    },
];



const Transactions = () => {
    const transactions = useSelector((state) => state.transactions.data);
    const stores = useSelector((state) => state.storesData.data);
    const transactionsLoaded = useSelector((state) => state.transactions.isChanged);
    const storesLoaded = useSelector((state) => state.storesData.isChanged);
    const user = useSelector((state) => state.auth.data);
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        if (user?.role === 'admin') {
            dispatch(getTransactions())
        }
        if (user?.role === 'customer') {
            dispatch(getUserStores(user.id))
        }
    }, [])

    useEffect(() => {
        if (stores.length && user.role !== 'admin' && stores[0]?.apiKey) {
            dispatch(getUserTransactions(stores[0]?.apiKey))
        }
    }, [stores.length])

    const onRow=(record, rowIndex) => {
        return {
            onDoubleClick: event => router.push(`transactions/${record.id}`), // click row
        };
    }

    function handleChange(value) {
        dispatch(getUserTransactions(value))
    }

    const activeStores = stores.filter((store) => store.apiKey && !store.blocked)

    return <WithLoadingData data={(user.role === 'admin' ? transactionsLoaded : storesLoaded)}>
        { !activeStores.length && user.role !== 'admin'  ?
            <p>
                Create a store to be able to check transactions
            </p>
            :
            null
        }
        {user.role !== 'admin' && activeStores.length && activeStores[0]?.name ?
            <Select defaultValue={activeStores[0]?.name} style={{ width: 120, marginBottom: 20 }} onChange={handleChange}>
                {
                    activeStores.map((store) => <Option key={store.id} value={store.apiKey}>{store.name}</Option>)
                }

            </Select>
            :
            null
        }
        <Table columns={columns} scroll={{x: 0 }} onRow={onRow} dataSource={transactions.reverse()} />
    </WithLoadingData>
}

export default Transactions