import React from "react";
import { Table, Tag, Space } from 'antd';
import "antd/dist/antd.css";
import {useSelector} from "react-redux";

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


const Users = () => {
    const users = useSelector((state) => state.users.data);
    return <Table columns={columns} dataSource={users} />
}

export default Users