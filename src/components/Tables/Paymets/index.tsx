import 'antd/dist/antd.css';
import React, { FC } from 'react';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { UserRole } from '../../../modules/user/enums/userRole.enum';
import { wrapper } from '../../../store/store';
import { AdminPayments } from './components/AdminPayments';
import { UserPayments } from './components/UserPayments';

interface Props {
  entity: string;
}

/**
 * @description Page for display table of payments
 * @param {object} paymentsTable - data of table
 * @param {string} entity - invoices | buttons
 * @constructor
 */
const Payments: FC<Props> = ({ entity }) => {
  const user = useTypedSelector((state) => state.auth.data);

  if (user.role === UserRole.Admin) {
    return <AdminPayments entity={entity} />;
  } else {
    return <UserPayments entity={entity} />;
  }
};

export default wrapper.withRedux(Payments);
