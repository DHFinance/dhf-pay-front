// @ts-nocheck
import React, {useEffect} from "react";
import { Table, Tag, Space } from 'antd';
import "antd/dist/antd.css";
import {useDispatch, useSelector} from "react-redux";
import {getUsers} from "../../../../store/actions/users";
import {getPayments} from "../../../../store/actions/payments";
import WithLoadingData from "../../../../hoc/withLoadingData";
import {useRouter} from "next/router";

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Company',
        dataIndex: 'company',
        key: 'company',
    },

];


const Users = () => {
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        dispatch(getUsers())
    }, [])

    /**
     * @description handling every row,applying styles and a click event handler to it
     * @param {object} record - element of array entity
     * @param rowIndex
     */
    const onRow=(record, rowIndex) => {
        return {
            style: {cursor: "pointer"},
            onClick: event => router.push(`users/${record.id}`),
        };
    }

    const users = useSelector((state) => state.users.data);
    return <WithLoadingData data={users}><Table columns={columns} onRow={onRow}  dataSource={users.reverse()} /></WithLoadingData>
}

export default Users