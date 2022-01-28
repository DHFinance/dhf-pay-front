// @ts-nocheck
import React from 'react';
import Payment from "./index";
import {useSelector} from "react-redux";

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

const PaymentsButton = () => {
    const payments = useSelector((state) => state.payments.data);
    const filterTable = payments.filter((item)=>{
        return item.type && item.text;
    })
    /**
     * @description data for the table in right format
     */
    const paymentsTable = filterTable.map((payment) => {
        return {
            ...payment,
            datetime: new Date(payment?.datetime).toDateString(),
            status: payment?.status?.replace('_', ' '),
            store: payment?.store?.name
        }
    }).reverse()
    return (
        <Payment paymentsTable={paymentsTable} entity={"buttons"} columns={columns}/>
    );
};

export default PaymentsButton;
