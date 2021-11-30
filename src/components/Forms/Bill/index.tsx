import { Statistic, Row, Col, Button, notification } from 'antd';
import {AreaChartOutlined, ClockCircleOutlined, CommentOutlined, LikeOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {get} from "../../../../api"
import {useRouter} from "next/router";
import {CasperClient, CasperServiceByJsonRPC, CLPublicKey, DeployUtil, Keys} from "casper-js-sdk";
import {useEffect, useState} from "react";
import {pay} from "../../../../store/actions/pay";


interface IUserData {
    name: string,
    lastName: string,
    email: string,
    company: string,
    password: string,
    passwordConf: string,
}

const signerErrors = [
    //иногда расширение ломается и перестает вызываться. Помогает только переустановка
    {
        message: 'Cannot read properties of undefined (reading \'error\')',
        title: 'Signer error',
        desc: 'Please reinstall Signer'
    },
    //если не введен пароль в vault
    {
        message: 'Please unlock the Signer to read key',
        title: 'Signer in locked',
        desc: 'Please unlock the Signer to read key'
    },
    //если расширение не скачано
    {
        message: 'Please download CasperLabs Signer',
        title: 'Signer not found',
        desc: 'Please download CasperLabs Signer'
    },
    //при отклонении запроса на транзакцию
    {
        message: 'User Cancelled Signing',
        title: 'Payment cancelled',
        desc: 'You are cancelled payment in Signer'
    },
    //при несозданном хранилище, при несозданном аккаунте, при disconnect
    {
        message: 'Please connect to the Signer to read key',
        title: 'Signer vault not found',
        desc: 'Please connect to the Signer to read key'
    },
    //Возникает если пользователь не совершал транзакций либо имеет пустой счет
    {
        message: 'state query failed: ValueNotFound("Failed to find base key at path: Key',
        title: 'User not found',
        desc: 'Try to find a top-up on your wallet and repeat the action'
    },
    //Ключ, который выдает само расширение неправильный
    {
        message: 'Invalid public key',
        title: 'Invalid public key',
        desc: 'Invalid public key'
    },
    //Возникает при отключении интернета
    {
        message: 'Failed to fetch',
        title: 'Network error',
        desc: 'Check your internet connection'
    },
    //Возникает при отключении интернета
    {
        message: 'Network error',
        title: 'Network error',
        desc: 'Check your internet connection'
    },
]

const Bill = () => {

    const dispatch = useDispatch();
    const router = useRouter()
    const [balance, setBalance] = useState('')

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

    const billInfo = useSelector((state) => state.payment.data);

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

        const to = wallet;
        const amountStr = amount.toString()
        const amountNum = amount;
        const id = 287821;
        const gasPrice = 1;
        const ttl = 1800000;
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
            await dispatch(pay({
                txHash: signed,
                status: "processing",
                amount,
                payment: billInfo.id,
                updated: new Date(),
                sender: publicKeyHex,
                receiver: to
            }))
        } catch (e: any) {
            showError(e.message)
        }

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

        setBalance(balance.toString())
    };

    const {
        id,
        datetime,
        amount,
        comment,
        wallet,
        status,
        payment
    } = billInfo
    const date = new Date(datetime).toDateString()

    return (
        <>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Your Balance" value={balance || 'Sign in Signer to get balance'} prefix={<AreaChartOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Recipient" value={wallet} prefix={<AreaChartOutlined />} />
            </Col>
            <Col  span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Datetime" value={date} prefix={<ClockCircleOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Amount" value={amount} prefix={<AreaChartOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 20px 20px', background: 'white'}}>
                <Statistic title="Comment" value={comment} prefix={<CommentOutlined />} />
            </Col>

            {   status !== 'Paid' ?
                (!balance ?
                <Button onClick={singInSigner} style={{margin: '20px 0 0 0'}} type="primary" size={'large'}>
                    Sign in Signer
                </Button>
                :
                <Button onClick={deploy} style={{margin: '20px 0 0 0'}} type="primary" size={'large'}>
                    Pay
                </Button>) : null
            }

            <Button onClick={() => router.back()} style={{margin: '20px 0 0 20px'}} type="primary" size={'large'}>
                Back
            </Button>
        </>
    );
};


export default Bill