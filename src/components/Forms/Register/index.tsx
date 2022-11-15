import { Button, Form, Input, Typography } from 'antd';
import 'antd/dist/antd.css';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { postVerify } from '../../../store/slices/auth/asyncThunks/postVerify';
import { clearAuthError } from '../../../store/slices/auth/auth.slice';
import { setUpdateCaptcha } from '../../../store/slices/user/user.slice';
import { ReCaptchaComponent } from '../../ReCaptcha/ReCaptcha';
import { CreateUserForm } from './components/CreateUserForm';

const VerifyForm = ({ email }: { email: string }) => {
  const authStatus = useTypedSelector((state) => state.auth.status);
  const captcha = useTypedSelector((state) => state.user.captchaToken);
  const [code, setCode] = useState('');
  
  const dispatch = useTypedDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(clearAuthError());
  }, []);

  /**
   * @description verification of user by code
   */
  const onVerify = async () => {
    try {
      await form.validateFields();
      try {
        await dispatch(
          postVerify({
            email,
            code,
            captcha,
          }),
        );
        dispatch(
          setUpdateCaptcha(
            `verify user ${Math.floor(100000 + Math.random() * 900000)}`,
          ),
        );
      } catch (e) {
        dispatch(
          setUpdateCaptcha(
            `verify user ${Math.floor(100000 + Math.random() * 900000)}`,
          ),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeCode = (e: ChangeEvent<HTMLInputElement>) =>
    setCode(e.target.value);

  return (
    <Form
      style={{ padding: '0 50px', marginTop: 64 }}
      name="restore"
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      initialValues={{ remember: true }}
      onSubmitCapture={onVerify}
      validateTrigger={'onSubmit'}
      autoComplete="off"
    >
      <Typography
        style={{
          fontSize: '20px',
          textAlign: 'center',
          margin: '20px',
          color: 'red',
        }}
      >
        {authStatus.error}
      </Typography>
      <Form.Item
        label="Code"
        name="code"
        rules={[
          { required: true, message: 'Please input your code!' },
          {
            min: 8,
            max: 8,
            message: 'The code must be 8 digits!',
          },
        ]}
      >
        <Input name="code" onChange={onChangeCode} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
        <ReCaptchaComponent />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
        <Button
          disabled={!captcha || authStatus.isLoading}
          type="primary"
          htmlType="submit"
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

const Register = () => {
  const auth = useTypedSelector((state) => state.auth);
  const [email, setEmail] = useState('');

  const dispatch = useTypedDispatch();

  useEffect(() => {
    dispatch(clearAuthError());
  }, []);

  if (!auth.verify) {
    return <CreateUserForm setEmail={setEmail} />;
  } else {
    return <VerifyForm email={email} />;
  }
};

export default Register;
