import { Statistic, Row, Col, Button } from 'antd';
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

const initialState = {
    datetime: '',
    amount: '',
    comment: '',
}

const Bill = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    const [balance, setBalance] = useState('')

    const payments = useSelector((state) => state.payment.data);

    const apiUrl = 'https://node-clarity-testnet.make.services/rpc';
    const casperService = new CasperServiceByJsonRPC(apiUrl);
    const casperClient = new CasperClient(apiUrl);

    const singInSigner = async () => {
        await window.casperlabsHelper.requestConnection().then(r => getBalance().catch(e => console.log(e)));
    };

    const deploy = async ()=> {

        const to = wallet;
        const amountStr = amount.toString()
        const amountNum = amount;
        const id = 287821;
        const gasPrice = 1;
        const ttl = 1800000;
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
        const signed = await casperClient.putDeploy(deployObject.val);



        await dispatch(pay({
            txHash: signed,
            status: "processing",
            amount,
            updated: new Date(),
            sender: publicKeyHex,
            receiver: to
        }))

    };

    console.log(new Date())

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
        wallet
    } = payments
    const date = new Date(datetime).toDateString()

    console.log({balance})

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
            {
                !balance ?
                <Button onClick={singInSigner} style={{margin: '20px 0 0 0'}} type="primary" size={'large'}>
                    Sign in Signer
                </Button>
                :
                <Button onClick={deploy} style={{margin: '20px 0 0 0'}} type="primary" size={'large'}>
                    Pay
                </Button>
            }
        </>
    );
};


export default Bill