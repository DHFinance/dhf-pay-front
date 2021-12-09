// @ts-nocheck
import React, {useEffect} from "react";
import { Table, Tag, Space } from 'antd';
import "antd/dist/antd.css";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import WithLoadingData from "../../../../hoc/withLoadingData";
import {getTransactions, getUserTransactions} from "../../../../store/actions/transacrions";
import {getPayments, getUserPayments} from "../../../../store/actions/payments";

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
    const user = useSelector((state) => state.auth.data);
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        if (user?.role === 'admin') {
            dispatch(getTransactions())
        }
        if (user?.role === 'customer') {
            dispatch(getUserTransactions(user.id))
        }
    }, [])

    const onRow=(record, rowIndex) => {
        return {
            onDoubleClick: event => router.push(`transactions/${record.id}`), // click row
        };
    }

    return <WithLoadingData data={transactions}>
        <Table columns={columns} scroll={{x: 0 }} onRow={onRow} dataSource={transactions.reverse()} />
    </WithLoadingData>
}

export default Transactions