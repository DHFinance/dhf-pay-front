import { Table } from 'antd';
import 'antd/dist/antd.css';
import React, { useEffect } from 'react';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { User } from '../../../interfaces/user.interface';
import { getUsers } from '../../../store/slices/users/asyncThunks/getUsers';
import { Loader } from '../../Loader';
import { userColumns } from './usersColumns';

/**
 * @description handling every row,applying styles and a click event handler to it
 * @param {object} record - element of array entity
 */
const onRow = (record: User) => {
  return {
    style: { cursor: 'pointer' },
    onClick: () => window.location.replace(`users/${record.id}`),
  };
};

const Users = () => {
  const users = useTypedSelector((state) => state.users.data);
  const usersStatus = useTypedSelector((state) => state.users.status);

  const dispatch = useTypedDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  if (usersStatus.error) {
    return <p>Server error</p>;
  }

  if (users === null || usersStatus.isLoading) {
    return <Loader />;
  }

  return (
    <Table columns={userColumns} onRow={onRow} dataSource={[...users].reverse()} />
  );
};

export default Users;
