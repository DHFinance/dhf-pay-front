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

const data = [
    {
        id: 1,
        datetime: '2014-12-24 23:12:00',
        amount: '200',
        user: 'John',
        comment: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        wallet: '8d73a6bfd8ec0ba1a639',
    },
    {
        id: 1,
        datetime: '2014-12-24 23:12:00',
        amount: '200',
        user: 'John',
        comment: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        wallet: '8d73a6bfd8ec0ba1a639',
    },
    {
        id: 1,
        datetime: '2014-12-24 23:12:00',
        amount: '200',
        user: 'John',
        comment: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        wallet: '8d73a6bfd8ec0ba1a639',
    },
    {
        id: 1,
        datetime: '2014-12-24 23:12:00',
        amount: '200',
        user: 'John',
        comment: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        wallet: '8d73a6bfd8ec0ba1a639',
    },
    {
        id: 1,
        datetime: '2014-12-24 23:12:00',
        amount: '200',
        user: 'John',
        comment: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        wallet: '8d73a6bfd8ec0ba1a639',
    },
    {
        id: 1,
        datetime: '2014-12-24 23:12:00',
        amount: '200',
        user: 'John',
        comment: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        wallet: '8d73a6bfd8ec0ba1a639',
    },
    {
        id: 1,
        datetime: '2014-12-24 23:12:00',
        amount: '200',
        user: 'John',
        comment: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        wallet: '8d73a6bfd8ec0ba1a639',
    },
];

const Bills = () => {
    return <Table columns={columns} dataSource={data} />
}

export default Bills