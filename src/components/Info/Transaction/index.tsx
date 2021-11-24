import { Statistic, Row, Col, Button } from 'antd';
import {AreaChartOutlined, ClockCircleOutlined, CommentOutlined, LikeOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {get} from "../../../../api"
import {useRouter} from "next/router";
import {CasperClient,CasperServiceByJsonRPC, PublicKey, DeployUtil } from "casper-js-sdk";
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
    txHash: '',
    status: '',
    updated: '',
    wallet: '',
}

const Transaction = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    const [billData, setBillData] = useState(initialState)
    const [connected, setConnected] = useState(false)
    const [balance, setBalance] = useState('')

    const payments = useSelector((state) => state.payment.data);

    const {
        txHash,
        status,
        updated,
        wallet,
    } = payments

    const date = new Date(updated).toDateString()

    console.log(payments)

    return (
        <>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="TxHash" value={txHash} prefix={<CommentOutlined />} />
            </Col>
            <Col  span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Updated" value={date} prefix={<ClockCircleOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Wallet" value={wallet} prefix={<AreaChartOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 20px 20px', background: 'white'}}>
                <Statistic title="Status" value={status} prefix={<CommentOutlined />} />
            </Col>

        </>
    );
};


export default Transaction