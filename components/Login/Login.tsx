
import { Form, Input, Button, Checkbox } from 'antd';
import styles from './login.module.scss'
import {useRouter} from "next/router";
const Login = () => {
    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const router = useRouter();

    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className={styles.Form}
            // style={{
            //     maxHeight: 500
            // }}
        >
            <Form.Item
                label="Email"
                name="username"
                rules={[{ required: true, message: 'Введите почтовый адрес' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Пароль"
                name="password"
                rules={[{ required: true, message: 'Введите пароль' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                <Checkbox>Запомнить меня</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset:8,  }}>
                <Button onClick={()=>{
                    router.push('/')
                }} style={{
                    width: '100%'
                }} type="primary" htmlType="submit">
                    Войти
                </Button>
            </Form.Item>
        </Form>
    );
};


export default Login