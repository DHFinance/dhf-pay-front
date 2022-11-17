import {
  AreaChartOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  FacebookFilled,
} from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Statistic } from 'antd';
import Title from 'antd/lib/typography/Title';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Script from 'next/script';
import React, { FC, useEffect, useState } from 'react';
import { getUsdFromCrypto } from '../../../../utils/getUsdFromCrypto';
import { buttons } from '../../../data/buttonsBuilder';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { CurrencyFabric } from '../../../modules/curriencies/currencyFabric';
import { UserRole } from '../../../modules/user/enums/userRole.enum';
import { cancelPayment } from '../../../store/slices/payment/asyncThunks/cancelPayment';
import { getPayment } from '../../../store/slices/payment/asyncThunks/getPayment';
import { sendMailBill } from '../../../store/slices/payment/asyncThunks/sendmailBill';
import { getUserTransactions } from '../../../store/slices/transactions/asyncThunks/getUserTransactions';
import { Loader } from '../../Loader';

interface Props {
  isButtons: boolean;
}

const Payment: FC<Props> = ({ isButtons }) => {
  const payment = useTypedSelector((state) => state.payment.data);
  const paymentStatus = useTypedSelector((state) => state.payment.status);
  const transactions = useTypedSelector((state) => state.transactions.data);
  const user = useTypedSelector((state) => state.auth.data);
  const course = useTypedSelector((state) => state.course.data.usd);

  const [htmlCode, setHtmlCode] = useState('');
  const [isVisibleHtml, setVisibleHtml] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
  });

  const { id, datetime, amount, comment, status, store, type, text } =
    payment ?? {};

  const dispatch = useTypedDispatch();
  const router = useRouter();
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const filterTransactions =
    transactions?.filter((transaction) => transaction.payment?.id === id) || [];

  const domain = location.host;

  useEffect(() => {
    if (router.query.slug) {
      dispatch(getPayment(router.query.slug as string));
    }
  }, []);

  useEffect(() => {
    if (!payment) {
      return;
    }
    
    const newCurrency = CurrencyFabric.create(payment.currency);
    newCurrency?.getCourse();
  }, [payment]);

  useEffect(() => {
    if (payment?.store) {
      dispatch(getUserTransactions(payment.store.apiKey));
    }
  }, [payment]);

  const date = new Date(datetime ?? 0).toDateString();

  const billUrl = `${domain}/bill/${id}`;

  /**
   * @description sending email with a link billUrl
   */
  const onSubmit = async () => {
    try {
      await form.validateFields();
      await dispatch(
        sendMailBill({
          id: id as number,
          email: userData.email,
          billUrl,
        }),
      );
      setIsModalVisible(false);
      message.success('Email sent successfully!');
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * @description set data into user object
   */
  const onUpdateData = (e: any) => {
    const value = e.target.value;
    const field = e.target.name;
    setUserData({
      ...userData,
      [field]: value,
    });
  };

  /**
   * @description copying link of payment
   */
  const copyLink = (linkHtmlId: string) => {
    const link = document.getElementById(linkHtmlId) as HTMLLinkElement;
    let textArea = document.createElement('textarea') as HTMLTextAreaElement;
    textArea.value = link.textContent as string;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('Copy');
    textArea.remove();
    message.success('Link was copied');
  };

  /**
   * @description copying html code of button payment
   */
  const copyTextToClipboard = (textAreaHtmlId: string) => {
    const context = document.getElementById(
      textAreaHtmlId,
    ) as HTMLTextAreaElement;
    context.select();
    document.execCommand('copy');
    message.success('HTML-code copied');
  };

  /** @description generating html code of button payment */
  const handleGenerateHTML = () => {
    const buttonHTML = document.getElementById(
      'resultButton',
    ) as HTMLButtonElement;
    setVisibleHtml(true);
    setHtmlCode(buttonHTML.outerHTML);
  };

  const receiverEmail = userData.email;

  function cancelCurrentPayment() {
    dispatch(cancelPayment(id as number));
  }
  
  if (paymentStatus.error) {
    return <p>Error</p>;
  }
  
  if (paymentStatus.isLoading || payment === null) {
    return <Loader />;
  }

  return (
    <>
      <Modal
        title="Create a letter"
        visible={isModalVisible}
        onOk={onSubmit}
        onCancel={handleCancel}
      >
        <table cellPadding="0" cellSpacing="0" className="body">
          <tr>
            <td>&nbsp;</td>
            <td className="container">
              <div className="content">
                <table className="main">
                  <tr>
                    <td className="wrapper">
                      <table cellPadding="0" cellSpacing="0">
                        <tr>
                          <td>
                            <p
                              style={{
                                fontFamily: 'sans-serif',
                                fontSize: '14px',
                                fontWeight: 'normal',
                                margin: 0,
                                marginBottom: '15px',
                              }}
                            >
                              Hello, {receiverEmail}
                            </p>
                            <p
                              style={{
                                fontFamily: 'sans-serif',
                                fontSize: '14px',
                                fontWeight: 'normal',
                                margin: 0,
                                marginBottom: '15px',
                              }}
                            >
                              Payment details
                            </p>
                            <p
                              style={{
                                fontFamily: 'sans-serif',
                                fontSize: '14px',
                                fontWeight: 'normal',
                                margin: 0,
                                marginBottom: '15px',
                              }}
                            >
                              Store: {store?.name}
                            </p>
                            <p
                              style={{
                                fontFamily: 'sans-serif',
                                fontSize: '14px',
                                fontWeight: 'normal',
                                margin: 0,
                                marginBottom: '15px',
                              }}
                            >
                              Amount: {+amount! / 1000000000} {payment.currency} ($
                              {course ? getUsdFromCrypto(+amount!, course) : '...'}
                              )
                            </p>
                            <p
                              style={{
                                fontFamily: 'sans-serif',
                                fontSize: '14px',
                                fontWeight: 'normal',
                                margin: 0,
                                marginBottom: '15px',
                              }}
                            >
                              Comment: {comment}
                            </p>
                            <a
                              style={{
                                fontFamily: 'sans-serif',
                                fontSize: '14px',
                                fontWeight: 'normal',
                                margin: 0,
                                marginBottom: '15px',
                              }}
                              target="_blank"
                              rel="noreferrer"
                              href={`http://${billUrl}`}
                            >
                              Bill page
                            </a>
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
            label="Buyer's Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              {
                type: 'email',
                message: 'Please enter a valid email!',
              },
            ]}
          >
            <Input name="email" onChange={onUpdateData} />
          </Form.Item>
        </Form>
      </Modal>
      {payment?.cancelled ? (
        <Title style={{ width: '100%', textAlign: 'center', color: 'red' }}>
          Canceled
        </Title>
      ) : null}
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic
          title="Datetime"
          value={date}
          prefix={<ClockCircleOutlined />}
        />
      </Col>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic
          title="Amount"
          value={`${+amount! / 1000000000} ${payment.currency} ($${course ? getUsdFromCrypto(+amount!, course) : '...'})`}
          prefix={<AreaChartOutlined />}
        />
      </Col>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic
          title="Status"
          value={status?.replace('_', ' ') || 'none'}
          prefix={<AreaChartOutlined />}
        />
      </Col>
      <Col
        span={24}
        style={{ padding: '20px 0 20px 20px', background: 'white' }}
      >
        <Statistic
          title="Comment"
          value={comment || 'none'}
          prefix={<CommentOutlined />}
        />
      </Col>
      {(isButtons || payment?.status !== 'Paid') &&
      filterTransactions[filterTransactions.length - 1]?.status !==
        'processing' ? (
        <>
          <Col
            span={24}
            style={{ padding: '0px 0 0px 20px', background: 'white' }}
          >
            <div
              style={{
                paddingBottom: '4px',
                color: 'rgba(0, 0, 0, 0.45)',
                fontSize: '14px',
              }}
            >
              Link
            </div>
          </Col>
          <Col
            span={24}
            style={{ padding: '0px 0 20px 20px', background: 'white' }}
          >
            {(isButtons || payment?.status !== 'Paid') &&
            filterTransactions[filterTransactions.length - 1]?.status !==
              'processing' ? (
              <Link href={`/bill/${id}`}>
                <a
                  id="link"
                  style={{
                    fontSize: '24px',
                  }}
                  target="_blank"
                  rel="noreferrer"
                >
                  <CommentOutlined
                    style={{
                      marginRight: '4px',
                      color: 'rgba(0, 0, 0, 0.85)',
                    }}
                  />
                  {billUrl}
                </a>
              </Link>
              ) : null}
          </Col>
          {isButtons ? (
            <>
              <Col
                span={24}
                style={{ padding: '0px 0 0px 20px', background: 'white' }}
              >
                <div
                  style={{
                    paddingBottom: '4px',
                    color: 'rgba(0, 0, 0, 0.45)',
                    fontSize: '14px',
                  }}
                >
                  Button
                </div>
              </Col>
              <Col
                span={24}
                style={{ padding: '0px 0 20px 20px', background: 'white' }}
              >
                <a
                  href={`http://${domain}/bill/${id}`}
                  rel="noreferrer"
                  target="_blank"
                  id="resultButton"
                  style={
                    type
                      ? {
                        ...buttons[type - 1].style,
                        appearance: 'button',
                        textDecoration: 'none',
                        color: 'white',
                        padding: '5px 15px',
                      }
                      : {}
                  }
                >
                  {text}
                </a>
                {
                  <Col
                    span={24}
                    style={{ padding: '0px 0 20px 0px', background: 'white' }}
                  >
                    {!isVisibleHtml ? (
                      <Button
                        type="primary"
                        style={{ display: `${isVisibleHtml ? 'none' : ''}` }}
                        onClick={handleGenerateHTML}
                      >
                        Generate Html
                      </Button>
                    ) : (
                      <Form.Item
                        label="HTML"
                        name="htmlCode"
                        style={{ display: `${isVisibleHtml ? '' : 'none'}` }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Input.TextArea
                            id="textArea"
                            value={htmlCode}
                            readOnly
                            autoSize={{ minRows: 2, maxRows: 6 }}
                            style={{
                              marginBottom: '20px',
                              resize: 'none',
                              cursor: 'not-allowed',
                            }}
                          />
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                          >
                            <Button
                              type="primary"
                              onClick={() => copyTextToClipboard('textArea')}
                            >
                              Copy html
                            </Button>
                          </div>
                        </div>
                      </Form.Item>
                    )}
                  </Col>
                }
              </Col>
            </>
          ) : null}
        </>
        ) : null}

      <Col span={24} style={{ padding: '20px 0 0px 0px' }}>
        {payment?.status === 'Paid' && !isButtons ? (
          <Button
            onClick={() => router.back()}
            style={{ margin: '0px 0 0 0' }}
            type="primary"
          >
            Back
          </Button>
        ) : (
          <div>
            <Button
              onClick={() => router.back()}
              style={{ margin: '0px 20px 0 0' }}
              type="primary"
            >
              Back
            </Button>
            {user.role !== UserRole.Admin && (
              <Button
                onClick={() => showModal()}
                style={{
                  margin: '0px' + ' 20px 0 0',
                }}
                type="primary"
              >
                Send by mail
              </Button>
            )}
            <Button
              onClick={() => copyLink('link')}
              style={{ margin: '0px 20px 0 0' }}
              type="primary"
            >
              Copy link
            </Button>
            {!payment?.cancelled ? (
              <Button
                onClick={cancelCurrentPayment}
                style={{ margin: '0px 20px 0 0' }}
                type="primary"
              >
                Cancel
              </Button>
            ) : null}
          </div>
        )}
      </Col>
      {user.role !== UserRole.Admin && (
        <Col span={24} style={{ padding: '20px 0 0px 0px' }}>
          <Button
            size={'small'}
            style={{
              margin: '0px 0 0 0px',
            }}
            type="primary"
          >
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${billUrl}`}
              style={{ color: 'white' }}
              rel="noreferrer"
              data-text={`Casper payment: ${billUrl}`}
              target="_blank"
            >
              <FacebookFilled style={{ margin: '0px 3px 0px 0px' }} />
              Share on Facebook
            </a>
          </Button>
        </Col>
      )}
      {user.role !== UserRole.Admin && (
        <Col span={24} style={{ padding: '10px 0 0px 0px' }}>
          {domain && id && (
            <>
              <a
                href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                className="twitter-share-button"
                data-text="Casper payment:"
                data-url={billUrl}
                data-show-count="false"
              >
                Tweet
              </a>
              <Script
                async
                src="https://platform.twitter.com/widgets.js"
                charSet="utf-8"
              ></Script>
            </>
          )}
        </Col>
      )}
    </>
  );
};

export default Payment;
