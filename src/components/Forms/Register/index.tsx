import { Button, Form, Input } from 'antd';
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
  const auth = useTypedSelector((state) => state.auth);
  const captcha = useTypedSelector((state) => state.user.captchaToken);

  const dispatch = useTypedDispatch();
  const [form] = Form.useForm();

  const fieldError = auth?.status.error;

  const [code, setCode] = useState('');

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

  /**
   * @description validations field code
   */
  useEffect(() => {
    if (fieldError) {
      form.validateFields(['code']);
    }
  }, [auth]);

  /**
   * @description validations of email
   * @param {object} rule - object field code
   * @param {any} value - value code
   * @param {function} callback - executed after successful validation of the code field
   */
  const validateCode = (rule: any, value: any, callback: any) => {
    /** @description if code field has error return error message */
    if (fieldError === 'code') {
      callback(fieldError);
      dispatch(clearAuthError());
    } else {
      callback();
    }
  };

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
          { validator: validateCode },
        ]}
      >
        <Input name="code" onChange={onChangeCode} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
        <ReCaptchaComponent />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
        <Button disabled={!captcha} type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

const Register = () => {
  const auth = useTypedSelector((state) => state.auth);
  const [email, setEmail] = useState('');

  if (!auth.verify) {
    return <CreateUserForm setEmail={setEmail} />;
  } else {
    return <VerifyForm email={email} />;
  }
};

export default Register;
