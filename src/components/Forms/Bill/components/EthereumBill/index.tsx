import {
  AreaChartOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useEtherBalance, useEthers, useSendTransaction } from '@usedapp/core';
import { Button, Col, Form, Input, Statistic } from 'antd';
import { utils } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';
import { SEPOLIA_SCAN_URL } from '../../../../../../ethConfig/config';
import { getUsdFromCrypto } from '../../../../../../utils/getUsdFromCrypto';
import { useTypedDispatch } from '../../../../../hooks/useTypedDispatch';
import { Payment } from '../../../../../interfaces/payment.interface';
import { Transaction } from '../../../../../interfaces/transaction.interface';
import { pay } from '../../../../../store/slices/pay/asyncThunks/pay';

interface EthereumBillProps {
  billInfo: Payment;
  date: any;
  course: any;
  transaction: Transaction;
}

const EthereumBill: FC<EthereumBillProps> = ({
  billInfo,
  date,
  course,
  transaction,
}) => {
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { activateBrowserWallet, account } = useEthers();
  const { sendTransaction, state } = useSendTransaction({
    transactionName: 'Send Ethereum',
  });
  const [transactionHash, setTransactionHash] = useState<string | undefined>(transaction?.txHash);
  const etherBalance = useEtherBalance(account);
  const [form] = Form.useForm();
  const sendEth = async () => {
    const to = billInfo.store.wallets.find(
      (wallet) => wallet.currency === billInfo.currency,
    );
    if (to) {
      await sendTransaction({
        to: to.value,
        value: utils.parseEther(`${+billInfo.amount / 1_000_000_000}`),
        gasLimit: 21048,
      });
    }
  };
  const dispatch = useTypedDispatch();

  useEffect(() => {
    if (etherBalance) {
      setBalance(formatEther(etherBalance));
    }
  }, [etherBalance]);

  useEffect(() => {
    if (state.status) {
      switch (state.status) {
        case 'PendingSignature': {
          setLoading(true);
          break;
        }
        case 'Success': {
          setTransactionHash(state.transaction?.hash);
          setSuccess(true);
          dispatch(
            pay({
              txHash: state.transaction?.hash,
              email,
              payment: {
                id: billInfo.id,
              },
              sender: state.transaction?.from,
            }),
          );
          break;
        }
        case 'Exception': {
          setError('User denied transaction signature.');
          break;
        }
        default: {
          return;
        }
      }
    }
  }, [state.status]);

  return (
    <>
      <Col
        span={24}
        style={{
          padding: '20px 0 0 0',
          display: 'flex',
          justifyContent: 'center',
          background: 'white',
        }}
      >
        <div style={{ color: 'red', fontSize: '24px' }}>
          {billInfo?.cancelled && 'Cancelled'}
        </div>
      </Col>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic
          title="Your Balance"
          value={
            etherBalance
              ? `${formatEther(etherBalance).substring(0, 8)} ${billInfo.currency} (${(
                +balance * course
              ).toFixed(2)}$)`
              : 'Sign in MetaMask to get balance'
          }
          prefix={<AreaChartOutlined />}
        />
      </Col>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic
          title="Datetime"
          value={date}
          prefix={<ClockCircleOutlined />}
        />
      </Col>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic
          title="Amount"
          value={`${+billInfo.amount / 1_000_000_000} ${
            billInfo.currency
          } ($${getUsdFromCrypto(+billInfo.amount, course)})`}
          prefix={<AreaChartOutlined />}
        />
      </Col>
      <Col
        span={24}
        style={{ padding: '20px 0 20px 20px', background: 'white' }}
      >
        <Statistic
          title="Comment"
          value={billInfo.comment || 'none'}
          prefix={<CommentOutlined />}
        />
      </Col>
      <Col
        span={24}
        style={{ padding: '20px 0 20px 20px', background: 'white' }}
      >
        <Form
          name="email"
          initialValues={{ remember: true }}
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 12 }}
          validateTrigger={'onSubmit'}
          form={form}
        >
          <Form.Item
            label="Buyer's email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              {
                type: 'email',
                message: 'Please enter a valid email!',
              },
            ]}
          >
            <Input
              name="email"
              style={{ width: 400 }}
              onChange={(e) => setEmail(e.target.value)}
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
        </Form>
        {error && <div>{error}</div>}
      </Col>
      {!etherBalance ? (
        <Button
          style={{ margin: '20px 20px 0 0' }}
          type="primary"
          size={'large'}
          onClick={activateBrowserWallet}
        >
          Connect to metamask
        </Button>
      ) : success ? null : (
        <Button
          style={{ margin: '20px 20px 0 0' }}
          type="primary"
          size={'large'}
          onClick={sendEth}
          disabled={!email}
        >
          Pay
        </Button>
      )}
      {success && (
        <Link href={`${SEPOLIA_SCAN_URL}/tx/${transactionHash}`}>
          <a target="_blank" rel="noreferrer">
            <Button
              style={{ margin: '20px 20px 0 0' }}
              type="primary"
              size={'large'}
            >
              Check last transaction
            </Button>
          </a>
        </Link>
      )}
    </>
  );
};

export { EthereumBill };
