import { Button, Col, Form, Input, Statistic } from 'antd';
import { AreaChartOutlined, ClockCircleOutlined, CommentOutlined, UserOutlined } from '@ant-design/icons';
import { CSPRtoUSD } from '../../../../../../utils/CSPRtoUSD';
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';
import { useEtherBalance, useEthers, useSendTransaction } from '@usedapp/core';
import { formatEther } from 'ethers/lib/utils';
import { utils } from 'ethers';
import { RINKEBY_SCAN_URL } from '../../../../../../ethConfig/config';

interface EthereumBillProps {
  billInfo: any;
  date: any;
  course: any;
  transaction: any;
  transactionExplorer: any;
}

const EthereumBill: FC<EthereumBillProps> = ({ billInfo, date, course, transaction, transactionExplorer }) => {
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { activateBrowserWallet, account } = useEthers();
  const { sendTransaction, state } = useSendTransaction({ transactionName: 'Send Ethereum' });
  const etherBalance = useEtherBalance(account);
  const [form] = Form.useForm();
  const sendEth = async () => {
    await sendTransaction({ to: billInfo.store?.wallet, value: utils.parseEther(`${billInfo.amount}`), gasLimit: 21048 });
  };

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
          setSuccess(true);
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
              ? `${formatEther(etherBalance).substring(0, 8)} ETH (${(+balance * course).toFixed(2)}$)`
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
          value={`${+billInfo.amount} ETH ($${CSPRtoUSD(+billInfo.amount, course)})`}
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
        {error &&
          <div>
            {error}
          </div>
        }
      </Col>
      {!etherBalance ?
        <Button
          style={{ margin: '20px 20px 0 0' }}
          type="primary"
          size={'large'}
          onClick={activateBrowserWallet}
        >
          Connect to metamask
        </Button> :
        <Button
          style={{ margin: '20px 20px 0 0' }}
          type="primary"
          size={'large'}
          onClick={sendEth}
          disabled={!email}
        >
          Pay
        </Button>
      }
      {success &&
        <Link
          href={`https://${RINKEBY_SCAN_URL}/tx/${transactionExplorer}`}
        >
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
      }
    </>
  );
};

export { EthereumBill };