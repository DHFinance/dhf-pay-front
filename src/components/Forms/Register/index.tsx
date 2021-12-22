// @ts-nocheck
import { Form, Input, Button, Checkbox } from 'antd';
import {useEffect, useState} from "react";
import "antd/dist/antd.css";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {clearAuth, clearAuthError, postLogin, postRegistration, postVerify} from "../../../../store/actions/auth";
import {useRouter} from "next/router";
import {getFormFields} from "../../../../utils/getFormFields";

interface IUserData {
    name: string,
    lastName: string,
    email: string,
    company: string,
    password: string,
    passwordConf: string,
}

const initialState = {
    name: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    passwordConf: '',
}

const CreateUserForm = ({auth, setEmail}) => {

    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const [userData, setUserData] = useState<IUserData>(initialState)

    const onUpdateData = (field: string) => (e: any) => {
        const value = e.target.value
        setUserData({
            ...userData,
            [field]: value,
        })
    }

    const validatePassword = (rule: any, value: any, callback: any) => {
        if (value && value !== userData.password) {
            callback("Passwords do not match");
        } else {
            callback();
        }
    };

    const fieldError = auth?.error?.response?.data?.message
    const errorMessage = auth?.error?.response?.data?.error

    useEffect(() => {
        if (fieldError) {
            form.validateFields(["email"])
        }
    }, [fieldError])

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
                    await dispatch(postRegistration(userData))
                    setEmail(userData.email)
                } catch (e) {
                    console.log(e, 'registration error')
                }
            })
            .catch(async (err) => console.log(err))
    }

    return <Form
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
            <Input onChange={onUpdateData('name')}/>
        </Form.Item>

        <Form.Item
            label="Last name"
            name="lastName"
            rules={[{ required: true, message: 'Please input your last name!' }]}
        >
            <Input onChange={onUpdateData('lastName')}/>
        </Form.Item>
        <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }, {type: 'email',  message: 'Please enter a valid email!'}, {validator: validateEmail}]}
        >
            <Input onChange={onUpdateData('email')}/>
        </Form.Item>

        <Form.Item
            label="Company"
            name="company"
            rules={[{ required: true, message: 'Please input your company name!' }]}
        >
            <Input onChange={onUpdateData('company')}/>
        </Form.Item>
        <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter password!' }]}
        >
            <Input.Password type="password" onChange={onUpdateData('password')}/>
        </Form.Item>
        <Form.Item
            label="PasswordConf"
            name="passwordConf"
            rules={[{ required: true, message: 'Please confirm password!' }, { validator: validatePassword }]}
        >
            <Input.Password onChange={onUpdateData('passwordConf')}/>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
}

const VerifyForm = ({email}) => {

    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const router = useRouter();

    const goStartPage = () => {
        router.push('/')
    }

    const fieldError = auth?.error?.response?.data?.message
    const errorMessage = auth?.error?.response?.data?.error

    const [code, setCode] = useState('')

    const onVerify = async () => {
        await form.validateFields()
            .then(async (res) => {
                try {
                    await dispatch(postVerify(email, code, goStartPage))
                } catch (e) {
                    console.log(e, 'registration error')
                }
            })
            .catch(async (err) => console.log(err))
    }

    const onChangeCode = (e) => setCode(e.target.value)

    const validateCode = (rule: any, value: any, callback: any) => {
        if (fieldError === 'code') {
            callback(errorMessage);
            dispatch(clearAuthError())
        } else {
            callback();
        }
    };

    return <Form
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
            rules={[{ required: true, message: 'Please input your code!' }, { min: 8, max: 8, message: 'The code must be 8 digits!' }, {validator: validateCode}]}
        >
            <Input name="code" onChange={onChangeCode}/>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
}

const Register = () => {

    const auth = useSelector((state) => state.auth);
    const [email, setEmail] = useState('')

    if (!auth.verify) {
        return <CreateUserForm auth={auth} setEmail={setEmail}/>
    } else {
        return <VerifyForm auth={auth} email={email}/>
    }

};

export default Register