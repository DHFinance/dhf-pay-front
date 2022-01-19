import React, {useEffect, useState, useRef} from 'react';
import {Button, Form, Input, Select,message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import Link from "next/link";
import WithLoadingData from "../../../../hoc/withLoadingData";
const { Option } = Select;
import {getUserStores} from "../../../../store/actions/stores";
import {getUserPayments} from "../../../../store/actions/payments";
import {CheckOutlined} from "@ant-design/icons";

const columns = [
    {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'user',
        key: 'user',
        dataIndex: 'user',
    },
    {
        title: 'wallet',
        key: 'wallet',
        dataIndex: 'wallet',
        cursor: 'pointer',
    },
];

const buttons = [
    {
        id:1,
        style: {margin: '0 0 20px 0', backgroundColor:"#91d5ff"},
    },
    {
        id:2,
        style: {margin: '0 0 20px 0', backgroundColor:"#40a9ff",border: "1px black solid", borderRadius:"5px"},
    },
    {
        id:3,
        style: {margin: '0 0 20px 0', backgroundColor:"#2f54eb",border: "1px black solid"},
    }
]

const initialState = {
    description: '',
    name: '',
    url: '',
    apiKey: '',
    wallet: ''
}

const Buttons = () => {
    const [currentStore, setCurrentStore] = useState(null);
    const [choosenButton, setChoosenButton] = useState(0);
    const [button, setButton] = useState({
        name: "",
        amount: "",
        style: {},
        classname: ""
    })
    const [htmlCode, setHtmlCode] = useState("default");
    const textArea = useRef();

    const stores = useSelector((state) => state.storesData.data);
    const storesLoaded = useSelector((state) => state.storesData.isChanged);
    const user = useSelector((state) => state.auth.data);

    useEffect(() => {
        if (user?.role === 'customer') {
            dispatch(getUserStores(user.id))
        }
    }, [])

    const [form] = Form.useForm();
    const activeStores = stores.filter((store) => store.apiKey && !store.blocked)
    const dispatch = useDispatch();

    function handleChange(value) {
        const current = stores.filter((store) => store.apiKey === value)[0]
        setCurrentStore(current)
        dispatch(getUserPayments(value))
    }
    const copyTextToClipboard = () => {
        const context = document.getElementById("textArea");
        context.select();
        document.execCommand("copy");
        message.success('HTML-code copied');
    }
    const validateAmount = (rule: any, value: any, callback: any) => {
        if (value < 2500000000) {
            callback("Must be at least 2500000000");
        } else {
            callback();
        }
    };
    const handleChooseButton = (itemButton) => {
        setChoosenButton(itemButton.id);
        setButton({...button, style: itemButton.style, classname: itemButton.classname});
    }
    const handleGenerateHTML = () => {
        const buttonHTML = document.getElementById("resultButton");
        setHtmlCode(buttonHTML.outerHTML);
    }
    console.log(button);
    return <WithLoadingData data={storesLoaded ?? null}>
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            validateTrigger={'onSubmit'}
            form={form}
            className="payment-buttons"
            style={{display:"flex", flexDirection:"column", alignItems:"center"}}
        >
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input button name!' }]}
                onChange={(e)=>setButton({...button, name:e.target.value})}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: 'Please input amount!' },{ validator: validateAmount }]}
            >
                <Input />
            </Form.Item>
            {
                !!activeStores.length && <Form.Item
                    label="Store"
                    name="store"
                    rules={[{ required: true, message: 'Please select store!' }]}
                >
                    <Select defaultValue="choose store..." style={{ width: 150, marginBottom: 20 }} onChange={handleChange}>
                        {
                            activeStores.map((store) => <Option key={store.id} value={store.apiKey}>{store.name}</Option>)
                        }

                    </Select>
                </Form.Item>
            }
            <Form.Item
                label="Description"
                name="description"
            >
                <Input.TextArea />
            </Form.Item>
            <Form.Item
                label="Kind button"
                name="kind"
            >
                <div className="kind" style={{display: "flex", gap: "30px"}}>
                    {buttons.map((item, index)=>(
                        <div key={item.id} className="kind-div" style={{display: "flex", alignItems: "center", gap: "10px"}}>
                            <Button type="primary" style={choosenButton === item.id ? {...item.style, border:"2px #52c41a solid"} : {...item.style}} onClick={()=> handleChooseButton(item)} className={`login-form-button`}>
                                Button
                            </Button>
                            <CheckOutlined style={{margin: '0 0 20px 0',color:"#52c41a",fontWeight:"900", display:`${choosenButton === item.id ? "block":"none"}`}} />
                        </div>
                    ))}
                </div>
            </Form.Item>
            <Form.Item
                label="Result"
                name="description"
            >
                <Button type="primary" id="resultButton" style={button.style} className={button.classname}>{button.name}</Button>
            </Form.Item>
            <Form.Item
                label="HTML"
                name="htmlCode"
            >
                <div style={{
                    display:"flex",
                    flexDirection:"column"
                }}>
                    <Input.TextArea id="textArea"
                                    value={htmlCode}
                                    readOnly
                                    autoSize={{ minRows: 2, maxRows: 6 }}
                                    style={{marginBottom: '20px', resize: 'none', cursor:"not-allowed"}}/>
                    <div style={{
                        display:"flex",
                        justifyContent:"center",
                        gap:"20px",
                    }}>
                    <Button type="primary" onClick={handleGenerateHTML}>Generate html</Button>
                    <Button type="primary" onClick={copyTextToClipboard}>Copy html</Button>
                    </div>
                </div>
            </Form.Item>
            <div style={{display: "flex", justifyContent:"center", gap: "10px", marginTop:"20px"}}>
                <Button type="primary" style={{margin: '0 0 20px 0', width:"100px", color:"black"}} htmlType="submit" className="login-form-button" onClick={()=>form.validateFields()}>
                    Save
                </Button>
                <Link href={`/payments`}>
                    <Button type="primary" style={{margin: '0 0 20px 0', backgroundColor:"#bae7ff", width:"100px", color:"black"}} htmlType="submit" className="login-form-button" onClick={()=>form.validateFields()}>
                        Back
                    </Button>
                </Link>
            </div>
        </Form>
    </WithLoadingData>
};

export default Buttons;
