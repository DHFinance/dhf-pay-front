import {
  AreaChartOutlined,
  ClockCircleOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import { Button, Col, Form, Input, Statistic } from 'antd';
import { CLPublicKey } from 'casper-js-sdk';
import Link from 'next/link';
import React, { FC, useState } from 'react';
import { CSPRtoUSD } from '../../../../../../utils/CSPRtoUSD';
import { useTypedDispatch } from '../../../../../hooks/useTypedDispatch';
import { pay } from '../../../../../store/slices/pay/asyncThunks/pay';

interface Props {
  billInfo: any;
  transaction: any;
  course: any;
}

const initialState = {
  email: '',
  wallet: '',
};

/**
 * @description fake component. Used if you need to test applications without the ability to establish a connection with the signer
 * @param billInfo {id,
        datetime,
        amount,
        comment,
        status,
        payment,
        type,
        text} - information about the payment on the basis of which the receipt was created
 * @param transaction - last transaction for this payment
 * @param course - usd to cspr exchange rate
 */
const FakeBill: FC<Props> = ({ billInfo, transaction, course }) => {
  const [billData, setBillData] = useState(initialState);
  const [sign, setSign] = useState(false);
  const [transactionExplorer, setTransactionExplorer] = useState('');
  const [form] = Form.useForm();
  const dispatch = useTypedDispatch();

  /**
   * @description hardcoded transaction hash
   */
  const defaultTxHash =
    'd7DdAC148B97671859946603915175b46ea976e11D3263C28E2A35075D634789';

  /**
   * @description creating a transaction bypassing casper. Uses only hardcoded data received from the server
   */
  const deploy = async () => {
    try {
      await form.validateFields();
      await dispatch(
        pay({
          txHash: defaultTxHash,
          status: 'fake_processing',
          email: billData.email,
          payment: billInfo,
          sender: billData.wallet,
        }),
      );
      setTransactionExplorer(defaultTxHash);
    } catch (error) {
      console.log(error);
    }
  };

  const { datetime, amount, comment, status, payment } = billInfo;

  const date = new Date(datetime).toDateString();

  /**
   * @description wallet validation. Occurs with the help of the CLPublicKey.fromHex function, which returns an error if the wallet is not valid
   */
  const validateWallet = (rule: any, value: any, callback: any) => {
    if (value) {
      try {
        CLPublicKey.fromHex(value);
        callback();
      } catch (e) {
        callback('This wallet not exist!');
      }
    } else {
      callback();
    }
  };

  /**
   * @description writing form data to state
   */
  const onChangeBillData = (field: string) => (e: any) => {
    const value = e.target.value;
    setBillData({
      ...billData,
      [field]: value,
    });
  };

  return (
    <>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic
          title="Your Balance"
          value={'Sign in Signer to get balance'}
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
          value={`${amount} CSPR ($${CSPRtoUSD(amount, course)})`}
          prefix={<AreaChartOutlined />}
        />
      </Col>
      <Col
        span={24}
        style={{ padding: '20px 0 20px 20px', background: 'white' }}
      >
        <Statistic
          title="Comment"
          value={comment}
          prefix={<CommentOutlined />}
        />
      </Col>
      {status !== 'Paid' ? (
        <Col
          span={24}
          style={{ padding: '20px 0 20px 20px', background: 'white' }}
        >
          <Form
            name="email"
            initialValues={{ remember: true }}
            labelCol={{ span: 1 }}
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
                onChange={onChangeBillData('email')}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              label="Wallet"
              name="wallet"
              rules={[
                { required: true, message: 'Please input wallet!' },
                { validator: validateWallet },
              ]}
            >
              <Input
                style={{ width: 400 }}
                onChange={onChangeBillData('wallet')}
                placeholder="Your wallet"
              />
            </Form.Item>
          </Form>
        </Col>
      ) : null}

      {transactionExplorer ? (
        <Link
          href={`https://${process.env.NEXT_PUBLIC_CASPER_NETWORK}/deploy/${transactionExplorer}`}
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
      ) : lastTransaction.length ? (
        <Link
          href={`https://${process.env.NEXT_PUBLIC_CASPER_NETWORK}/deploy/${
            lastTransaction[lastTransaction.length - 1].txHash
          }`}
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
      ) : payment?.transaction?.txHash ? (
        <Link
          href={`https://${process.env.NEXT_PUBLIC_CASPER_NETWORK}/deploy/${payment?.transaction?.txHash}`}
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
      ) : null}

      {status !== 'Paid' &&
      !transaction?.id &&
      !payment?.transaction?.txHash &&
      !payment?.cancelled ? (
          !sign ? (
          <Button
            onClick={() => setSign(true)}
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
          )
        ) : null}
    </>
  );
};

export default FakeBill;
