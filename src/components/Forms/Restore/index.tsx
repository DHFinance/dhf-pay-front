import { Form, Input, Button, Checkbox } from 'antd';
import {useState} from "react";
import "antd/dist/antd.css";
import axios from "axios";

interface IRestoreData {
    email: string,
}

const initialState = {
    email: '',
}

const Restore = () => {

    const [userData, setUserData] = useState<IRestoreData>(initialState)

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
        // try {
        //     await axios.post('http://localhost:3001/api/auth/register', userData);
        // } catch (e) {
        //     console.log(e, 'registration error')
        // }
    }

    return (
        <Form
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
    );
};

export default Restore