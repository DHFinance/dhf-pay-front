import {
  AreaChartOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  UserOutlined,
} from '@ant-design/icons';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import CasperApp from '@zondax/ledger-casper';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'regenerator-runtime/runtime';
// @ts-ignore
import * as CasperServices from '@casperholders/core';
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Select,
  Statistic,
} from 'antd';
import axios from 'axios';
import {
  CasperClient,
  CasperServiceByJsonRPC,
  CLPublicKey,
  DeployUtil,
} from 'casper-js-sdk';
import { Deploy } from 'casper-js-sdk/dist/lib/DeployUtil';
import Link from 'next/link';
import React, { FC, useState } from 'react';
import { getUsdFromCrypto } from '../../../../../../utils/getUsdFromCrypto';
import { signerErrors } from '../../../../../errors/signerErrors';
import { useTypedDispatch } from '../../../../../hooks/useTypedDispatch';
import { Payment } from '../../../../../interfaces/payment.interface';
import { Transaction } from '../../../../../interfaces/transaction.interface';
import { pay } from '../../../../../store/slices/pay/asyncThunks/pay';
import { setCasperData } from '../../../../../store/slices/pay/pay.slice';
import StatusButtonPay from '../StatusButtonPay';

const { Option } = Select;

const USD_CSPR_API =
  'https://api.coingecko.com/api/v3/simple/price?ids=casper-network&vs_currencies=usd';

interface Props {
  billInfo: any;
  transaction: Transaction;
  payment: Payment;
  course: number;
}

/**
 * @param billInfo {id,
        datetime,
        amount,
        comment,
        status,
        payment,
        type,
        text} - information about the payment on the basis of which the receipt was created
 * @param transaction - last transaction for this payment
 * @param store - the store that owns the payment
 * @param course - cspr to usd exchange rate
 * @description A component that allows you to work with casper signer
 */
const CasperBill: FC<Props> = ({ billInfo, transaction, payment, course }) => {
  const [balance, setBalance] = useState('');
  const [ledgerWallets, setLedgerWallets] = useState<any[]>([]);
  const [isTimeToConfirmOnLedger, setIsTimeToConfirmOnLedger] = useState(false);
  const [isLedgerLoading, setIsLedgerLoading] = useState(false);
  const [balanceUsd, setBalanceUsd] = useState('');
  const [transactionExplorer, setTransactionExplorer] = useState('');
  const [email, setEmail] = useState('');

  const [form] = Form.useForm();
  const dispatch = useTypedDispatch();

  /**
   * @const apiUrl {string} - url of the node where completed operations will be processed
   * @const casperService - allows us to get user data from the casper signer extension
   * @const casperClient - allows us to work with the casper network
   */
  const apiUrl = process.env.NEXT_PUBLIC_CASPER_NODE as string;
  const casperService = new CasperServiceByJsonRPC(apiUrl);
  const casperClient = new CasperClient(apiUrl);

  /**
   * @description call singer error or status alert
   * @param title {string} - title
   * @param desc {string} - description or method for solving errors
   */
  const openNotification = (
    title = 'Unknown error',
    desc = 'Unknown error',
  ) => {
    notification.open({
      message: title,
      description: desc,
    });
  };

  /**
   * @description - call alerts on casper signer extension errors
   * @param message {string} is the response returned by signer. It searches for matches in signerErrors
   */
  const showError = (message: string) => {
    const errors = signerErrors.filter((error: any) => {
      return message.includes(error.message);
    });
    if (errors.length) {
      return openNotification(errors[0].title, errors[0].desc);
    } else {
      return openNotification();
    }
  };

  /**
   * @description getting balance
   * @const publicKeyHex - getting the payer's public key from his casper signer
   * @const balance - recipient's balance in cspr. Use .toString() to convert to readable format
   * @const CSPRtoUSD - balance conversion from cspr to usd
   */
  const getBalance = async () => {
    const publicKeyHex = await window.casperlabsHelper.getActivePublicKey();
    const latestBlock = await casperService.getLatestBlockInfo();
    const root = await casperService.getStateRootHash(latestBlock.block?.hash);

    const balanceUref = await casperService.getAccountBalanceUrefByPublicKey(
      root,
      CLPublicKey.fromHex(publicKeyHex),
    );
    const accountBalance = await casperService.getAccountBalance(
      latestBlock.block?.header.state_root_hash as string,
      balanceUref,
    );
    const hash = await casperService.getStateRootHash(
      latestBlock.block?.header.state_root_hash,
    );

    try {
      const csprCourse = await axios.get(USD_CSPR_API);
      const CSPRtoUSDCourse = (
        (+accountBalance / 1000000000) *
        csprCourse.data['casper-network'].usd
      ).toFixed(2);
      setBalanceUsd(CSPRtoUSDCourse.toString());
      setBalance(accountBalance.toString());

      dispatch(
        setCasperData({
          usd: CSPRtoUSDCourse,
          cspr: csprCourse.toString(),
          hash,
          public: publicKeyHex,
        }),
      );
    } catch (e) {
      console.log('cant get casper price');
    }
  };

  /**
   * @description sign in and connect with signer. Accesses the signer extension and opens it in a new browser window. Must be called twice if signer is not unlocked. Throws errors with showError. If the user has allowed the connection - asks for the balance
   */
  const singInSigner = async () => {
    if (window.casperlabsHelper) {
      try {
        await window.casperlabsHelper.requestConnection();
        await getBalance();
      } catch (e: any) {
        showError(e.message);
      }
    } else {
      showError('Please download CasperLabs Signer');
    }
  };

  /**
   * @description payment payment function. Passes all data from billInfo and store to casper, which generates an invoice for payment
   * @const to {string} - the recipient's unique wallet entered when creating the store
   * @const ttl {num} - time spent on the transaction in milliseconds
   * @const gasPrice {num} - transaction fee
   * @const id {num} - transaction id in the casper network
   */
  const deploy = async () => {
    const to = payment.store?.wallets.find((wallet) => wallet.currency === billInfo.currency);
    
    if (!to) {
      return;
    }
    
    const amountStr = billInfo.amount.toString();
    const amountNum = billInfo.amount;
    const id = 287821;
    const gasPrice = 1;
    const ttl = 1800000;
    /**
     * @description checking the validity of the entered payer email. The transaction can be carried out only if the email is specified and valid
     */
    try {
      await form.validateFields();
      try {
        /**
         * @description create or get all the data needed for the transaction
         * @const publicKeyHex - getting the payer's public key from his casper signer
         * @const publicKey - key decryption
         * @const deployParams - generation of payment parameters
         * @const toPublicKey - recipient's public key. Stored in the store that owns the payment
         * @const session - session creation
         * @const payment - creating a payment in casper network
         * @const deploy - payment deployment in casper network
         * @const json - convert to json
         * @const signature - call a window in the signer extension with information about the generated payment in the casper network
         * @const deployObject - conversion from json
         * @const signed - confirmation and sending the payment for processing to the casper network
         */
        const publicKeyHex = await window.casperlabsHelper.getActivePublicKey();
        const publicKey = CLPublicKey.fromHex(publicKeyHex);
        let deployParams = new DeployUtil.DeployParams(
          publicKey,
          process.env.NEXT_PUBLIC_CASPER_CHAIN_NAME as string,
          gasPrice,
          ttl,
        );
        const toPublicKey = CLPublicKey.fromHex(to.value);
        const session = DeployUtil.ExecutableDeployItem.newTransfer(
          amountStr,
          toPublicKey,
          null,
          id,
        );
        DeployUtil.standardPayment(amountNum);
        const localDeploy = DeployUtil.makeDeploy(deployParams, session, billInfo.payment);
        const json = DeployUtil.deployToJson(localDeploy);
        const signature = await window.casperlabsHelper.sign(
          json,
          publicKeyHex,
          to.value,
        );
        const deployObject = DeployUtil.deployFromJson(signature);
        
        const signed = await casperClient
          .putDeploy(deployObject.val as Deploy)
          .catch((e) => showError(e.message));
        if (signed) {
          openNotification(
            'Transaction completed',
            'The transaction will be processed as soon as possible',
          );
        } else {
          openNotification(
            'Transaction error',
            'Your transaction has not been completed, please try again',
          );
        }
        try {
          await dispatch(
            pay({
              txHash: signed,
              email,
              payment: {
                id: billInfo.id,
              },
              sender: publicKeyHex,
            }),
          );
        } catch (e) {
          showError('Transaction aborted');
        }
        setTransactionExplorer(signed || '');
      } catch (e: any) {
        showError(e.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const date = new Date(billInfo.datetime).toDateString();

  const connectLedger = async () => {
    setIsLedgerLoading(true);
    const transport = await TransportWebUSB.create();
    const app = new CasperApp(transport);
    const client = new CasperServices.ClientCasper(
      process.env.NEXT_PUBLIC_CASPER_NODE,
    );

    const wallets = [];
    try {
      for (let i = 0; i < 5; i++) {
        const pdAddr = await app.getAddressAndPubKey("m/44'/506'/0'/0/" + i);
        const ledgerPbId = `02${pdAddr.publicKey.toString('hex')}`;
        const balanceService = new CasperServices.Balance(
          {
            activeKey: pdAddr.publicKey.toString('hex'),
          },
          client,
        );
        const balanceR = await balanceService.fetchBalanceOfPublicKey(
          ledgerPbId,
        );

        wallets.push({
          path: i,
          wallet: ledgerPbId,
          balance: balanceR,
        });
        setLedgerWallets(wallets);
      }
    } catch (e) {
      openNotification(
        'Ledger connection error',
        'Please open Casper app on ledger and check if ledger connected to this site and not to other.',
      );
    }

    setIsLedgerLoading(false);
  };

  const connectWallet = async () => {
    await form.validateFields();

    const transport = await TransportWebUSB.create();

    const app = new CasperApp(transport);
    const pdAddr = await app.getAddressAndPubKey("m/44'/506'/0'/0/0");
    if (!pdAddr?.publicKey) {
      openNotification('Please select casper app in ledger');
      return;
    }
    const ledgerPbId = `02${pdAddr.publicKey.toString('hex')}`;
    const client = new CasperServices.ClientCasper(
      process.env.NEXT_PUBLIC_CASPER_NODE,
    );
    const balanceService = new CasperServices.Balance(
      {
        activeKey: pdAddr.publicKey.toString('hex'),
      },
      client,
    );
    await balanceService.fetchBalanceOfPublicKey(ledgerPbId);

    const to = payment.store?.wallets.find((wallet) => wallet.currency === billInfo.currency);
    
    if (!to) {
      return;
    }
    
    const amountStr = (billInfo.amount / 1000000000).toString();

    const publicKeyHex = pdAddr.publicKey.toString('hex');

    const CS = CasperServices;

    const transferDeployParameters =
      new CasperServices.TransferDeployParameters(
        ledgerPbId, //'020235d1b81cd76096cd490af1fcff5ea23d2bf96e78e7fa0de3aca8bee8021ef657', //from
        process.env.NEXT_PUBLIC_CASPER_CHAIN_NAME, //network
        amountStr, //"25", // amount is cspr
        to.value, //'01a35887f3962a6a232e8e11fa7d4567b6866d68850974aad7289ef287676825f6', //to
        '1200', // memo
        '2',
      ); // ttl

    const localDeploy = transferDeployParameters.makeDeploy;
    setIsTimeToConfirmOnLedger(true);
    const deploySigned = await CS.LedgerSigner.sign(localDeploy, {
      app: app,
      publicKey: ledgerPbId, //'020235d1b81cd76096cd490af1fcff5ea23d2bf96e78e7fa0de3aca8bee8021ef657',
      keyPath: '0',
    });
    const signed = await casperClient.putDeploy(deploySigned);

    setIsTimeToConfirmOnLedger(false);

    if (signed) {
      openNotification(
        'Transaction completed',
        'The transaction will be processed as soon as possible',
      );
    } else {
      openNotification(
        'Transaction error',
        'Your transaction has not been completed, please try again',
      );
    }
    try {
      await dispatch(
        pay({
          txHash: signed,
          email,
          payment: {
            id: billInfo.id,
          },
          sender: publicKeyHex,
        }),
      );
    } catch (e: any) {
      showError('Transaction aborted');
    }
    setTransactionExplorer(signed || '');
  };

  return (
    <>
      {billInfo?.cancelled && (
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
      )}
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic
          title="Your Balance"
          value={
            balance
              ? `${+balance / 1000000000} CSPR ($${balanceUsd})`
              : 'Sign in Signer to get balance'
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
          value={`${+billInfo.amount / 1000000000} ${payment.currency} ($${getUsdFromCrypto(+billInfo.amount, course)})`}
          prefix={<AreaChartOutlined />}
        />
      </Col>
      <Col
        span={24}
        style={{ padding: '20px 0 20px 20px', background: 'white' }}
      >
        <Statistic
          title="Comment"
          value={billInfo?.comment || 'none'}
          prefix={<CommentOutlined />}
        />
      </Col>
      {billInfo?.status !== 'Paid' ? (
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
        </Col>
      ) : null}

      {
        /**
         * @description If there is already a completed transaction, a button is displayed that allows you to view this transaction in the casper network
         */
        transaction?.txHash ? (
          <Link
            href={`https://${process.env.NEXT_PUBLIC_CASPER_NETWORK}/deploy/${transaction?.txHash}`}
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
        ) : billInfo?.payment?.transaction?.txHash ? (
          <Link
            href={`https://${process.env.NEXT_PUBLIC_CASPER_NETWORK}/deploy/${billInfo?.payment?.transaction?.txHash}`}
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
        ) : transactionExplorer ? (
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
        ) : null
      }

      {!billInfo?.cancelled &&
      /**
         * @description for payments with a button attached to them, you can make an infinite number of transactions. For invoices, you can make only one transaction, after which it is forbidden to make new transactions. Another transaction can be made only if the previous transaction was unsuccessful
         */

        ledgerWallets.length === 0 &&
        (billInfo?.type && billInfo?.text ? (
          <StatusButtonPay
            balance={balance}
            click={singInSigner}
            deploy={deploy}
          />
        ) : billInfo?.status !== 'Paid' &&
          transaction?.status !== 'processing' &&
          transaction?.status !== 'success' &&
          !billInfo?.payment?.transaction?.txHash &&
          !transactionExplorer ? (
          <StatusButtonPay
            balance={balance}
            click={singInSigner}
            deploy={deploy}
          />
          ) : null)}
      {transactionExplorer === '' &&
        ledgerWallets.length > 0 &&
        billInfo?.status !== 'Paid' &&
        !billInfo?.cancelled && (
          <>
            <Select
              defaultValue={ledgerWallets[0].path}
              style={{ width: 'auto' }}
              loading={isLedgerLoading}
              size={'large'}
            >
              {ledgerWallets.map((wallet) => {
                return (
                  <Option key={wallet.wallet} value={wallet.path}>
                    {wallet.wallet} ({wallet.balance} CSPR)
                  </Option>
                );
              })}
            </Select>
            <Button
              style={{ margin: '20px 20px 0 20px' }}
              disabled={isTimeToConfirmOnLedger}
              type="primary"
              size={'large'}
              onClick={connectWallet}
            >
              {isTimeToConfirmOnLedger
                ? 'Confirm transaction on ledger'
                : 'Sign with ledger'}
            </Button>
          </>
      )}

      {ledgerWallets.length === 0 && !billInfo?.cancelled && (
        <Button
          loading={isLedgerLoading}
          style={{ margin: '20px 20px 0 0' }}
          type="primary"
          size={'large'}
          onClick={connectLedger}
        >
          {isLedgerLoading ? 'Loading..' : 'Connect ledger'}
        </Button>
      )}
    </>
  );
};

export default CasperBill;
