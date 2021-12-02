// @ts-nocheck
import React from "react";
import { Table, Tag, Space } from 'antd';
import "antd/dist/antd.css";
import {useSelector} from "react-redux";
import {useRouter} from "next/router";

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
    const router = useRouter()

    const onRow=(record, rowIndex) => {
        return {
            onDoubleClick: event => router.push(`transactions/${record.id}`), // click row
        };
    }

    return <Table columns={columns} scroll={{x: 0 }} onRow={onRow} dataSource={transactions.reverse()} />
}

export default Transactions