// @ts-nocheck
import {useEffect, useRef, useState} from "react";
import "antd/dist/antd.css";
import { Form, Input, Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {clearAuth, postLogin, postRestoreStepEmail} from "../../../../store/actions/auth";
import Link from "next/link";
import {useRouter} from "next/router";
import {ReCaptcha, ReCaptchaComponent} from "../../ReCaptcha/ReCaptcha";

interface IUserData {
    email: string,
    password: string,
    captchaToken: string,
}

/** @description initial state of a user object */
const initialState = {
    email: '',
    password: '',
    captchaToken: '',
}

const Login = () => {

    const router = useRouter();
    const goStartPage = () => {
      router.push('/')
    }
    const dispatch = useDispatch();

    const [userData, setUserData] = useState<IUserData>(initialState)

    const auth = useSelector((state) => state.auth);
    const captchaToken = useSelector((state) => state.user.captchaToken);

    const fieldError = auth?.error?.response?.data?.message
    const errorMessage = auth?.error?.response?.data?.error

    /**
     * @description set data into user object
     * @param {object} e - event
     */
    const onUpdateData = (e: any) => {
        const value = e.target.value
        const field = e.target.name
        setUserData({
            ...userData,
            [field]: value,
        })
    }

    /**
     * @description validations elements of form
     */
    useEffect(() => {
        /** @description if have no authorization errors and the form fields aren't empty */
        if (fieldError && userData.email !== '' && userData.password !== '') {
            form.validateFields(["email", 'password'])
        }
    }, [fieldError])

    /**
     * @description validations of password
     * @param {object} rule - object field password
     * @param {any} value - value password
     * @param {function} callback - executed after successful validation of the password field
     */
    const validatePassword = (rule: any, value: any, callback: any) => {
        /** @description if password field has error return error message */
        if (fieldError === 'email or password') {
            callback(errorMessage);
            dispatch(clearAuth())
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
            callback(errorMessage);
            dispatch(clearAuth())
        } else {
            callback();
        }
    };

    /**
     * @description authorization of user
     */
    const onSubmit = async () => {
        await form.validateFields()
            .then(async (res) => {
                try {
                    /** @description after successful authorization go to the home page */
                    await dispatch(postLogin(userData, goStartPage))
                } catch (e) {
                    console.log(e, 'registration error')
                }
            })
            .catch(async (err) => console.log(err))
    }

    useEffect(() => {
        setUserData({
            ...userData,
            captchaToken: captchaToken
        })
    }, [captchaToken]);

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

            <Form.Item wrapperCol={{offset: 6, span: 12}}>
                <ReCaptchaComponent />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
                <Button type="primary" htmlType="submit" className="login-form-button" disabled={!captchaToken}>
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