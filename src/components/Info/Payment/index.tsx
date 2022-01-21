// @ts-nocheck
import {Statistic, Row, Col, Button, Modal, Form, Input, message} from 'antd';
import Script from 'next/script'
import {
    AreaChartOutlined,
    ClockCircleOutlined,
    CommentOutlined,
    FacebookFilled,
    TwitterSquareFilled
} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import {getPayment, sendMailBill} from "../../../../store/actions/payment";
import WithPageExist from "../../../../hoc/withPageExist";
import {getUserTransactions} from "../../../../store/actions/transacrions";
import axios from "axios";
import {CSPRtoUSD} from "../../../../utils/CSPRtoUSD";
import {buttons} from "../../../data/buttonsBuilder";


const Payment = ({isButtons}) => {
    const [htmlCode, setHtmlCode] = useState("");
    const [isVisibleHtml, setVisibleHtml] = useState(false);

    const payments = useSelector((state) => state.payment.data);
    const transactions = useSelector((state) => state.transactions.data);
    const paymentsError = useSelector((state) => state.payment.error);
    const user = useSelector((state) => state.auth.data);


    const dispatch = useDispatch()

    const [form] = Form.useForm();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [course, setCourse] = useState(null);

    useEffect(async () => {
        const courseUsd = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=casper-network&vs_currencies=usd')
        setCourse(courseUsd.data['casper-network'].usd)
    }, [])

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const {
        id,
        datetime,
        amount,
        comment,
        status,
        store,
        type,
        text,
    } = payments

    const filterTransactions = transactions.filter((transaction) => transaction.payment.id === id);
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

    const billUrl = `${domain}/bill/${id}`

    function copy() {
        const copyLink = document.getElementById("link");
        copyLink.select();
        document.execCommand("copy");
    }

    const onSubmit = async () => {
        await form.validateFields()
            .then(async (res) => {
                try {
                    await dispatch(sendMailBill(id, userData.email, billUrl))
                    setIsModalVisible(false);
                } catch (e) {
                    console.log(e, 'registration error')
                }
            })
            .catch(async (err) => console.log(err))
    }

    const [userData, setUserData] = useState({
        email: ''
    })

    const onUpdateData = (e: any) => {
        const value = e.target.value
        const field = e.target.name
        setUserData({
            ...userData,
            [field]: value,
        })
    }

    const copyTextToClipboard = () => {
        const context = document.getElementById("textArea");
        context.select();
        document.execCommand("copy");
        message.success('HTML-code copied');
    }

    const handleGenerateHTML = () => {
        const buttonHTML = document.getElementById("resultButton");
        setVisibleHtml(true);
        setHtmlCode(buttonHTML.outerHTML);
    }

    const receiverEmail = userData.email
    return (
        <WithPageExist error={paymentsError} data={payments}>
            <Modal title="Create a letter" visible={isModalVisible} onOk={onSubmit} onCancel={handleCancel}>
                <table border="0" cellPadding="0" cellSpacing="0" className="body">
                    <tr>
                        <td>&nbsp;</td>
                        <td className="container">
                            <div className="content">
                                <table className="main">
                                    <tr>
                                        <td className="wrapper">
                                            <table border="0" cellPadding="0" cellSpacing="0">
                                                <tr>
                                                    <td>
                                                        <p style={{fontFamily: 'sans-serif', fontSize: '14px', fontWeight: 'normal', margin: 0, marginBottom: '15px'}}>Hello, {receiverEmail}</p>
                                                        <p style={{fontFamily: 'sans-serif', fontSize: '14px', fontWeight: 'normal', margin: 0, marginBottom: '15px'}}>
                                                            Payment details
                                                        </p>
                                                        <p style={{fontFamily: 'sans-serif', fontSize: '14px', fontWeight: 'normal', margin: 0, marginBottom: '15px'}}>
                                                            Store: {store?.name}
                                                        </p>
                                                        <p style={{fontFamily: 'sans-serif', fontSize: '14px', fontWeight: 'normal', margin: 0, marginBottom: '15px'}}>
                                                            Amount: {amount} CSPR (${CSPRtoUSD(amount, course)})
                                                        </p>
                                                        <p style={{fontFamily: 'sans-serif', fontSize: '14px', fontWeight: 'normal', margin: 0, marginBottom: '15px'}}>
                                                            Comment: {comment}
                                                        </p>
                                                        <a style={{fontFamily: 'sans-serif', fontSize: '14px', fontWeight: 'normal', margin: 0, marginBottom: '15px'}}
                                                           href={billUrl}>Bill page</a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                </table>
                <Form
                    style={{ padding: '0 0px', marginTop: 64 }}
                    form={form}
                    name="restore"
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 12 }}
                    initialValues={{ remember: true }}
                    onSubmitCapture={onSubmit}
                    validateTrigger={'onSubmit'}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }, {type: 'email',  message: 'Please enter a valid email!'}]}
                    >
                        <Input name="email" onChange={onUpdateData}/>
                    </Form.Item>
                </Form>
            </Modal>
            <Col  span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Datetime" value={date} prefix={<ClockCircleOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Amount" value={`${amount} CSPR ($${CSPRtoUSD(amount, course)})`} prefix={<AreaChartOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Status" value={status?.replace('_', ' ') || 'none'} prefix={<AreaChartOutlined />} />
            </Col>
            <input type="text" value={billUrl} id="link" style={{
                position: 'absolute',
                opacity: 0
            }}/>
            <Col span={24} style={{padding: '20px 0 20px 20px', background: 'white'}}>
                <Statistic title="Comment" value={comment || 'none'} prefix={<CommentOutlined />} />
            </Col>
            {payments.status !== 'Paid' && user?.role !== 'admin' && filterTransactions[filterTransactions.length - 1]?.status !== 'success' && filterTransactions[filterTransactions.length - 1]?.status !== 'processing' ?
            <>
                <Col span={24} style={{padding: '0px 0 0px 20px', background: 'white'}}>
                    <div style={{
                        paddingBottom: '4px',
                        color: 'rgba(0, 0, 0, 0.45)',
                        fontSize: '14px',
                    }}>Link</div>
                </Col>
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
                                {billUrl}
                            </a>
                        </Link>
                        : null
                    }
                </Col>
                {isButtons ?
                    <>
                        <Col span={24} style={{padding: '0px 0 0px 20px', background: 'white'}}>
                            <div style={{
                                paddingBottom: '4px',
                                color: 'rgba(0, 0, 0, 0.45)',
                                fontSize: '14px',
                            }}>Button</div>
                        </Col>
                        <Col span={24} style={{padding: '0px 0 20px 20px', background: 'white'}}>
                            <a href={`http://localhost:4000/bill/${id}`} rel='noreferrer' target="_blank" id="resultButton"
                               style={type ? {...buttons[type-1].style,appearance: "button",textDecoration: "none", color:"white", padding:"5px 15px"} : null}
                            >
                                {text}
                            </a>
                            {
                                <Col span={24} style={{padding: '0px 0 20px 0px', background: 'white'}}>

                                    {
                                        !isVisibleHtml ?
                                        <Button type="primary" style={{display: `${isVisibleHtml ? "none" : ""}` }} onClick={handleGenerateHTML}>Сгенерировать Html</Button>
                                        :
                                        <Form.Item
                                        label="HTML"
                                        name="htmlCode"
                                        style={{display: `${isVisibleHtml ? "" : "none"}` }}
                                        >
                                        <div style={{
                                        display:"flex",
                                        flexDirection:"column"
                                    }}>
                                        <Input.TextArea id="textArea"
                                        value={htmlCode}
                                        readOnly
                                        autoSize={{ minRows: 2, maxRows: 6 }}
                                        style={{marginBottom: '20px', resize: 'none', cursor:"not-allowed"}}/>
                                        <div style={{
                                        display:"flex",
                                        justifyContent:"center",
                                    }}>
                                        <Button type="primary" onClick={copyTextToClipboard}>Copy html</Button>
                                        </div>
                                        </div>
                                        </Form.Item>
                                    }
                                </Col>
                            }
                        </Col>
                    </> : null
                }

            </> : null}

            <Col span={24} style={{padding: '20px 0 0px 0px'}}>
                <Button onClick={() => showModal()} style={{margin: '0px 20px 0 0'}} type="primary">
                    Send by mail
                </Button>
                <Button onClick={() => copy()} style={{margin: '0px 20px 0 0'}} type="primary">
                    Copy link
                </Button>
                <Button onClick={() => router.back()} style={{margin: '0px 0 0 0'}} type="primary">
                    Back
                </Button>
            </Col>

            <Col span={24} style={{padding: '20px 0 0px 0px'}}>
                <Button size={'small'}
                        style={{margin: '0px 0 0 0px'
                        }} type="primary">
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${billUrl}`} style={{color: 'white'}} rel="noreferrer" data-text={`Casper payment: ${billUrl}`} target="_blank">
                        <FacebookFilled style={{margin: '0px 3px 0px 0px'}}/>
                        Share on Facebook
                    </a>
                </Button>

            </Col>

            <Col span={24} style={{padding: '10px 0 0px 0px'}}>
                {
                    (domain && id) && <>
                        <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button"
                           data-text="Casper payment:"
                           data-url={billUrl}
                           data-show-count="false">Tweet</a>
                        <Script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></Script>
                    </>
                }
            </Col>

        </WithPageExist>
    );
};


export default Payment