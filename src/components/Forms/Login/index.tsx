import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import 'antd/dist/antd.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { postLogin } from '../../../store/slices/auth/asyncThunks/postLogin';
import { clearAuth } from '../../../store/slices/auth/auth.slice';
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
  const dispatch = useTypedDispatch();

  const [userData, setUserData] = useState<IUserData>(initialState);
  const [form] = Form.useForm();

  const auth = useTypedSelector((state) => state.auth);
  const captchaToken = useTypedSelector((state) => state.user.captchaToken);

  const fieldError = auth.status.error;

  /**
   * @description set data into user object
   * @param {object} e - event
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
   * @description validations elements of form
   */
  useEffect(() => {
    /** @description if have no authorization errors and the form fields aren't empty */
    if (fieldError && userData.email !== '' && userData.password !== '') {
      form.validateFields(['email', 'password']);
    }
  }, [fieldError]);

  /**
   * @description validations of password
   * @param {object} rule - object field password
   * @param {any} value - value password
   * @param {function} callback - executed after successful validation of the password field
   */
  const validatePassword = (rule: any, value: any, callback: any) => {
    /** @description if password field has error return error message */
    if (fieldError === 'email or password') {
      callback(fieldError);
      dispatch(clearAuth());
    } else {
      callback();
    }
  };

  /**
   * @description validations of email
   * @param {object} rule - object field email
   * @param {any} value - value email
   * @param {function} callback - executed after successful validation of the email field
   */
  const validateEmail = (rule: any, value: any, callback: any) => {
    if (fieldError === 'email or password') {
      callback(fieldError);
      dispatch(clearAuth());
    } else {
      callback();
    }
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
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          {
            type: 'email',
            message: 'Please enter a valid email!',
          },
          { validator: validateEmail },
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
        rules={[
          { required: true, message: 'Please input your Password!' },
          { validator: validatePassword },
        ]}
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
          disabled={!captchaToken}
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
