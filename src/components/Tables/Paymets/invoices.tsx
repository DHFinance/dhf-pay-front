// @ts-nocheck
import React from 'react';
import Payment from "./index";
import {useSelector} from "react-redux";

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
        title: 'comment',
        key: 'comment',
        dataIndex: 'comment',
    },
    {
        title: 'status',
        key: 'status',
        dataIndex: 'status',
    },
];

const PaymentsInvoices = () => {
    const payments = useSelector((state) => state.payments.data);
    const filterTable = payments.filter((item)=>{
        return !item.type && !item.text;
    });
    const paymentsTable = filterTable.map((payment) => {
        return {
            ...payment,
            datetime: new Date(payment?.datetime).toDateString(),
            status: payment?.status?.replace('_', ' '),
            store: payment?.store?.name
        }
    }).reverse()
    return (
        <Payment paymentsTable={paymentsTable} entity={"invoices"} columns={columns} />
    );
};

export default PaymentsInvoices;
