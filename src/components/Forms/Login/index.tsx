import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import 'antd/dist/antd.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { postLogin } from '../../../store/slices/auth/asyncThunks/postLogin';
import { clearAuthError } from '../../../store/slices/auth/auth.slice';
import { setUpdateCaptcha } from '../../../store/slices/user/user.slice';
import { ReCaptchaComponent } from '../../ReCaptcha/ReCaptcha';

interface IUserData {
  email: string;
  password: string;
  captchaToken: string;
}

/** @description initial state of a user object */
const initialState = {
  email: '',
  password: '',
  captchaToken: '',
};

const Login = () => {
  const authStatus = useTypedSelector((state) => state.auth.status);
  const captchaToken = useTypedSelector((state) => state.user.captchaToken);

  const [userData, setUserData] = useState<IUserData>(initialState);

  const dispatch = useTypedDispatch();
  const [form] = Form.useForm();

  /**
   * @description set data into user object
   * @param {object} e - event
   */
  const onUpdateData = (e: any) => {
    dispatch(clearAuthError());
    const value = e.target.value;
    const field = e.target.name;
    setUserData({
      ...userData,
      [field]: value,
    });
  };

  /**
   * @description authorization of user
   */
  const onSubmit = async () => {
    try {
      await form.validateFields();
      /** @description after successful authorization go to the home page */
      await dispatch(postLogin(userData));
      dispatch(
        setUpdateCaptcha(
          `login ${Math.floor(100000 + Math.random() * 900000)}`,
        ),
      );
    } catch (e) {
      dispatch(
        setUpdateCaptcha(
          `login ${Math.floor(100000 + Math.random() * 900000)}`,
        ),
      );
    }
  };

  useEffect(() => {
    setUserData({
      ...userData,
      captchaToken: captchaToken,
    });
  }, [captchaToken]);
  
  useEffect(() => {
    dispatch(clearAuthError());
  }, []);

  return (
    <Form
      style={{ padding: '0 50px', marginTop: 64 }}
      name="login"
      initialValues={{ remember: true }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      onSubmitCapture={onSubmit}
      validateTrigger={'onSubmit'}
      form={form}
    >
      <Typography style={{ fontSize: '20px', textAlign: 'center', margin: '20px', color: 'red' }}>{authStatus.error === 'email or' +
      ' password' ? 'Wrong email' +
        ' or' +
        ' password' : authStatus.error}</Typography>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          {
            type: 'email',
            message: 'Please enter a valid email!',
          },
        ]}
      >
        <Input
          name="email"
          value={userData.email}
          prefix={<UserOutlined className="site-form-item-icon" />}
          onChange={onUpdateData}
          placeholder="Email"
        />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          value={userData.password}
          name="password"
          placeholder="Password"
          onChange={onUpdateData}
        />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
        <Link href={'/restore'}>Forgot password</Link>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
        <ReCaptchaComponent />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          disabled={!captchaToken || authStatus.isLoading}
        >
          Log in
        </Button>
        <span style={{ padding: '0 10px' }}>or</span>
        <Link href={'/register'}>register now!</Link>
      </Form.Item>
    </Form>
  );
};

export default Login;
