// @ts-nocheck
import { Statistic, Row, Col, Button } from 'antd';
import {AreaChartOutlined, ClockCircleOutlined, CommentOutlined, LikeOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {get} from "../../../../api"
import {useRouter} from "next/router";
import {CasperClient,CasperServiceByJsonRPC, PublicKey, DeployUtil } from "casper-js-sdk";
const casperClientSDK = require("casper-js-sdk");
import React, {useEffect, useState} from "react";
import {wrapper} from "../../../../store/store";
import {getPayments} from "../../../../store/actions/payments";
import Link from "next/link";
import {getPayment} from "../../../../store/actions/payment";
import {getTransaction} from "../../../../store/actions/transaction";
import WithPageExist from "../../../../hoc/withPageExist";

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

    const transaction = useSelector((state) => state.transaction.data);
    const transactionError = useSelector((state) => state.transaction.error);

    useEffect(() => {
        if (router.query.slug) {
            dispatch(getTransaction(router.query.slug))
        }
    }, [])

    const {
        txHash,
        status,
        updated,
        sender,
        receiver,
    } = transaction

    const date = new Date(updated).toDateString()

    return (
        <WithPageExist error={transactionError} data={transaction}>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="TxHash" value={txHash} prefix={<CommentOutlined />} />
            </Col>
            <Col  span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Updated" value={date} prefix={<ClockCircleOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Receiver" value={receiver} prefix={<AreaChartOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Sender" value={sender} prefix={<AreaChartOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 20px 20px', background: 'white'}}>
                <Statistic title="Status" value={status} prefix={<CommentOutlined />} />
            </Col>
            {txHash ?
                <Link href={`https://testnet.cspr.live/deploy/${txHash}`}>
                    <a target="_blank" rel="noreferrer">
                        <Button style={{margin: '20px 20px 0 0'}} type="primary">
                            Check transaction
                        </Button>
                    </a>
                </Link>
                : null
            }
            <Button onClick={() => router.back()} style={{margin: '20px 0 0 0'}} type="primary">
                Back
            </Button>
        </WithPageExist>
    );
};


export default Transaction