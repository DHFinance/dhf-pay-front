// @ts-nocheck
import {useEffect, useRef, useState} from "react";
import "antd/dist/antd.css";
import { Form, Input, Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {postLogin} from "../../../../store/actions/auth";
import Link from "next/link";
import {useRouter} from "next/router";

interface IUserData {
    email: string,
    password: string,
}

const initialState = {
    email: '',
    password: '',
}

const Login = () => {

    const router = useRouter();
    const goStartPage = () => {
      router.push('/')
    }
    const dispatch = useDispatch();

    const [userData, setUserData] = useState<IUserData>(initialState)
    const [validate, setValidate] = useState(false)

    const auth = useSelector((state) => state.auth);

    const fieldError = auth?.error?.response?.data?.message
    const errorMessage = auth?.error?.response?.data?.error

    const onUpdateData = (e: any) => {
        const value = e.target.value
        const field = e.target.name
        setValidate(false)
        setUserData({
            ...userData,
            [field]: value,
        })
    }

    useEffect(() => {
        if (fieldError) {
            form.validateFields(["email", 'password'])
        }
    }, [fieldError])

    const validatePassword = (rule: any, value: any, callback: any) => {
        if (fieldError === 'password' && validate) {
            callback(errorMessage);
        } else {
            callback();
        }
    };

    const validateEmail = (rule: any, value: any, callback: any) => {
        if (fieldError === 'email' && validate) {
            callback(errorMessage);
        } else {
            callback();
        }
    };

    const onSubmit = async () => {
        setValidate(true)
        const emailValid = form.getFieldError("email").length === 0 || (form.getFieldError("email").includes(errorMessage) && form.getFieldError("email").length === 1)
        const passwordValid = form.getFieldError("password").length === 0 || (form.getFieldError("password").includes(errorMessage) && form.getFieldError("password").length === 1)
        if (passwordValid && emailValid) {
            try {
                await dispatch(postLogin(userData, goStartPage))
            } catch (e) {
                console.log(e, 'registration error')
            }
        }
    }

    const [form] = Form.useForm();

    return (
        <Form
            style={{ padding: '0 50px', marginTop: 64 }}
            name="login"
            initialValues={{ remember: true }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
            onSubmitCapture={onSubmit}
            form={form}
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }, {type: 'email',  message: 'Please enter a valid email!'}, {validator: validateEmail}]}
            >
                <Input name="email" value={userData.email} prefix={<UserOutlined className="site-form-item-icon" />} onChange={onUpdateData} placeholder="Email" />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }, {validator: validatePassword}]}
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
                <Link href={'/restore'}>
                    Forgot password
                </Link>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                </Button>
                <span style={{ padding: '0 10px'}}>or</span>
                <Link href={'/register'}>
                    register now!
                </Link>
            </Form.Item>
        </Form>
    );
};

export default Login