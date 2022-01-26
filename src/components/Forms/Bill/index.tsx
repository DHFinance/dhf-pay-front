// @ts-nocheck
import {Statistic, Row, Col, Button, notification, Form, Input} from 'antd';
import {AreaChartOutlined, ClockCircleOutlined, CommentOutlined, LikeOutlined, UserOutlined} from '@ant-design/icons';
import Link from 'next/link'
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {CasperClient, CasperServiceByJsonRPC, CLPublicKey, DeployUtil, Keys} from "casper-js-sdk";
import React, {useEffect, useState} from "react";
import {pay, setCasperData} from "../../../../store/actions/pay";
import {getPayment} from "../../../../store/actions/payment";
import WithPageExist from "../../../../hoc/withPageExist";
import {getStore} from "../../../../store/actions/store";
import {getLastTransaction} from "../../../../store/actions/transaction";
import axios from "axios";
import {CSPRtoUSD} from "../../../../utils/CSPRtoUSD";
import {getCourse} from "../../../../store/actions/course";

const initialState = {
    email: '',
    wallet: ''
}

const signerErrors = [
    //sometimes the extension breaks and stops being called. Only reinstall helps.
    {
        message: 'Cannot read properties of undefined (reading \'error\')',
        title: 'Signer error',
        desc: 'Please reinstall Signer'
    },
    //if password is not entered in vault
    {
        message: 'Please unlock the Signer to read key',
        title: 'Signer in locked',
        desc: 'Please unlock the Signer to read key'
    },
    //if the extension is not downloaded
    {
        message: 'Please download CasperLabs Signer',
        title: 'Signer not found',
        desc: 'Please download CasperLabs Signer'
    },
    //when a transaction request is rejected
    {
        message: 'User Cancelled Signing',
        title: 'Payment cancelled',
        desc: 'You are cancelled payment in Signer'
    },
    //with no storage created, with no account created, with disconnect
    {
        message: 'Please connect to the Signer to read key',
        title: 'Signer vault not found',
        desc: 'Please connect to the Signer to read key'
    },
    //Occurs if the user has not made any transactions or has an empty account
    {
        message: 'state query failed: ValueNotFound("Failed to find base key at path: Key',
        title: 'User not found',
        desc: 'Try to find a top-up on your wallet and repeat the action'
    },
    //The key given by the extension itself is incorrect
    {
        message: 'Invalid public key',
        title: 'Invalid public key',
        desc: 'Invalid public key'
    },
    //Occurs when the Internet is disconnected
    {
        message: 'Failed to fetch',
        title: 'Network error',
        desc: 'Check your internet connection'
    },
    //Occurs when the Internet is disconnected
    {
        message: 'Network error',
        title: 'Network error',
        desc: 'Check your internet connection'
    },
    {
        message: 'Request failed with status code 500',
        title: 'Server error',
        desc: 'Error connecting to the Signer server'
    },
    {
        message: 'Transaction aborted',
        title: 'Transaction aborted',
        desc: 'Check your internet connection'
    },
    {
        message: 'insufficient balance in account',
        title: 'Insufficient balance',
        desc: 'Your account does not have sufficient funds for the transaction'
    },

]

const StatusButtonPay = ({balance, click,deploy}) => {
    return (
    !balance ?
        <Button onClick={click} style={{margin: '20px 20px 0 0'}} type="primary" size={'large'}>
            Sign in Signer
        </Button>
        :
        <Button onClick={deploy} style={{margin: '20px 20px 0 0'}} type="primary" size={'large'}>
            Pay
        </Button>
    )
}

const Bill = () => {
    const isFake = process.env.NEXT_PUBLIC_FAKE_TRANSACTION === '1'
    const course = useSelector((state) => state.course.data.usd);
    const billInfo = useSelector((state) => state.payment.data);
    const transaction = useSelector((state) => state.transaction.data);
    const billInfoError = useSelector((state) => state.payment.error);
    const store = useSelector((state) => state.storeData.data);
    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        const pathname = window.location.pathname.split('/')
        const id = pathname && pathname[pathname.length - 1]
        dispatch(getPayment(id))
        dispatch(getCourse())
    }, [])
    useEffect(() => {
        if (billInfo?.store?.id) {
            dispatch(getStore(billInfo?.store?.id))
            dispatch(getLastTransaction(billInfo?.id))
        }
    }, [billInfo])

    if (isFake) {
        return <WithPageExist error={billInfoError} data={store} >
            <FakeBill billInfo={billInfo} store={store} transaction={transaction} course={course} dispatch={dispatch} router={router}/>
        </WithPageExist>
    }
    return <WithPageExist isPayment error={billInfoError} data={store}><CasperBill billInfo={billInfo} course={course} store={store} transaction={transaction} dispatch={dispatch} router={router}/></WithPageExist>
}

const FakeBill = ({billInfo, transaction, dispatch, router, store, course}) => {

    const [billData, setBillData] = useState(initialState)
    const [sign, setSign] = useState(false)
    const [transactionExplorer, setTransactionExplorer] = useState('')
    const [form] = Form.useForm();
    const defaultTxHash = 'd7DdAC148B97671859946603915175b46ea976e11D3263C28E2A35075D634789'

    const deploy = async ()=> {
        await form.validateFields()
            .then(async (res) => {
                await dispatch(pay({
                    txHash: defaultTxHash,
                    status: "fake_processing",
                    email: billData.email,
                    payment: billInfo,
                    sender: billData.wallet,
                }))
                setTransactionExplorer(defaultTxHash)
            })
            .catch(async (err) => console.log(err))

    };

    const {
        id,
        datetime,
        amount,
        comment,
        status,
        payment,
        type,
        text
    } = billInfo
    const date = new Date(datetime).toDateString()

    const validateWallet = (rule: any, value: any, callback: any) => {
        if (value) {
            try {
                CLPublicKey.fromHex(value)
                callback();
            } catch (e) {
                callback("This wallet not exist!");
            }
        } else {
            callback();
        }
    };

    const onChangeBillData = (field: string) => (e: any) => {
        const value = e.target.value
        setBillData({
            ...billData,
            [field]: value,
        })
    }

    return (
        <>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Your Balance" value={'Sign in Signer to get balance'} prefix={<AreaChartOutlined />} />
            </Col>
            <Col  span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Datetime" value={date} prefix={<ClockCircleOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Amount" value={`${amount} CSPR ($${CSPRtoUSD(amount, course)})`} prefix={<AreaChartOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 20px 20px', background: 'white'}}>
                <Statistic title="Comment" value={comment} prefix={<CommentOutlined />} />
            </Col>
            {status !== 'Paid' ?
                <Col span={24} style={{padding: '20px 0 20px 20px', background: 'white'}}>
                    <Form
                        name="email"
                        initialValues={{ remember: true }}
                        labelCol={{ span: 1 }}
                        wrapperCol={{ span: 12 }}
                        validateTrigger={'onSubmit'}
                        form={form}
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }, {type: 'email',  message: 'Please enter a valid email!'}]}
                        >
                            <Input name="email" style={{width: 400}} onChange={onChangeBillData('email')} placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            label="Wallet"
                            name="wallet"
                            rules={[{ required: true, message: 'Please input wallet!' }, { validator: validateWallet }] }
                        >
                            <Input style={{width: 400}} onChange={onChangeBillData('wallet')} placeholder="Your wallet"/>
                        </Form.Item>
                    </Form>
                </Col>
                : null
            }

            {transactionExplorer ?
                <Link href={`https://testnet.cspr.live/deploy/${transactionExplorer}`}>
                    <a target="_blank" rel="noreferrer">
                        <Button style={{margin: '20px 20px 0 0'}} type="primary" size={'large'}>
                            Check last transaction
                        </Button>
                    </a>
                </Link>
                : lastTransaction.length ?
                    <Link href={`https://testnet.cspr.live/deploy/${lastTransaction[lastTransaction.length - 1].txHash}`}>
                        <a target="_blank" rel="noreferrer">
                            <Button style={{margin: '20px 20px 0 0'}} type="primary" size={'large'}>
                                Check last transaction
                            </Button>
                        </a>
                    </Link>
                    : payment?.transaction?.txHash ?
                        <Link href={`https://testnet.cspr.live/deploy/${payment?.transaction?.txHash}`}>
                            <a target="_blank" rel="noreferrer">
                                <Button style={{margin: '20px 20px 0 0'}} type="primary" size={'large'}>
                                    Check last transaction
                                </Button>
                            </a>
                        </Link>
                        : null
            }

            {   status !== 'Paid' && !transaction?.id && !payment?.transaction?.txHash ?
                (!sign ?
                    <Button onClick={() => setSign(true)} style={{margin: '20px 20px 0 0'}} type="primary" size={'large'}>
                        Sign in Signer
                    </Button>
                    :
                    <Button onClick={deploy} style={{margin: '20px 20px 0 0'}} type="primary" size={'large'}>
                        Pay
                    </Button>) : null
            }
        </>
    );
};

const CasperBill = ({billInfo, transaction, dispatch, router, store, course}) => {

    const [balance, setBalance] = useState('')
    const [balanceUsd, setBalanceUsd] = useState('')
    const [transactionExplorer, setTransactionExplorer] = useState('')
    const [email, setEmail] = useState('')
    const [form] = Form.useForm();

    const showError = (message: string) => {
        console.log('Signer connection:', message)
        const errors = signerErrors.filter(error => {
            return message.includes(error.message)
        })
        if (errors.length) {
            return openNotification(errors[0].title, errors[0].desc)
        } else {
            return openNotification()
        }
    }

    const openNotification = (title = 'Unknown error', desc = 'Unknown error') => {

        notification.open({
            message: title,
            description: desc,
        });
    };

    const apiUrl = 'https://node-clarity-testnet.make.services/rpc';
    const casperService = new CasperServiceByJsonRPC(apiUrl);
    const casperClient = new CasperClient(apiUrl);

    const singInSigner = async () => {
        if (window.casperlabsHelper) {
            try {
                await window.casperlabsHelper.requestConnection().then(r => getBalance().catch((e: TypeError) => showError(e.message)));
            } catch (e: any) {
                showError(e.message)
            }
        } else {
            showError('Please download CasperLabs Signer')
        }
    };

    const deploy = async ()=> {

        const to = store.wallet;
        const amountStr = amount.toString()
        const amountNum = amount;
        const id = 287821;
        const gasPrice = 1;
        const ttl = 1800000;
        await form.validateFields()
            .then(async () => {
                try {
                    const publicKeyHex = await window.casperlabsHelper.getActivePublicKey();
                    const publicKey = CLPublicKey.fromHex(publicKeyHex)
                    let deployParams = new DeployUtil.DeployParams(publicKey,"casper-test",gasPrice,ttl );
                    const toPublicKey = CLPublicKey.fromHex(to);
                    const session = DeployUtil.ExecutableDeployItem.newTransfer( amountStr,toPublicKey,null,id);
                    const payment = DeployUtil.standardPayment(amountNum);
                    const deploy = DeployUtil.makeDeploy(deployParams, session, payment);
                    const json = DeployUtil.deployToJson(deploy)
                    const signature = await window.casperlabsHelper.sign(json,publicKeyHex,to)
                    const deployObject = DeployUtil.deployFromJson(signature)

                    // @ts-ignore
                    const signed = await casperClient.putDeploy(deployObject.val).catch(e => showError(e.message));
                    if (signed) {
                        openNotification('Transaction completed', 'The transaction will be processed as soon as possible')
                    } else {
                        openNotification('Transaction error', 'Your transaction has not been completed, please try again')
                    }
                    try {
                        await dispatch(pay({
                            txHash: signed,
                            status: "processing",
                            email,
                            payment: billInfo,
                            sender: publicKeyHex
                        }))
                        await dispatch(ge)
                    } catch (e) {
                        showError('Transaction aborted')
                    }
                    setTransactionExplorer(signed || '')
                } catch (e: any) {
                    showError(e.message)
                }
            })
            .catch(async (err) => console.log(err))
    };

    const getBalance = async () => {
        const publicKeyHex = await window.casperlabsHelper.getActivePublicKey();

        const latestBlock = await casperService.getLatestBlockInfo();

        const root = await casperService.getStateRootHash(latestBlock.block.hash);

        const balanceUref = await casperService.getAccountBalanceUrefByPublicKey(
            root,
            CLPublicKey.fromHex(publicKeyHex)
        )
        const balance = await casperService.getAccountBalance(
            latestBlock.block.header.state_root_hash,
            balanceUref
        );
        const hash = await casperService.getStateRootHash(
            latestBlock.block.header.state_root_hash,
            balanceUref
        );
        const course = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=casper-network&vs_currencies=usd')
        const CSPRtoUSD = ((balance/1000000000) * course.data['casper-network'].usd).toFixed(2)
        setBalanceUsd(CSPRtoUSD.toString())
        setBalance(balance.toString())

        dispatch(setCasperData({usd: CSPRtoUSD, cspr: balance.toString(), hash, public: publicKeyHex}))
    };

    const {
        id,
        datetime,
        amount,
        comment,
        status,
        payment,
        type,
        text
    } = billInfo
    const date = new Date(datetime).toDateString()

    return (
        <>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Your Balance" value={balance ? `${balance} CSPR ($${balanceUsd})` : 'Sign in Signer to get balance'} prefix={<AreaChartOutlined />} />
            </Col>
            <Col  span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Datetime" value={date} prefix={<ClockCircleOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Amount" value={`${amount} CSPR ($${CSPRtoUSD(amount, course)})`} prefix={<AreaChartOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 20px 20px', background: 'white'}}>
                <Statistic title="Comment" value={comment || 'none'} prefix={<CommentOutlined />} />
            </Col>
            {status !== 'Paid' ?
                <Col span={24} style={{padding: '20px 0 20px 20px', background: 'white'}}>
                    <Form
                        name="email"
                        initialValues={{ remember: true }}
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 12 }}
                        validateTrigger={'onSubmit'}
                        form={form}
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }, {type: 'email',  message: 'Please enter a valid email!'}]}
                        >
                            <Input name="email" style={{width: 400}} onChange={(e) => setEmail(e.target.value)} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                        </Form.Item>
                    </Form>
                </Col>
                : null
            }

            {transaction?.txHash ?
                <Link href={`https://testnet.cspr.live/deploy/${transaction?.txHash}`}>
                    <a target="_blank" rel="noreferrer">
                        <Button style={{margin: '20px 20px 0 0'}} type="primary" size={'large'}>
                            Check last transaction
                        </Button>
                    </a>
                </Link>
                : payment?.transaction?.txHash ?
                    <Link href={`https://testnet.cspr.live/deploy/${payment?.transaction?.txHash}`}>
                        <a target="_blank" rel="noreferrer">
                            <Button style={{margin: '20px 20px 0 0'}} type="primary" size={'large'}>
                                Check last transaction
                            </Button>
                        </a>
                    </Link>
                    : transactionExplorer ?
                        <Link href={`https://testnet.cspr.live/deploy/${transactionExplorer}`}>
                            <a target="_blank" rel="noreferrer">
                                <Button style={{margin: '20px 20px 0 0'}} type="primary" size={'large'}>
                                    Check last transaction
                                </Button>
                            </a>
                        </Link>
                        : null
            }

            {type && text ?
                <StatusButtonPay balance={balance} click={singInSigner} deploy={deploy} />
                :
                status !== 'Paid' && transaction.status !== 'processing' && transaction.status !== 'success' && !transaction?.txHash && !payment?.transaction?.txHash && !transactionExplorer ?
                    <StatusButtonPay balance={balance} click={singInSigner} deploy={deploy} /> : null
            }
        </>
    );
};

export default Bill