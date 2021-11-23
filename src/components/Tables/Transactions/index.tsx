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
        title: 'updated',
        key: 'updated',
        dataIndex: 'updated',
    },
    {
        title: 'wallet',
        key: 'wallet',
        dataIndex: 'wallet',
    },
];



const Transactions = () => {
    const transactions = useSelector((state) => state.transactions.data);
    const router = useRouter()

    const onRow=(record, rowIndex) => {
        return {
            onClick: event => router.push(`transactions/${record.id}`), // click row
        };
    }

    return <Table columns={columns} onRow={onRow} dataSource={transactions} />
}

export default Transactions