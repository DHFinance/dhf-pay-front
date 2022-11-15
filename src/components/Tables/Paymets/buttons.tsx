import { Table } from 'antd';
import React, { FC } from 'react';

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
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
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

interface Props {
  currentTable: any;
  onRow: any;
}

const PaymentsButton: FC<Props> = ({ currentTable, onRow }) => {
  return (
    <Table columns={columns} scroll={{ x: 0 }} onRow={onRow} dataSource={currentTable?.map((item: any) => {
      return {
        ...item,
        amount: item.amount / 1000000000,
      };
    }) || []} />
  );
};

export default PaymentsButton;
