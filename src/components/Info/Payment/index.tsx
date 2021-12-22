// @ts-nocheck
import { Statistic, Row, Col, Button } from 'antd';
import {AreaChartOutlined, ClockCircleOutlined, CommentOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {useRouter} from "next/router";
import {getStore} from "../../../../store/actions/store";
import {getPayment} from "../../../../store/actions/payment";
import WithPageExist from "../../../../hoc/withPageExist";


const Payment = () => {

    const payments = useSelector((state) => state.payment.data);
    const paymentsError = useSelector((state) => state.payment.error);
    const user = useSelector((state) => state.auth.data);
    const dispatch = useDispatch()

    const {
        id,
        datetime,
        amount,
        comment,
        wallet
    } = payments

    const router = useRouter()

    const toBill = () => {
        router.push({
            pathname: `/bill/${id}`
        })
    }

    useEffect(() => {
        if (router.query.slug) {
            dispatch(getPayment(router.query.slug))
        }

    }, [])

    const date = new Date(datetime).toDateString()

    return (
        <WithPageExist error={paymentsError} data={payments}>
            <Col  span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Datetime" value={date} prefix={<ClockCircleOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Amount" value={amount} prefix={<AreaChartOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 20px 20px', background: 'white'}}>
                <Statistic title="Comment" value={comment || 'none'} prefix={<CommentOutlined />} />
            </Col>
            {payments.status !== 'Paid' && user?.role !== 'admin' ?
            <Button type="primary" onClick={toBill} style={{margin: '20px 20px 0 0'}} className="login-form-button">
                Create bill
            </Button>
            : null
            }
            <Button onClick={() => router.back()} style={{margin: '20px 0 0 0'}} type="primary">
                Back
            </Button>
        </WithPageExist>
    );
};


export default Payment