import { Button } from 'antd';
import React, { FC, MouseEventHandler } from 'react';

interface StatusButtonPayProps {
  balance: string;
  click: MouseEventHandler;
  deploy: MouseEventHandler;
}

/**
 * @description Payment button component. Changes its functionality depending on the state of connection with signer
 * @param balance {string} - the balance of the user authorized through the signer in cspr. If there is a balance, then the user has connected to the site through casper signer and can make a transaction
 * @param click {function} - the signer connection function is passed here
 * @param deploy {function} - the payment function in signer is passed here
 */
const StatusButtonPay: FC<StatusButtonPayProps> = ({
  balance,
  click,
  deploy,
}) => {
  return !balance ? (
    <Button
      onClick={click}
      style={{ margin: '20px 20px 0 0' }}
      type="primary"
      size={'large'}
    >
      Sign in Signer
    </Button>
  ) : (
    <Button
      onClick={deploy}
      style={{ margin: '20px 20px 0 0' }}
      type="primary"
      size={'large'}
    >
      Pay
    </Button>
  );
};

export default StatusButtonPay;
