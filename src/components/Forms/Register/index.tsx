// @ts-nocheck
import { Form, Input, Button, Checkbox } from 'antd';
import {useEffect, useState} from "react";
import "antd/dist/antd.css";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {clearAuth, postLogin, postRegistration} from "../../../../store/actions/auth";
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

const Register = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    const [form] = Form.useForm();
    const goStartPage = () => {
        router.push('/')
    }

    const [valid, setValid] = useState(true)
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


    const auth = useSelector((state) => state.auth);

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
                    await dispatch(postRegistration(userData, goStartPage))
                } catch (e) {
                    console.log(e, 'registration error')
                }
                console.log(res, 'valid')
            })
            .catch(async (err) => setValid(false))
    }

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
    );
};

export default Register