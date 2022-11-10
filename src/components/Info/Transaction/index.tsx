import {
  AreaChartOutlined,
  ClockCircleOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import { Button, Col, Statistic } from 'antd';

import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { CSPRtoUSD } from '../../../../utils/CSPRtoUSD';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { getCourse } from '../../../store/slices/course/asyncThunks/getCourse';
import { getTransaction } from '../../../store/slices/transaction/asyncThunks/getTransaction';
import { Loader } from '../../Loader';

const Transaction = () => {
  const transaction = useTypedSelector((state) => state.transaction.data);
  const transactionStatus = useTypedSelector(
    (state) => state.transaction.status,
  );
  const course = useTypedSelector((state) => state.course.data.usd);
  const courseStatus = useTypedSelector((state) => state.course.status);

  const dispatch = useTypedDispatch();
  const router = useRouter();

  useEffect(() => {
    if (router.query.slug) {
      dispatch(getTransaction(router.query.slug as string));
    }
    dispatch(getCourse());
  }, []);

  const date = new Date(transaction?.updated || 0).toDateString();
  
  if (transactionStatus.error || courseStatus.error) {
    router.push('/');
  }
  
  if (transactionStatus.isLoading || transaction === null || courseStatus.isLoading || course === null) {
    return <Loader />;
  }

  return (
    <>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic title="TxHash" value={transaction!.txHash} prefix={<CommentOutlined />} />
      </Col>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic
          title="Updated"
          value={date}
          prefix={<ClockCircleOutlined />}
        />
      </Col>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic
          title="Receiver"
          value={transaction.receiver}
          prefix={<AreaChartOutlined />}
        />
      </Col>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic
          title="Sender"
          value={transaction.sender}
          prefix={<AreaChartOutlined />}
        />
      </Col>
      <Col
        span={24}
        style={{ padding: '20px 0 0px 20px', background: 'white' }}
      >
        <Statistic
          title="Amount"
          value={`${+transaction.amount / 1000000000} CSPR ($${CSPRtoUSD(+transaction.amount, course)})`}
          prefix={<CommentOutlined />}
        />
      </Col>
      <Col
        span={24}
        style={{ padding: '20px 0 20px 20px', background: 'white' }}
      >
        <Statistic title="Status" value={status} prefix={<CommentOutlined />} />
      </Col>
      {transaction.txHash ? (
        <Link
          href={`https://${process.env.NEXT_PUBLIC_CASPER_NETWORK}/deploy/${transaction.txHash}`}
        >
          <a target="_blank" rel="noreferrer">
            <Button style={{ margin: '20px 20px 0 0' }} type="primary">
              Check transaction
            </Button>
          </a>
        </Link>
      ) : null}
      <Button
        onClick={() => router.back()}
        style={{ margin: '20px 0 0 0' }}
        type="primary"
      >
        Back
      </Button>
    </>
  );
};


export default Transaction;
