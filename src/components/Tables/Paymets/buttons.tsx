// @ts-nocheck
import React from 'react';
import Payment from "./index";
import {useSelector} from "react-redux";
import {Table} from "antd";

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',

    },
    {
        title: 'Datetime',
        key: 'datetime',
        dataIndex: 'datetime',
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: 'Text',
        dataIndex: 'text',
        key: 'text',
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'Comment',
        key: 'comment',
        dataIndex: 'comment',
    },
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
    },
];

const PaymentsButton = ({currentTable, onRow}) => {
    const filterTable = currentTable.filter((item)=>{
        return item.type && item.text;
    })
    return (
        <Table columns={columns} scroll={{ x: 0 }} onRow={onRow} dataSource={filterTable.map(item=>{
          return {
            ...item,
            amount: item.amount / 1000000000
          }
        })} />
    );
};

export default PaymentsButton;