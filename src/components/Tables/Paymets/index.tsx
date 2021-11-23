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
];

const Payments = () => {

    const payments = useSelector((state) => state.payments.data);
    const router = useRouter()

    const onRow=(record, rowIndex) => {
        return {
            onClick: event => router.push(`payments/${record.id}`), // click row
        };
    }

    return <Table columns={columns} onRow={onRow} dataSource={payments} />
}

export default Payments