import {
  AreaChartOutlined,
  ClockCircleOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import { Button, Col, Statistic } from 'antd';
import Title from 'antd/lib/typography/Title';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { UserRole } from '../../../modules/user/enums/userRole.enum';
import { blockUser } from '../../../store/slices/user/asyncThunks/blockUser';
import { getUser } from '../../../store/slices/user/asyncThunks/getUser';
import { Loader } from '../../Loader';

const User = () => {
  const user = useTypedSelector((state) => state.user.data);
  const userStatus = useTypedSelector((state) => state.user.status);

  const dispatch = useTypedDispatch();
  const router = useRouter();
  
  useEffect(() => {
    if (router.query.slug) {
      dispatch(getUser(router.query.slug as string));
    }
  }, []);

  function onChangeBlock(block: boolean) {
    dispatch(
      blockUser({
        id: user!.id,
        blocked: block,
      }),
    );
  }
  
  if (userStatus.error) {
    router.push('/');
  }
  
  if (userStatus.isLoading || user === null) {
    return <Loader />;
  }

  return (
    <>
      {user.blocked ? (
        <Title style={{ width: '100%', textAlign: 'center', color: 'red' }}>
          Blocked
        </Title>
      ) : null}
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic title="name" value={user.name} prefix={<ClockCircleOutlined />} />
      </Col>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic
          title="Last name"
          value={user.lastName}
          prefix={<AreaChartOutlined />}
        />
      </Col>
      <Col
        span={24}
        style={{ padding: '20px 0 0px 20px', background: 'white' }}
      >
        <Statistic title="email" value={user.email} prefix={<CommentOutlined />} />
      </Col>
      <Col
        span={24}
        style={{ padding: '20px 0 20px 20px', background: 'white' }}
      >
        <Statistic
          title="company"
          value={user.company}
          prefix={<CommentOutlined />}
        />
      </Col>
      {user.role !== UserRole.Admin && (
        <>
          {user.blocked ? (
            <Button
              type="primary"
              onClick={() => onChangeBlock(false)}
              style={{ margin: '20px 20px 0 0' }}
              className="login-form-button"
            >
              Unblock
            </Button>
          ) : (
            <Button
              danger
              type="primary"
              onClick={() => onChangeBlock(true)}
              style={{ margin: '20px 20px 0 0' }}
              className="login-form-button"
            >
              Block
            </Button>
          )}
        </>
      )}
      <Button
        onClick={() => router.back()}
        style={{ margin: '20px 0 0 0' }}
        type="primary"
        size={'large'}
      >
        Back
      </Button>
    </>
  );
};

export default User;
