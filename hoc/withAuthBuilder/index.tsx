import React, { FC, ReactNode } from 'react';
import WithAuth from '../withAuth';

interface Props {
  children: ReactNode;
  isAdmin: boolean;
  isBuilder: boolean;
}

/**
 * @description wrapper for buttons/invoices builder pages inaccessible to admin
 */
const WithAuthBuilder: FC<Props> = ({ children, isAdmin, isBuilder }) => {
  return (
    <WithAuth isAdmin={isAdmin} isBuilder={isBuilder}>
      {children}
    </WithAuth>
  );
};

export default WithAuthBuilder;
