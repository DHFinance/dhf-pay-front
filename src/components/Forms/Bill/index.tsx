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
 * @description Список известных ошибок
 * @message {string} - строка или часть строки, выдаваемой расширением signer. По ней осуществляется поиск в массиве
 * @title {string} - заголовок оповещения
 * @desc {string} - описание решения проблемы
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
 * @description Компонент кнопки оплаты. Меняет свой функционал в зависимости от состояния соединения с signer
 * @param balance {string} - баланс авторизированного через signer пользователя в cspr. Если баланс есть - значит пользователь подключился к сайту через casper signer и может произвести транзакцию
 * @param click {function} - сюда передается функция подключения к signer
 * @param deploy {function} - сюда передается функция оплаты в signer
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
 * @description Компонент-обертка. В зависимости от значения NEXT_PUBLIC_FAKE_TRANSACTION выдает фейковый компонент оплаты (без использования signer) или настоящий (способный работать с расширением signer)
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
     * @description получение данных с сервера
     */
    useEffect(() => {
        const pathname = window.location.pathname.split('/')
        const id = pathname && pathname[pathname.length - 1]
        /**
         * @description получение платежа, на основе которого составлен чек
         */
        dispatch(getPayment(id))
        /**
         * @description получения курса cspr к usd
         */
        dispatch(getCourse())
    }, [])
    useEffect(() => {
        if (billInfo?.store?.id) {
            /**
             * @description получение магазина, которому пренадлежит платеж
             */
            dispatch(getStore(billInfo?.store?.id))
            /**
             * @description получение последней транзакции, совершенной по этому платежу
             */
            dispatch(getLastTransaction(billInfo?.id))
        }
    }, [billInfo])
    if (isFake) {
        return <WithPageExist error={billInfoError} data={store} >
            <FakeBill billInfo={billInfo} store={store} transaction={transaction} course={course} dispatch={dispatch} router={router}/>
        </WithPageExist>
    }
    return <WithPageExist error={billInfoError} data={store}><CasperBill billInfo={billInfo} course={course} store={store} transaction={transaction} dispatch={dispatch} router={router}/></WithPageExist>
}
/**
 * @description Фейковый компонент. Используется в случае если нужно протестировать приложения без возможности установить соединение с signer
 * @param billInfo {id,
        datetime,
        amount,
        comment,
        status,
        payment,
        type,
        text} - информация о платеже, на основе которого создан чек
 * @param transaction - последняя совершенная по этому платежу транзакция
 * @param course - курс usd к cspr
 */
const FakeBill = ({billInfo, transaction, dispatch, course}) => {

    const [billData, setBillData] = useState(initialState)
    const [sign, setSign] = useState(false)
    const [transactionExplorer, setTransactionExplorer] = useState('')
    const [form] = Form.useForm();


    /**
     * @description захардкоженный хэш транзакции
     */
    const defaultTxHash = 'd7DdAC148B97671859946603915175b46ea976e11D3263C28E2A35075D634789'

    /**
     * @description создание транзакции в обход casper. Использует только захардкоженные и полученные с сервера данные
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
     * @description валидация кошелька. Происходит с помощью функции CLPublicKey.fromHex, которая возвращает ошибку если кошелек не валиден
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
     * @description запись данных из формы в состояние
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
        text} - информация о платеже, на основе которого создан чек
 * @param transaction - последняя совершенная по этому платежу транзакция
 * @param store - магазин, которому пренадлежит платеж
 * @param course - курс cspr к usd
 * @description Компонент позволяющий работать с casper signer
 */
const CasperBill = ({billInfo, transaction, dispatch, router, store, course}) => {

    const [balance, setBalance] = useState('')
    const [balanceUsd, setBalanceUsd] = useState('')
    const [transactionExplorer, setTransactionExplorer] = useState('')
    const [email, setEmail] = useState('')
    const [form] = Form.useForm();

    /**
     * @description - вызов оповещений при ошибках расширения casper signer
     * @param message {string} - ответ, который вернул signer. По нему происходит поиск совпадений в signerErrors
     */
    const showError = (message: string) => {
        console.log('Signer connection:', message)
        /**
         *
         * @description поиск совпадений в signerErrors
         */
        const errors = signerErrors.filter(error => {
            return message.includes(error.message)
        })
        /**
         *
         * @description если ошибка изветсна - вызвать оповещение с методом ее решения. Иначе вызвать оповещение с title = 'Unknown error' desc = 'Unknown error'
         */
        if (errors.length) {
            return openNotification(errors[0].title, errors[0].desc)
        } else {
            return openNotification()
        }
    }


    /**
     * @description вызов оповещения о ошибках или состоянии singer
     * @param title {string} - заголовок
     * @param desc {string} - описание или метод решения ошибк
     */
    const openNotification = (title = 'Unknown error', desc = 'Unknown error') => {

        notification.open({
            message: title,
            description: desc,
        });
    };

    /**
     * @const apiUrl {string} - url узла, в котором будут обрабатываться совершенные операции
     * @const casperService - позволяет нам получать данные пользователя из расширения casper signer
     * @const casperClient - позволяет нам работать с сетью casper
     */
    const apiUrl = process.env.NEXT_PUBLIC_CASPER_NODE;
    const casperService = new CasperServiceByJsonRPC(apiUrl);
    const casperClient = new CasperClient(apiUrl);

    /**
     * @description вход и соединение с signer. Обращается к расширению signer и открывает его в новом окне браузера. Требуется вызвать дважды, если signer не разблокирован. Выдает ошибки с помощью showError. Если пользователь разрешил соединение - запрашивает баланс
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
     * @description функция оплаты платежа. Передает все данные из billInfo и store в casper, который генерирует счет на оплату
     * @const to {string} - уникальный кошелек получателя, введенный при создании магазина
     * @const ttl {num} - время, затрачиваемое на транзакцию в миллисекундах
     * @const gasPrice {num} - коммиссия за транзакцию
     * @const id {num} - id транзакции в сети casper
     */
    const deploy = async ()=> {
        const to = store.wallet;
        const amountStr = amount.toString()
        const amountNum = amount;
        const id = 287821;
        const gasPrice = 1;
        const ttl = 1800000;
        /**
         * @description проверка валидности введенного email плательщика. Транзакция может быть проведена только если email указан и валиден
         */
        await form.validateFields()
            .then(async () => {
                try {
                    /**
                     * @description создание или получение всех необходимых для транзакции данных
                     * @const publicKeyHex - получение публичного ключа плательщика из его casper signer
                     * @const publicKey - дешифровка ключа
                     * @const deployParams - формирование параметров платежа
                     * @const toPublicKey - публичный ключ получателя. Хранится в магазине, которому пренадлежит платеж
                     * @const session - создание сессии
                     * @const payment  - создание платежа в casper network
                     * @const deploy - развертывание платежа в casper network
                     * @const json - конвертация в json
                     * @const signature - вызов окна в расширении signer с информацией о сформированном платеже в casper network
                     * @const deployObject - конвертация из json
                     * @const signed - подтверждение и отправка платежа на обработку в сеть casper
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
                         * @description после успешной транзакции создается запись о ней в базе данных
                         * @param txHash {string} - хэш транзакции. По нему можно отследидть транзакцию
                         * @param status {string} - статус платежа. Всегда processing. Задается на фронте так как только фронт знает какой режим bill включен (casper or fake)
                         * @param email {string} - полчта плательщика
                         * @param payment {payment || id} - данные о платеже, по которому проходила транзакция
                         * @param sender {string} - публичный ключ плательщика
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
     * @description получение баланса
     * @const publicKeyHex - получение публичного ключа плательщика из его casper signer
     * @const balance - баланс получателя в cspr. Использовать .toString() чтобы привести в читаемый формат
     * @const CSPRtoUSD - конвертация баланса из cspr в usd
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
     * @description получение баланса
     * @const datetime {date} - время последнего обновления payment
     * @const amount {string} - сумма платежа в cspr
     * @const comment {string} - комментарий к платежу
     * @const status {string} - статус платежа Paid, Not_Paid, Particularly_Paid
     * @const type {number} - id типа стиля кнопки (если она есть). Если кнопка есть - транзакцию по этому платежу можно совершать неограниченное количество раз
     * @const text {string} - текст кнопки (если она есть). Если кнопка есть - транзакцию можно совершать неограниченное количество раз
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
                 * @description Если уже есть совершенная транзакция - выводится кнопка, позволяющая посмотреть эту транзакции в сети casper
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
                 * @description для платежей с привязанной к ним кнопкой можно совершать бесконечное количество транзакций. Для invoices можно совершить только одну транзакцию, после чего запрещается делать новые транзакции. Еще одну транзакцию можно совершить только если предыдущая транзакция была неуспешной
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