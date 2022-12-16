import { Pagination, Table } from 'antd';
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
  currentPage: number;
  changePage: (page: number) => void;
  totalPages: number;
}

const PaymentsInvoices: FC<Props> = ({ currentTable, onRow, currentPage, changePage, totalPages }) => {
  const filterTable =
    currentTable?.filter((item: any) => {
      return !item.type && !item.text;
    }) || [];
  return (
    <>
      <Table
        columns={columns}
        scroll={{ x: 0 }}
        onRow={onRow}
        pagination={false}
        dataSource={filterTable.map((item: any) => {
          return {
            ...item,
            amount: item.amount / 1_000_000_000,
          };
        })}
      />
      <div style={{ display: 'flex', flexDirection: 'row-reverse', marginTop: '5px' }}>
        <Pagination current={currentPage} onChange={changePage} total={totalPages} />
      </div>
    </>
  );
};

export default PaymentsInvoices;
