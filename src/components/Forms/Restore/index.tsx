// @ts-nocheck
import { Form, Input, Button, Checkbox } from 'antd';
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import "antd/dist/antd.css";
import axios from "axios";
import {
    clearAuth, clearAuthError,
    postRegistration,
    postRestoreStepCode,
    postRestoreStepEmail,
    postRestoreStepPassword,
} from "../../../../store/actions/auth";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {ReCaptchaComponent} from "../../ReCaptcha/ReCaptcha";

interface IRestoreDataEmail {
    email: string,
    captchaToken: string,
}

interface IRestoreDataCode {
    code: string,
}

interface IRestoreDataPassword {
    password: string,
    passwordConf: string,
}

const initialStateEmail = {
    email: '',
}

const initialStateCode = {
    code: '' ,
}

const initialStatePassword = {
    password: '',
    passwordConf: '',
}

/** @description steps for the reset of password */
enum EnumForms {
    EMAIL ,
    CODE ,
    PASSWORD
}

const EmailForm = ({auth}: any) => {
    const captchaToken = useSelector((state) => state.user.captchaToken);
    const [userData, setUserData] = useState<IRestoreDataEmail>(initialStateEmail)
    const dispatch = useDispatch();

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

    const fieldError = auth?.error?.response?.data?.message
    const errorMessage = auth?.error?.response?.data?.error

    const [form] = Form.useForm();

    /**
     * @description validations of field email
     */
    useEffect(() => {
        if (fieldError) {
            form.validateFields(["email"])
        }
    }, [fieldError])

    /**
     * @description validations of email
     * @param {object} rule - object field email
     * @param {any} value - value email
     * @param {function} callback - executed after successful validation of the email field
     */
    const validateEmail = (rule: any, value: any, callback: any) => {
          /** @description if email field has error return error message */
        if (fieldError === 'email') {
            callback();
            //dispatch(clearAuth())
        } else {
            callback();
        }
    };

    useEffect(() => {
        setUserData({
            ...userData,
            captchaToken: captchaToken
        })
    }, [captchaToken]);

    /**
     * @description send email of user
     */
    const onSubmit = async () => {
        /** @description validations of fields form */
        await form.validateFields()
            .then(async (res) => {
                try {
                    await dispatch(postRestoreStepEmail(userData))
                } catch (e) {
                    console.log(e, 'registration error')
                }
            })
            .catch(async (err) => console.log(err))
    }

    return <Form
        style={{ padding: '0 50px', marginTop: 64 }}
        form={form}
        name="restore"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        initialValues={{ remember: true }}
        onSubmitCapture={onSubmit}
        validateTrigger={'onSubmit'}
        autoComplete="off"
    >
        <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }, {type: 'email',  message: 'Please enter a valid email!'}, {validator: validateEmail}]}
        >
            <Input name="email" onChange={onUpdateData}/>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
            <ReCaptchaComponent />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
            <Button disabled={!captchaToken} type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
}

const CodeForm = ({auth}: any) => {

    const [userData, setUserData] = useState<IRestoreDataCode>(initialStateCode)
    const dispatch = useDispatch();

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

    const fieldError = auth?.error?.response?.data?.message
    const errorMessage = auth?.error?.response?.data?.error

    const [form] = Form.useForm();

    /**
     * @description validation of field code
     */
    useEffect(() => {
        if (fieldError) {
            form.validateFields(["code"])
        }
    }, [auth])

    /**
     * @description validation of code
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

    /**
     * @description sending code for change password
     */
    const onSubmit = async () => {
        await form.validateFields()
            .then(async (res) => {
                try {
                    await dispatch(postRestoreStepCode({...userData, email: auth.data.email}))
                } catch (e) {
                    console.log(e, 'registration error: Code step')
                }
            })
            .catch(async (err) => console.log(err))
    }
    return <Form
        style={{ padding: '0 50px', marginTop: 64 }}
        name="restore"
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        initialValues={{ remember: true }}
        onSubmitCapture={onSubmit}
        validateTrigger={'onSubmit'}
        autoComplete="off"
    >
        <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Please input your code!' }, { min: 8, max: 8, message: 'The code must be 8 digits!' }, {validator: validateCode}]}
        >
            <Input name="code" onChange={onUpdateData}/>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
}

const PasswordForm = ({auth}: any) => {

    const regExpPass = new RegExp('(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}')
    const [userData, setUserData] = useState<IRestoreDataPassword>(initialStatePassword)
    const router = useRouter();
    const goStartPage = () => {
        router.push('/')
    }

    const fieldError = auth?.error?.response?.data?.message
    const errorMessage = auth?.error?.response?.data?.error

    const dispatch = useDispatch();
    const [form] = Form.useForm();

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
     * @description saving new password
     */
    const onSubmit = async () => {
        await form.validateFields()
            .then(async (res) => {
                try {
                    /** @description after successful change password go to the home page */
                    await dispatch(postRestoreStepPassword({password: userData.password, email: auth.data.email}, goStartPage))
                } catch (e) {
                    console.log(e, 'registration error: Code step')
                }
            })
            .catch(async (err) => console.log(err))
    }
    const validatePasswordCharter = (rule: any, value: any, callback: any) => {
        if (!regExpPass.test(userData.password)) {
            callback('The password must contain at least 8 characters, 1 special character, 1 uppercase character')
        } else {
            callback();
        }
    }

    /**
     * @description checking that the entered two passwords match
     * @param {object} rule - object field password
     * @param {any} value - value password
     * @param {function} callback - executed after successful validation of the password field
     */
    const validatePassword = (rule: any, value: any, callback: any) => {
        /** @description if password field doesn't match the first password return a callback with an error  */
        if (userData.passwordConf !== userData.password) {
            callback("Passwords do not match");
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
        validateTrigger={'onSubmit'}
        onSubmitCapture={onSubmit}
        autoComplete="off"
    >
        <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter password!' }, {validator: validatePasswordCharter}]}
        >
            <Input.Password name="password" onChange={onUpdateData}/>
        </Form.Item>
        <Form.Item
            label="Confirm password"
            name="passwordConf"
            rules={[{ required: true, message: 'Please confirm password!' }, { validator: validatePassword }]}
        >
            <Input.Password name="passwordConf" onChange={onUpdateData}/>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
}

const Restore = () => {

    const auth = useSelector((state) => state.auth);

    /** @description set steps based on state auth  */
    useEffect(() => {
        if (auth.data.resetEnabled) {
            setForm(EnumForms.PASSWORD)
        } else if (auth.data.email) {
            setForm(EnumForms.CODE)
        } else if (auth.data.token) {
            setForm(EnumForms.EMAIL)
        } else setForm(EnumForms.EMAIL)
    }, [auth])

    const [form, setForm] = useState<EnumForms>(EnumForms.EMAIL)

    /** @description displaying components based on user steps
     * @param {number} form - step user, which resetting password
     * */
    switch (form) {
        case EnumForms.EMAIL: return <EmailForm auth={auth}/>
        case EnumForms.CODE: return <CodeForm auth={auth}/>
        case EnumForms.PASSWORD: return <PasswordForm auth={auth}/>
        default: return <EmailForm auth={auth}/>
    }
};

export default Restore