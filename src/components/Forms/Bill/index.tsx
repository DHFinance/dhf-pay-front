import { Statistic, Row, Col, Button } from 'antd';
import {AreaChartOutlined, ClockCircleOutlined, CommentOutlined, LikeOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {get} from "../../../../api"
import {useRouter} from "next/router";
import {CasperClient, CasperServiceByJsonRPC, CLPublicKey, DeployUtil, Keys} from "casper-js-sdk";
const casperClientSDK = require("casper-js-sdk");
import {useEffect, useState} from "react";
import {wrapper} from "../../../../store/store";
import {getPayments} from "../../../../store/actions/payments";

interface IUserData {
    name: string,
    lastName: string,
    email: string,
    company: string,
    password: string,
    passwordConf: string,
}

const initialState = {
    datetime: '',
    amount: '',
    comment: '',
}

const Bill = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    const [billData, setBillData] = useState(initialState)
    const [connected, setConnected] = useState(false)
    const [balance, setBalance] = useState('')

    const payments = useSelector((state) => state.payment.data);

    const {
        id,
        datetime,
        amount,
        comment,
        wallet
    } = payments

    const date = new Date(datetime).toDateString()

    const apiUrl = 'https://event-store-api-clarity-testnet.make.services/';
    const casperService = new CasperServiceByJsonRPC(apiUrl);
    const casperClient = new CasperClient(apiUrl);



    //приватный ключ отправителя
    const fromPriv = 'b5e556e1f42582a9e3083ec44c9b6aa467a679d89f74cf1ceb5b35c0bf044620';
    //публичный ключ получателя
    const toAddr = '016ecf8a64f9b341d7805d6bc5041bc42139544561f07a7df5a1d660d8f2619fee';

    let privUintArray = casperClientSDK.decodeBase64(fromPriv);
    const networkName = 'test-network';
    const paymentAmount = 10000000000000;
    const transferAmount = 10;
    const ID = 34;
    let privKey = casperClientSDK.Keys.Ed25519.parsePrivateKey(privUintArray);
    let pubKey = casperClientSDK.Keys.Ed25519.privateToPublicKey(privKey);
    let fromKeyPair = casperClientSDK.Keys.Ed25519.parseKeyPair(pubKey, privKey);
    const toPubKey = casperClientSDK.CLPublicKey.fromHex(toAddr);

    let deployParams = new DeployUtil.DeployParams(
        fromKeyPair.publicKey,
        networkName,
        1,
        18000,
    );

    let session = DeployUtil.ExecutableDeployItem.newTransfer(
        transferAmount,
        toPubKey,
        undefined,
        ID
    );

    let payment = DeployUtil.standardPayment(paymentAmount);
    let deploy = DeployUtil.makeDeploy(deployParams, session, payment);

    deploy = DeployUtil.signDeploy(deploy, fromKeyPair);

    let transferInfo = DeployUtil.deployToJson(deploy);




    const onCasperConnect = async () => await window?.casperlabsHelper?.requestConnection().then(async () => {
        await window.casperlabsHelper.isConnected().then(res => setConnected(res)).then()
    });
    const onCasperDisconnect = async () => await window?.casperlabsHelper?.disconnectFromSite();

    async function getConnectedState() {
        await window.casperlabsHelper.isConnected().then(res => {
            console.log(res, 'onGetConnection')
            setConnected(res)
        })
    }

    async function getBalanceState() {
        const publicKey = await window.casperlabsHelper.getActivePublicKey();
        const latestBlock = await casperService.getLatestBlockInfo();
        const root = await casperService.getStateRootHash(latestBlock.block.hash);

        console.log({publicKey, latestBlock, root, casperClientSDK: CLPublicKey})

        console.log({
            root,
            publicKey,
            hex: CLPublicKey.fromHex(publicKey)
        })

        const balanceUref = await casperService.getAccountBalanceUrefByPublicKey(
            root,
            CLPublicKey.fromHex(publicKey)
        ).then(r => console.log(r)).catch(e => console.log('error', e))
        console.log({balanceUref})
        // const bill = await casperService.getAccountBalance(
        //     latestBlock.block.header.state_root_hash,
        //     balanceUref
        // );

        console.log(balanceUref)

        // setBalance(bill.toString())
    }


    // useEffect(() => {
    //     get('/payment/1')
    // }, [])

    return (
        <>
            <Col  span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Datetime" value={date} prefix={<ClockCircleOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Amount" value={amount} prefix={<AreaChartOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 20px 20px', background: 'white'}}>
                <Statistic title="Comment" value={comment} prefix={<CommentOutlined />} />
            </Col>

            <Button onClick={() => console.log(transferInfo)} style={{margin: '20px 0 0 0'}} type="primary" size={'large'}>
                Transfer
            </Button>
            {/*{*/}
            {/*    !connected ?*/}
            {/*        <Button onClick={onCasperConnect} style={{margin: '20px 0 0 0'}} type="primary" size={'large'}>*/}
            {/*            Sign in Signer*/}
            {/*        </Button>*/}
            {/*        :*/}
            {/*        <Button onClick={getBalanceState} style={{margin: '20px 0 0 0'}} type="primary" size={'large'}>*/}
            {/*            Update*/}
            {/*        </Button>*/}
            {/*}*/}
        </>
    );
};


export default Bill