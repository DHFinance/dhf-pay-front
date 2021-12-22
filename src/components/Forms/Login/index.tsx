// @ts-nocheck
import {useEffect, useRef, useState} from "react";
import "antd/dist/antd.css";
import { Form, Input, Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {clearAuth, postLogin, postRestoreStepEmail} from "../../../../store/actions/auth";
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

    const auth = useSelector((state) => state.auth);

    const fieldError = auth?.error?.response?.data?.message
    const errorMessage = auth?.error?.response?.data?.error

    const onUpdateData = (e: any) => {
        const value = e.target.value
        const field = e.target.name
        setUserData({
            ...userData,
            [field]: value,
        })
    }

    useEffect(() => {
        if (fieldError && userData.email !== '' && userData.password !== '') {
            form.validateFields(["email", 'password'])
        }
    }, [fieldError])

    const validatePassword = (rule: any, value: any, callback: any) => {
        if (fieldError === 'password') {
            callback(errorMessage);
            dispatch(clearAuth())
        } else {
            callback();
        }
    };

    const validateEmail = (rule: any, value: any, callback: any) => {
        if (fieldError === 'email') {
            callback(errorMessage);
            dispatch(clearAuth())
        } else {
            callback();
        }
    };

    const onSubmit = async () => {
        await form.validateFields()
            .then(async (res) => {
                try {
                    await dispatch(postLogin(userData, goStartPage))
                } catch (e) {
                    console.log(e, 'registration error')
                }
            })
            .catch(async (err) => console.log(err))
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
            validateTrigger={'onSubmit'}
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