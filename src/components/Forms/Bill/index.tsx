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

    const senderKey = Keys.Ed25519.new();
    const recipientKey = Keys.Ed25519.new();
    const networkName = 'test-network';
    const paymentAmount = 10000000000000;
    const transferAmount = 10;
    const ID = 34;

    console.log({senderKey, recipientKey})

    let deployParams = new DeployUtil.DeployParams(
        CLPublicKey.fromHex('010eee1078c906942cf609cf01b73dfc6551bc79bb3ab06ee80f912a641bbdd666'),
        networkName
    );

    let session = DeployUtil.ExecutableDeployItem.newTransfer(
        transferAmount,
        CLPublicKey.fromHex('016ecf8a64f9b341d7805d6bc5041bc42139544561f07a7df5a1d660d8f2619fee'),
        undefined,
        ID
    );

    let payment = DeployUtil.standardPayment(paymentAmount);
    let deploy = DeployUtil.makeDeploy(deployParams, session, payment);

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