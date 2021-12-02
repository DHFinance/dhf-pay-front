// @ts-nocheck
import {useState} from "react";
import "antd/dist/antd.css";
import { Form, Input, Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {useDispatch} from "react-redux";
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

    const onUpdateData = (e: any) => {
        const value = e.target.value
        const field = e.target.name
        setUserData({
            ...userData,
            [field]: value,
        })
    }

    const onSubmit = async () => {
        try {
            await dispatch(postLogin(userData, goStartPage))
        } catch (e) {
            console.log(e, 'registration error')
        }
    }

    return (
        <Form
            style={{ padding: '0 50px', marginTop: 64 }}
            name="login"
            initialValues={{ remember: true }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
            onSubmitCapture={onSubmit}
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
            >
                <Input name="email" value={userData.email} prefix={<UserOutlined className="site-form-item-icon" />} onChange={onUpdateData} placeholder="Email" />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    value={userData.password}
                    name="password"
                    type="password"
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