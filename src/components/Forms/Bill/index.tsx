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


/**
 * @description List of known bugs
 * @message {string} - the string or part of a string returned by the signer extension. It is searched in an array
 * @title {string} - alert title
 * @desc {string} - description of the solution to the problem
 */
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

/**
 * @description Payment button component. Changes its functionality depending on the state of connection with signer
 * @param balance {string} - the balance of the user authorized through the signer in cspr. If there is a balance, then the user has connected to the site through casper signer and can make a transaction
 * @param click {function} - the signer connection function is passed here
 * @param deploy {function} - the payment function in signer is passed here
 */
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

/**
 *
 * @description wrapper component. Depending on the value of NEXT_PUBLIC_FAKE_TRANSACTION, it will issue a fake payment component (without using a signer) or a real one (capable of working with the signer extension)
 */
const Bill = () => {
    const isFake = process.env.NEXT_PUBLIC_FAKE_TRANSACTION === '1'
    const course = useSelector((state) => state.course.data.usd);
    const billInfo = useSelector((state) => state.payment.data);
    const transaction = useSelector((state) => state.transaction.data);
    const billInfoError = useSelector((state) => state.payment.error);
    const store = useSelector((state) => state.storeData.data);
    const dispatch = useDispatch();
    const router = useRouter();
    /**
     * @description getting data from the server
     */
    useEffect(() => {
        const pathname = window.location.pathname.split('/')
        const id = pathname && pathname[pathname.length - 1]
        /**
         * @description receipt of the payment on the basis of which the check is drawn up
         */
        dispatch(getPayment(id))
        /**
         * @description getting cspr rate to usd
         */
        dispatch(getCourse())
    }, [])
    useEffect(() => {
        if (billInfo?.store?.id) {
            // /**
            //  * @description receiving the store that owns the payment
            //  */
            // dispatch(getStore(billInfo?.store?.id))
            /**
             * @description receiving the last transaction made for this payment
             */
            dispatch(getLastTransaction(billInfo?.id))
        }
    }, [billInfo])
    if (isFake) {
        return <WithPageExist error={billInfoError} data={billInfo} >
            <FakeBill billInfo={billInfo} store={store} transaction={transaction} course={course} dispatch={dispatch} router={router}/>
        </WithPageExist>
    }
    return <WithPageExist error={billInfoError} data={billInfo}><CasperBill billInfo={billInfo} course={course} store={billInfo} transaction={transaction} dispatch={dispatch} router={router}/></WithPageExist>
}
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
const FakeBill = ({billInfo, transaction, dispatch, course}) => {

    const [billData, setBillData] = useState(initialState)
    const [sign, setSign] = useState(false)
    const [transactionExplorer, setTransactionExplorer] = useState('')
    const [form] = Form.useForm();


    /**
     * @description hardcoded transaction hash
     */
    const defaultTxHash = 'd7DdAC148B97671859946603915175b46ea976e11D3263C28E2A35075D634789'

    /**
     * @description creating a transaction bypassing casper. Uses only hardcoded data received from the server
     */
    const deploy = async () => {
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


    /**
     * @description wallet validation. Occurs with the help of the CLPublicKey.fromHex function, which returns an error if the wallet is not valid
     */
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

    /**
     * @description writing form data to state
     */
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
                            label="Buyer's email"
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
                <Link href={`https://${process.env.NEXT_PUBLIC_CASPER_NETWORK}/deploy/${transactionExplorer}`}>
                    <a target="_blank" rel="noreferrer">
                        <Button style={{margin: '20px 20px 0 0'}} type="primary" size={'large'}>
                            Check last transaction
                        </Button>
                    </a>
                </Link>
                : lastTransaction.length ?
                    <Link href={`https://${process.env.NEXT_PUBLIC_CASPER_NETWORK}/deploy/${lastTransaction[lastTransaction.length - 1].txHash}`}>
                        <a target="_blank" rel="noreferrer">
                            <Button style={{margin: '20px 20px 0 0'}} type="primary" size={'large'}>
                                Check last transaction
                            </Button>
                        </a>
                    </Link>
                    : payment?.transaction?.txHash ?
                        <Link href={`https://${process.env.NEXT_PUBLIC_CASPER_NETWORK}/deploy/${payment?.transaction?.txHash}`}>
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
const CasperBill = ({billInfo, transaction, dispatch, router, store, course}) => {
  console.log(store);

    const [balance, setBalance] = useState('')
    const [balanceUsd, setBalanceUsd] = useState('')
    const [transactionExplorer, setTransactionExplorer] = useState('')
    const [email, setEmail] = useState('')
    const [form] = Form.useForm();

    /**
     * @description - call alerts on casper signer extension errors
     * @param message {string} is the response returned by signer. It searches for matches in signerErrors
     */
    const showError = (message: string) => {
        console.log('Signer connection:', message)
        /**
         *
         * @description search for matches in signerErrors
         */
        const errors = signerErrors.filter(error => {
            return message.includes(error.message)
        })
        /**
         *
         * @description if the error is known - trigger an alert with a method to solve it. Otherwise trigger an alert with title = 'Unknown error' desc = 'Unknown error'
         */
        if (errors.length) {
            return openNotification(errors[0].title, errors[0].desc)
        } else {
            return openNotification()
        }
    }


    /**
     * @description call singer error or status alert
     * @param title {string} - title
     * @param desc {string} - description or method for solving errors
     */
    const openNotification = (title = 'Unknown error', desc = 'Unknown error') => {

        notification.open({
            message: title,
            description: desc,
        });
    };

    /**
     * @const apiUrl {string} - url of the node where completed operations will be processed
     * @const casperService - allows us to get user data from the casper signer extension
     * @const casperClient - allows us to work with the casper network
     */
    const apiUrl = process.env.NEXT_PUBLIC_CASPER_NODE;
    const casperService = new CasperServiceByJsonRPC(apiUrl);
    const casperClient = new CasperClient(apiUrl);

    /**
     * @description sign in and connect with signer. Accesses the signer extension and opens it in a new browser window. Must be called twice if signer is not unlocked. Throws errors with showError. If the user has allowed the connection - asks for the balance
     */
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

    /**
     * @description payment payment function. Passes all data from billInfo and store to casper, which generates an invoice for payment
     * @const to {string} - the recipient's unique wallet entered when creating the store
     * @const ttl {num} - time spent on the transaction in milliseconds
     * @const gasPrice {num} - transaction fee
     * @const id {num} - transaction id in the casper network
     */
    const deploy = async ()=> {
        const to = store.store.wallet;
        const amountStr = amount.toString()
        const amountNum = amount;
        const id = 287821;
        const gasPrice = 1;
        const ttl = 1800000;
        /**
         * @description checking the validity of the entered payer email. The transaction can be carried out only if the email is specified and valid
         */
        await form.validateFields()
            .then(async () => {
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
                        /**
                         * @description after a successful transaction, a record about it is created in the database
                         * @param txHash {string} - transaction hash. You can track the transaction on it.
                         * @param status {string} - payment status. Always processing. It is set on the front, since only the front knows which bill mode is enabled (casper or fake)
                         * @param email {string} - payer's email address
                         * @param payment {payment || id} - data on the payment for which the transaction took place
                         * @param sender {string} - payer's public key
                         */
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

    /**
     * @description getting balance
     * @const publicKeyHex - getting the payer's public key from his casper signer
     * @const balance - recipient's balance in cspr. Use .toString() to convert to readable format
     * @const CSPRtoUSD - balance conversion from cspr to usd
     */
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

    /**
     * @description getting balance
     * @const datetime {date} - last update time payment
     * @const amount {string} - payment amount in cspr
     * @const comment {string} - payment comment
     * @const status {string} - payment status Paid, Not_Paid, Particularly_Paid
     * @const type {number} - button style type id (if any). If there is a button, a transaction for this payment can be made an unlimited number of times
     * @const text {string} - button text (if any). If there is a button, the transaction can be made an unlimited number of times
     */
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
                            label="Buyer's email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }, {type: 'email',  message: 'Please enter a valid email!'}]}
                        >
                            <Input name="email" style={{width: 400}} onChange={(e) => setEmail(e.target.value)} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                        </Form.Item>
                    </Form>
                </Col>
                : null
            }

            {
                /**
                 * @description If there is already a completed transaction, a button is displayed that allows you to view this transaction in the casper network
                 */
                transaction?.txHash ?
                <Link href={`https://${process.env.NEXT_PUBLIC_CASPER_NETWORK}/deploy/${transaction?.txHash}`}>
                    <a target="_blank" rel="noreferrer">
                        <Button style={{margin: '20px 20px 0 0'}} type="primary" size={'large'}>
                            Check last transaction
                        </Button>
                    </a>
                </Link>
                : payment?.transaction?.txHash ?
                    <Link href={`https://${process.env.NEXT_PUBLIC_CASPER_NETWORK}/deploy/${payment?.transaction?.txHash}`}>
                        <a target="_blank" rel="noreferrer">
                            <Button style={{margin: '20px 20px 0 0'}} type="primary" size={'large'}>
                                Check last transaction
                            </Button>
                        </a>
                    </Link>
                    : transactionExplorer ?
                        <Link href={`https://${process.env.NEXT_PUBLIC_CASPER_NETWORK}/deploy/${transactionExplorer}`}>
                            <a target="_blank" rel="noreferrer">
                                <Button style={{margin: '20px 20px 0 0'}} type="primary" size={'large'}>
                                    Check last transaction
                                </Button>
                            </a>
                        </Link>
                        : null
            }


            {
                /**
                 * @description for payments with a button attached to them, you can make an infinite number of transactions. For invoices, you can make only one transaction, after which it is forbidden to make new transactions. Another transaction can be made only if the previous transaction was unsuccessful
                 */
                type && text ?
                <StatusButtonPay balance={balance} click={singInSigner} deploy={deploy} />
                :
                status !== 'Paid' && transaction.status !== 'processing' && transaction.status !== 'success' && !payment?.transaction?.txHash && !transactionExplorer ?
                    <StatusButtonPay balance={balance} click={singInSigner} deploy={deploy} /> : null
            }
        </>
    );
};

export default Bill