import { Form, Input, Button, Checkbox } from 'antd';
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import "antd/dist/antd.css";
import axios from "axios";
import {
    postRegistration,
    postRestoreStepCode,
    postRestoreStepEmail,
    postRestoreStepPassword
} from "../../../../store/actions/auth";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";

interface IRestoreDataEmail {
    email: string,
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

enum EnumForms {
    EMAIL ,
    CODE ,
    PASSWORD
}

const EmailForm = () => {

    const [userData, setUserData] = useState<IRestoreDataEmail>(initialStateEmail)
    const dispatch = useDispatch();

    const onUpdateData = (e: any) => {
        const value = e.target.value
        const field = e.target.name
        setUserData({
            ...userData,
            [field]: value,
        })
    }

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onSubmit = async () => {
        try {
            await dispatch(postRestoreStepEmail(userData))
        } catch (e) {
            console.log(e, 'registration error: Email step')
        }
    }
    return <Form
        style={{ padding: '0 50px', marginTop: 64 }}
        name="restore"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onSubmitCapture={onSubmit}
        autoComplete="off"
    >
        <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
        >
            <Input name="email" onChange={onUpdateData}/>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
}

const CodeForm = () => {

    const restoreState = useSelector((state) => state.auth);
    const [userData, setUserData] = useState<IRestoreDataCode>(initialStateCode)
    const dispatch = useDispatch();

    const onUpdateData = (e: any) => {
        const value = e.target.value
        const field = e.target.name
        setUserData({
            ...userData,
            [field]: value,
        })
    }

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onSubmit = async () => {
        try {
            await dispatch(postRestoreStepCode({...userData, email: restoreState.data.email}))
        } catch (e) {
            console.log(e, 'registration error: Code step')
        }
    }
    return <Form
        style={{ padding: '0 50px', marginTop: 64 }}
        name="restore"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onSubmitCapture={onSubmit}
        autoComplete="off"
    >
        <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Please input your code!' }]}
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

const PasswordForm = () => {

    const restoreState = useSelector((state) => state.auth);
    const [userData, setUserData] = useState<IRestoreDataPassword>(initialStatePassword)
    const router = useRouter();
    const goStartPage = () => {
        router.push('/')
    }

    const dispatch = useDispatch();

    const onUpdateData = (e: any) => {
        const value = e.target.value
        const field = e.target.name
        setUserData({
            ...userData,
            [field]: value,
        })
    }

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onSubmit = async () => {
        if (userData.password !== userData.passwordConf) {
            alert('Пароли не совпадают')
            return false
        }
        try {
            await dispatch(postRestoreStepPassword({password: userData.password, email: restoreState.data.email}, goStartPage))
        } catch (e) {
            console.log(e, 'registration error')
        }
    }
    return <Form
        style={{ padding: '0 50px', marginTop: 64 }}
        name="restore"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onSubmitCapture={onSubmit}
        autoComplete="off"
    >
        <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
        >
            <Input name='password' onChange={onUpdateData}/>
        </Form.Item>

        <Form.Item
            label="Password confirm"
            name="passwordConf"
            rules={[{ required: true, message: 'Please confirm your password!' }]}
        >
            <Input name="passwordConf" onChange={onUpdateData}/>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
}

const Restore = () => {

    const restoreState = useSelector((state) => state.auth);

    useEffect(() => {
        if (restoreState.data.resetEnabled) {
            setForm(EnumForms.PASSWORD)
        } else if (restoreState.data.email) {
            setForm(EnumForms.CODE)
        } else if (restoreState.data.token) {
            setForm(EnumForms.EMAIL)
        } else setForm(EnumForms.EMAIL)
    }, [restoreState])

    const [form, setForm] = useState<EnumForms>(EnumForms.EMAIL)

    switch (form) {
        case EnumForms.EMAIL: return <EmailForm/>
        case EnumForms.CODE: return <CodeForm/>
        case EnumForms.PASSWORD: return <PasswordForm/>
        default: return <EmailForm/>
    }
};

export default Restore