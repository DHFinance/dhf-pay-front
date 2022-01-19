import React from 'react';
import {Form, Input, Modal} from "antd";

const InvoicesBuilder = () => {
    return (
        <Modal title="Add payment" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                autoComplete="off"
                validateTrigger={'onSubmit'}
                form={form}
            >
                <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[{ required: true, message: 'Please input amount!' }, { validator: validateAmount }]}
                >
                    <Input type='number' onChange={onChangePayment('amount')}/>
                </Form.Item>
                <Form.Item
                    label="Comment"
                    name="comment"
                >
                    <Input.TextArea onChange={onChangePayment('comment')}/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default InvoicesBuilder;
