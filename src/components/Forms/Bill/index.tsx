import { Statistic, Row, Col, Button } from 'antd';
import {AreaChartOutlined, ClockCircleOutlined, CommentOutlined, LikeOutlined} from '@ant-design/icons';
import {useDispatch} from "react-redux";
import {get} from "../../../../api"
import {useRouter} from "next/router";
import {CasperClient,CasperServiceByJsonRPC, PublicKey, DeployUtil } from "casper-js-sdk";
const casperClientSDK = require("casper-js-sdk");
import {useEffect, useState} from "react";

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

    const apiUrl = '/rpc';
    const casperService = new CasperServiceByJsonRPC(apiUrl);
    const casperClient = new CasperClient(apiUrl);

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

        console.log({publicKey, latestBlock, root, casperClientSDK: casperClientSDK.CLTypedAndToBytes})

        console.log({
            root,
            publicKey,
            hex: casperClientSDK.PublicKey.fromHex(publicKey)
        })

        const balanceUref = await casperService.getAccountBalanceUrefByPublicKey(
            root,
            casperClientSDK.PublicKey.fromHex(publicKey)
        )
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
                <Statistic title="Datetime" value={1128} prefix={<ClockCircleOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Amount" value={93} prefix={<AreaChartOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 20px 20px', background: 'white'}}>
                <Statistic title="Comment" value={93} prefix={<CommentOutlined />} />
            </Col>

            {
                !connected ?
                    <Button onClick={onCasperConnect} style={{margin: '20px 0 0 0'}} type="primary" size={'large'}>
                        Sign in Signer
                    </Button>
                    :
                    <Button onClick={getBalanceState} style={{margin: '20px 0 0 0'}} type="primary" size={'large'}>
                        Update
                    </Button>
            }
        </>
    );
};

export default Bill