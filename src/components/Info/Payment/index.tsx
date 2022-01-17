// @ts-nocheck
import { Statistic, Row, Col, Button } from 'antd';
import Script from 'next/script'
import {
    AreaChartOutlined,
    ClockCircleOutlined,
    CommentOutlined,
    FacebookFilled,
    TwitterSquareFilled
} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import {getPayment} from "../../../../store/actions/payment";
import WithPageExist from "../../../../hoc/withPageExist";
import {getUserTransactions} from "../../../../store/actions/transacrions";
import Title from "antd/es/typography/Title";


const Payment = () => {

    const payments = useSelector((state) => state.payment.data);
    const transactions = useSelector((state) => state.transactions.data);
    const paymentsError = useSelector((state) => state.payment.error);
    const user = useSelector((state) => state.auth.data);
    const dispatch = useDispatch()

    const {
        id,
        datetime,
        amount,
        comment,
        status,
        wallet
    } = payments

    const filterTransactions = transactions.filter((transaction) => transaction.payment.id === id)

    const router = useRouter()

    useEffect(() => {
        if (router.query.slug) {
            dispatch(getPayment(router.query.slug))

        }

    }, [])

    useEffect(() => {
        if (payments?.store) {
            dispatch(getUserTransactions(payments?.store?.apiKey))
        }
    }, [payments])


    const date = new Date(datetime).toDateString()

    const domain = location.origin

    function copy() {
        const copyLink = document.getElementById("link");

        copyLink.select();

        document.execCommand("copy");
    }

    return (
        <WithPageExist error={paymentsError} data={payments}>
            <Col  span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Datetime" value={date} prefix={<ClockCircleOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Amount" value={amount} prefix={<AreaChartOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Status" value={status?.replace('_', ' ') || 'none'} prefix={<AreaChartOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0px 20px', background: 'white'}}>
                <Statistic title="Comment" value={comment || 'none'} prefix={<CommentOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0px 20px', background: 'white'}}>
                <div style={{
                    paddingBottom: '4px',
                    color: 'rgba(0, 0, 0, 0.45)',
                    fontSize: '14px',
                }}>Link</div>
            </Col>
            <input type="text" value={`${domain}/bill/${id}`} id="link" style={{
                position: 'absolute'
            }}/>
            <Col span={24} style={{padding: '0px 0 20px 20px', background: 'white'}}>
                {payments.status !== 'Paid' && user?.role !== 'admin' && filterTransactions[filterTransactions.length - 1]?.status !== 'success' && filterTransactions[filterTransactions.length - 1]?.status !== 'processing' ?
                    <Link href={`/bill/${id}`}>
                        <a style={{
                            fontSize: '24px',
                        }}
                           target="_blank" rel="noreferrer">
                            <CommentOutlined
                                style={{
                                    marginRight: '4px',
                                    color: 'rgba(0, 0, 0, 0.85)',
                                }}
                            />
                            {`${domain}/bill/${id}`}
                        </a>
                    </Link>
                    : null
                }
            </Col>

            <Col span={24} style={{padding: '0px 0 0px 0px'}}>
                <Button onClick={() => copy()} style={{margin: '20px 20px 0 0'}} type="primary">
                    Copy link
                </Button>
                <Button onClick={() => router.back()} style={{margin: '20px 0 0 0'}} type="primary">
                    Back
                </Button>
            </Col>

            <Col span={24} style={{padding: '20px 0 0px 0px'}}>
                {
                    (domain && id) && <>
                        <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button"
                           data-text="Casper payment:"
                           data-url={`${domain}/bill/${id}`}
                           data-show-count="false">Tweet</a>
                        <Script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></Script>
                    </>
                }
            </Col>

            <Col span={24} style={{padding: '0px 0 0px 0px'}}>
                <Button size={'small'}
                        style={{margin: '0px 0 0 0px',
                            // position: 'relative',
                            // height: '20px',
                            // boxSizing: 'border-box',
                            // padding: '1px 12px 1px 12px',
                            // backgroundColor: '#1d9bf0',
                            // color: '#fff',
                            // borderRadius: '9999px',
                            // fontWeight: 500,
                            // cursor: 'pointer',
                        }} type="primary">
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${location}`} style={{color: 'white'}} rel="noreferrer" data-text={`Casper payment: ${domain}/bill/${id}`} target="_blank">
                        <FacebookFilled style={{margin: '0px 3px 0px 0px'}}/>
                        Share on Facebook
                    </a>
                </Button>

            </Col>



        </WithPageExist>
    );
};


export default Payment