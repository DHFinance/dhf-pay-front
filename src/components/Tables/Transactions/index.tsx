import React from "react";
import { Table, Tag, Space } from 'antd';
import "antd/dist/antd.css";

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

const data = [
    {
        id: 1,
        txHash: '0xb4bc263278d3f77a652a8d73a6bfd8ec0ba1a63923bbb4f38147fb8a943da26d',
        status: 'processing',
        updated: '2014-12-24 23:12:00',
        wallet: '8d73a6bfd8ec0ba1a639',
    },
    {
        id: 1,
        txHash: '0xb4bc263278d3f77a652a8d73a6bfd8ec0ba1a63923bbb4f38147fb8a943da26d',
        status: 'processing',
        updated: '2014-12-24 23:12:00',
        wallet: '8d73a6bfd8ec0ba1a639',
    },
    {
        id: 1,
        txHash: '0xb4bc263278d3f77a652a8d73a6bfd8ec0ba1a63923bbb4f38147fb8a943da26d',
        status: 'processing',
        updated: '2014-12-24 23:12:00',
        wallet: '8d73a6bfd8ec0ba1a639',
    },
    {
        id: 1,
        txHash: '0xb4bc263278d3f77a652a8d73a6bfd8ec0ba1a63923bbb4f38147fb8a943da26d',
        status: 'processing',
        updated: '2014-12-24 23:12:00',
        wallet: '8d73a6bfd8ec0ba1a639',
    },
    {
        id: 1,
        txHash: '0xb4bc263278d3f77a652a8d73a6bfd8ec0ba1a63923bbb4f38147fb8a943da26d',
        status: 'processing',
        updated: '2014-12-24 23:12:00',
        wallet: '8d73a6bfd8ec0ba1a639',
    },
    {
        id: 1,
        txHash: '0xb4bc263278d3f77a652a8d73a6bfd8ec0ba1a63923bbb4f38147fb8a943da26d',
        status: 'processing',
        updated: '2014-12-24 23:12:00',
        wallet: '8d73a6bfd8ec0ba1a639',
    },
];

const Transactions = () => {
    return <Table columns={columns} dataSource={data} />
}

export default Transactions