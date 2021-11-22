import { Statistic, Row, Col, Button } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import {CasperClient,CasperServiceByJsonRPC, PublicKey, DeployUtil } from "casper-js-sdk";
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
    name: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    passwordConf: '',
}

const Balance = () => {

    const dispatch = useDispatch();
    const router = useRouter();
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

        console.log({publicKey, latestBlock, root})

        const balanceUref = await casperService.getAccountBalanceUrefByPublicKey(
            root,
            CLPublicKey.fromHex(publicKey.toString())
        )
        console.log({balanceUref})
        const balance = await casperService.getAccountBalance(
            latestBlock.block.header.state_root_hash,
            balanceUref
        );

        console.log(balance.toString())

        setBalance(balance.toString())
        console.log({publicKey, latestBlock})
    }

    useEffect(() => {
        console.log(connected, 'onUseEffect')
    }, [connected])

    return (
        <>
            <Col  span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Feedback" value={1128} prefix={<LikeOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 20px 20px', background: 'white'}}>
                <Statistic title="Unmerged" value={93} suffix="/ 100" />
            </Col>
            <Col span={24} style={{padding: '20px 0 20px 20px', background: 'white'}}>
                <Statistic title="Unmerged" value={93} suffix="/ 100" />
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

export default Balance