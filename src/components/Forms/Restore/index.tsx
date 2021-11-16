import { Form, Input, Button, Checkbox } from 'antd';
import {Dispatch, SetStateAction, useState} from "react";
import "antd/dist/antd.css";
import axios from "axios";

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

interface IRestoreForm {
    setForm: Dispatch<SetStateAction<EnumForms>>,
    setCode?: Dispatch<SetStateAction<string>>,
    code?: string
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

const EmailForm = ({setForm}: IRestoreForm) => {

    const [userData, setUserData] = useState<IRestoreDataEmail>(initialStateEmail)

    const onUpdateData = (field: string) => (e: any) => {
        const value = e.target.value
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
            await axios.post('http://localhost:3001/api/auth/send-code', userData).then((res) => setForm(EnumForms.CODE));
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
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
        >
            <Input onChange={onUpdateData('email')}/>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
}

const CodeForm = ({setForm, setCode}: IRestoreForm) => {

    const [userData, setUserData] = useState<IRestoreDataCode>(initialStateCode)

    const onUpdateData = (field: string) => (e: any) => {
        const value = e.target.value
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
            await axios.post('http://localhost:3001/api/auth/check-code', userData).then((res) => {

                if (setCode) {
                    setForm(EnumForms.PASSWORD)
                    setCode(res.data.code)
                } else {
                    throw new Error()
                }
            });
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
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Please input your code!' }]}
        >
            <Input onChange={onUpdateData('code')}/>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
}

const PasswordForm = ({setForm, code}: IRestoreForm) => {

    const [userData, setUserData] = useState<IRestoreDataPassword>(initialStatePassword)

    const onUpdateData = (field: string) => (e: any) => {
        const value = e.target.value
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
            await axios.post('http://localhost:3001/api/auth/reset-pwd', {password: userData.password, code}).then((res) => {
                setForm(EnumForms.EMAIL)
                alert('Password changed')
            });
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
            <Input onChange={onUpdateData('password')}/>
        </Form.Item>

        <Form.Item
            label="Password confirm"
            name="passwordConf"
            rules={[{ required: true, message: 'Please confirm your password!' }]}
        >
            <Input onChange={onUpdateData('passwordConf')}/>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
}

const Restore = () => {

    const [form, setForm] = useState<EnumForms>(EnumForms.EMAIL)
    //temp
    const [code, setCode] = useState<string>('')

    switch (form) {
        case EnumForms.CODE: return <CodeForm setForm={setForm} setCode={setCode}/>
        case EnumForms.EMAIL: return <EmailForm setForm={setForm}/>
        case EnumForms.PASSWORD: return <PasswordForm setForm={setForm} code={code}/>
        default: return <EmailForm setForm={setForm}/>
    }
};

export default Restore