import { Button, Form, Input } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useTypedDispatch } from '../../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { postRegistration } from '../../../../store/slices/auth/asyncThunks/postRegistration';
import { setUpdateCaptcha } from '../../../../store/slices/user/user.slice';
import { ReCaptchaComponent } from '../../../ReCaptcha/ReCaptcha';

interface IUserData {
  name: string;
  lastName: string;
  email: string;
  company: string;
  password: string;
  passwordConf: string;
  captchaToken: string;
}

const initialState = {
  name: '',
  lastName: '',
  email: '',
  company: '',
  password: '',
  passwordConf: '',
  captchaToken: '',
};

interface Props {
  setEmail: (email: string) => void;
}

const regExpPass = new RegExp(
  '(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}',
);

const CreateUserForm: FC<Props> = ({ setEmail }) => {
  const captchaToken = useTypedSelector((state) => state.user.captchaToken);
  let authError = useTypedSelector((state) => state.auth.status.error);

  const [userData, setUserData] = useState<IUserData>(initialState);

  const dispatch = useTypedDispatch();
  const [form] = Form.useForm();

  /**
   * @description set data into user object
   * @param {string} field - name of field form
   */
  const onUpdateData = (field: string) => (e: any) => {
    const value = e.target.value;
    setUserData({
      ...userData,
      [field]: value,
    });
  };

  /**
   * @description checking that the entered two passwords match
   * @param {object} rule - object field password
   * @param {any} value - value password
   * @param {function} callback - executed after successful validation of the password field
   */
  const validatePasswordCharter = (rule: any, value: any, callback: any) => {
    if (!regExpPass.test(userData.password)) {
      callback(
        'The password must contain at least 8 characters, 1 special character, 1 uppercase character',
      );
    }
    callback();
  };

  const validatePassword = (rule: any, value: any, callback: any) => {
    /** @description if password field hasn't empty, but does not match the first password return a callback with an error  */
    if (value && value !== userData.password) {
      callback('Passwords do not match');
    } else {
      callback();
    }
  };

  /**
   * @description validations of field email
   */
  useEffect(() => {
    if (authError) {
      form.validateFields(['email']);
      form.validateFields(['password']);
    }
  }, [authError, userData.password]);

  useEffect(() => {
    if (authError) {
      authError = '';
    }
  }, [userData.password]);

  useEffect(() => {
    setUserData({
      ...userData,
      captchaToken: captchaToken,
    });
  }, [captchaToken]);

  /**
   * @description validations of email
   * @param {object} rule - object field email
   * @param {any} value - value email
   * @param {function} callback - executed after successful validation of the email field
   */
  const validateEmail = (rule: any, value: any, callback: any) => {
    /** @description if email field has error return error message */
    if (authError === 'email') {
      callback();
    } else {
      callback();
    }
  };

  /**
   * @description registration of user
   */
  const onSubmit = async () => {
    /** @description validations of fields form */
    try {
      await form.validateFields();
      try {
        await dispatch(postRegistration(userData));
        dispatch(
          setUpdateCaptcha(
            `register ${Math.floor(100000 + Math.random() * 900000)}`,
          ),
        );
        setEmail(userData.email);
      } catch (e) {
        dispatch(
          setUpdateCaptcha(
            `register ${Math.floor(100000 + Math.random() * 900000)}`,
          ),
        );
        console.log(e, 'registration error');
      }
    } catch (error) {
      dispatch(
        setUpdateCaptcha(
          `register ${Math.floor(100000 + Math.random() * 900000)}`,
        ),
      );
      console.log(error);
    }
  };

  return (
    <Form
      style={{ padding: '0 50px', marginTop: 64 }}
      name="basic"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      initialValues={{ remember: true }}
      onSubmitCapture={onSubmit}
      form={form}
      validateTrigger={'onSubmit'}
      autoComplete="off"
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input your name!' }]}
      >
        <Input onChange={onUpdateData('name')} />
      </Form.Item>

      <Form.Item
        label="Last name"
        name="lastName"
        rules={[{ required: true, message: 'Please input your last name!' }]}
      >
        <Input onChange={onUpdateData('lastName')} />
      </Form.Item>
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
        <Input onChange={onUpdateData('email')} />
      </Form.Item>
      <Form.Item label="Company" name="company">
        <Input onChange={onUpdateData('company')} />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: 'Please enter password!' },
          { validator: validatePasswordCharter },
        ]}
      >
        <Input.Password type="password" onChange={onUpdateData('password')} />
      </Form.Item>
      <Form.Item
        label="Confirm Password"
        name="passwordConf"
        rules={[
          { required: true, message: 'Please confirm password!' },
          { validator: validatePassword },
        ]}
      >
        <Input.Password onChange={onUpdateData('passwordConf')} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
        <ReCaptchaComponent />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
        <Button type="primary" htmlType="submit" disabled={!captchaToken}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export { CreateUserForm };
