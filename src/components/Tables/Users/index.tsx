import React from "react";
import { Table, Tag, Space } from 'antd';
import "antd/dist/antd.css";

const columns = [
    {
        title: 'name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'last name',
        dataIndex: 'lastName',
        key: 'lastName',
    },
    {
        title: 'email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'company',
        dataIndex: 'company',
        key: 'company',
    },

];

const data = [
    {
        key: '1',
        name: 'John',
        lastName: 'Brown',
        company: 'Google',
        email: 'google@gmail.com',
    },
    {
        key: '2',
        name: 'John',
        lastName: 'Brown',
        company: 'Google',
        email: 'google@gmail.com',
    },
    {
        key: '3',
        name: 'John',
        lastName: 'Brown',
        company: 'Google',
        email: 'google@gmail.com',
    },
];

const Users = () => {
    return <Table columns={columns} dataSource={data} />
}

export default Users