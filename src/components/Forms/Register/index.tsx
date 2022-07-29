// @ts-nocheck
import { Form, Input, Button, Checkbox } from 'antd';
import {useEffect, useState} from "react";
import "antd/dist/antd.css";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {clearAuth, clearAuthError, postLogin, postRegistration, postVerify} from "../../../../store/actions/auth";
import {useRouter} from "next/router";
import {getFormFields} from "../../../../utils/getFormFields";
import {ReCaptchaComponent} from "../../ReCaptcha/ReCaptcha";
import {setCaptchaToken} from "../../../../store/actions/user";

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
    captchaToken: '',
}

const CreateUserForm = ({auth, setEmail}) => {

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const captchaToken = useSelector((state) => state.user.captchaToken);

    const [userData, setUserData] = useState<IUserData>(initialState)

    /**
     * @description set data into user object
     * @param {string} field - name of field form
     * @param {object} e - event
     */
    const onUpdateData = (field: string) => (e: any) => {
        const value = e.target.value
        setUserData({
            ...userData,
            [field]: value,
        })
    }

    /**
     * @description checking that the entered two passwords match
     * @param {object} rule - object field password
     * @param {any} value - value password
     * @param {function} callback - executed after successful validation of the password field
     */
    const validatePasswordCharter = (rule: any, value: any, callback: any) => {
        if (typeof fieldError === 'object' && fieldError.join('').length > 40) {
            callback(fieldError[0]);
        } else {
            callback();
        }
    }

    const validatePassword = (rule: any, value: any, callback: any) => {
        /** @description if password field hasn't empty, but does not match the first password return a callback with an error  */
        if (value && value !== userData.password) {
            callback("Passwords do not match");
        } else {
            callback();
        }
    };

    const fieldError = auth?.error?.response?.data?.message
    const errorMessage = auth?.error?.response?.data?.error

    /**
     * @description validations of field email
     */
    useEffect(() => {
        if (fieldError) {
            form.validateFields(["email"])
            form.validateFields(['password'])
        }
    }, [fieldError])

    useEffect(() => {
        setUserData({
            ...userData,
            captchaToken: captchaToken
        })
    }, [captchaToken]);

    /**
     * @description validations of email
     * @param {object} rule - object field email
     * @param {any} value - value email
     * @param {function} callback - executed after successful validation of the email field
     */
    const validateEmail = (rule: any, value: any, callback: any) => {
         /** @description if email field has error return error message */
        if (fieldError === 'email') {
            callback(errorMessage);
            dispatch(clearAuth())
        } else {
            callback();
        }
    };

    /**
     * @description registration of user
     */
    const onSubmit = async () => {
        /** @description validations of fields form */
        await form.validateFields()
            .then(async (res) => {
                try {
                    await dispatch(postRegistration(userData))
                    setEmail(userData.email)
                    dispatch(setCaptchaToken(''));
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
        >
            <Input onChange={onUpdateData('company')}/>
        </Form.Item>
        <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter password!' }, {validator: validatePasswordCharter}]}
        >
            <Input.Password type="password" onChange={onUpdateData('password')}/>
        </Form.Item>
        <Form.Item
            label="Confirm Password"
            name="passwordConf"
            rules={[{ required: true, message: 'Please confirm password!' }, { validator: validatePassword }]}
        >
            <Input.Password onChange={onUpdateData('passwordConf')}/>
        </Form.Item>

        <Form.Item wrapperCol={{offset: 6, span: 12}}>
            <ReCaptchaComponent />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
            <Button type="primary" htmlType="submit" disabled={!captchaToken}>
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

    /**
     * @description verification of user by code
     */
    const onVerify = async () => {
        await form.validateFields()
            .then(async (res) => {
                try {
                    /** @description after successful verification go to the home page */
                    await dispatch(postVerify(email, code, goStartPage))
                } catch (e) {
                    console.log(e, 'registration error')
                }
            })
            .catch(async (err) => console.log(err))
    }

    const onChangeCode = (e) => setCode(e.target.value)

    /**
     * @description validations field code
     */
    useEffect(() => {
        if (fieldError) {
            form.validateFields(["code"])
        }
    }, [auth])

    /**
     * @description validations of email
     * @param {object} rule - object field code
     * @param {any} value - value code
     * @param {function} callback - executed after successful validation of the code field
     */
    const validateCode = (rule: any, value: any, callback: any) => {
         /** @description if code field has error return error message */
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

    /** @description if the user is not verified, display the registration form, else display the code receipt form */
    if (!auth.verify) {
        return <CreateUserForm auth={auth} setEmail={setEmail}/>
    } else {
        return <VerifyForm auth={auth} email={email}/>
    }

};

export default Register