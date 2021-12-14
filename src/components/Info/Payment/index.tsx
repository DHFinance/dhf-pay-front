// @ts-nocheck
import { Statistic, Row, Col, Button } from 'antd';
import {AreaChartOutlined, ClockCircleOutlined, CommentOutlined} from '@ant-design/icons';
import {useSelector} from "react-redux";
import React from "react";
import {useRouter} from "next/router";


const Payment = () => {

    const payments = useSelector((state) => state.payment.data);
    const user = useSelector((state) => state.auth.data);

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

    const date = new Date(datetime).toDateString()

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
            {payments.status !== 'Paid' && user?.role !== 'admin' ?
            <Button type="primary" onClick={toBill} style={{margin: '20px 0 0 0'}} className="login-form-button">
                Create bill
            </Button>
            : null
            }
        </>
    );
};


export default Payment