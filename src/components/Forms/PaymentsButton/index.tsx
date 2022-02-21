// @ts-nocheck
import React, {useEffect, useState, useRef} from 'react';
import {Button, Form, Input, Select,message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import WithLoadingData from "../../../../hoc/withLoadingData";
const { Option } = Select;
import {getUserStores} from "../../../../store/actions/stores";
import {getPayments, getUserPayments} from "../../../../store/actions/payments";
import {CheckOutlined} from "@ant-design/icons";
import {addPayment} from "../../../../store/actions/payment";
import {buttons} from "../../../data/buttonsBuilder";
import {CSPRtoUSD} from "../../../../utils/CSPRtoUSD";
import {getCourse} from "../../../../store/actions/course";

const initialState = {
    amount: '',
    comment: '',
    type: null,
    text: "",
};

const Buttons = () => {
    const [currentStore, setCurrentStore] = useState(null);
    const [choosenButton, setChoosenButton] = useState(0);

    const [htmlCode, setHtmlCode] = useState("");
    const [visibleHtmlCode, setVisibleHtmlCode] = useState(false);
    const [paymentId, setPaymentId] = useState(false);
    const [payment, setPayment] = useState(initialState);

    const stores = useSelector((state) => state.storesData.data);
    const storesLoaded = useSelector((state) => state.storesData.isChanged);
    const user = useSelector((state) => state.auth.data);
    const currentPayment = useSelector((state) => state.payment.data);
    const course = useSelector((state) => state.course.data.usd);

    /**
     * @description function to load data
     */
    useEffect(() => {
        /** @description for customer get stores created by a specific user */
        if (user?.role === 'customer') {
            dispatch(getUserStores(user.id))
        }
        /** @description usd to cspr exchange rate */
        dispatch(getCourse())
    }, []);

    /** @description name of current domain */
    const domain = location.host;

    const [form] = Form.useForm();
    const activeStores = stores.filter((store) => store.apiKey && !store.blocked)
    const dispatch = useDispatch();

    const validate = async (nameField) => {
      await form.validateFields([nameField])
    }

    /**
     * @param {string} value - store api key
     * @description set current store and get payments of a selected store
     */
    function handleChange(value) {
        const current = stores.filter((store) => store.apiKey === value)[0]
        setCurrentStore(current);
        dispatch(getUserPayments(value));
        validate("store");
    }

    /**
     * @description copying html code of button payment
     */
    const copyTextToClipboard = () => {
        const context = document.getElementById("textArea");
        context.select();
        document.execCommand("copy");
        message.success('HTML-code copied');
    }
    const validateAmount = (rule: any, value: any, callback: any) => {
        if (value < 2.5) {
            callback("Must be at least 2.5 cspr");
        } else {
            callback();
        }
    };

    const validateKind = (rule: any, value: any, callback: any) => {
      if (choosenButton === 0) {
          callback("Please select a button style");
      } else{
        callback()
      }
  };

    /**
     * @description save the payment and return the response
     */
    const handleOk = async () => {
        /** @description validations of fields form */
        await form.validateFields()
            .then(async (res) => {
                try {
                    await dispatch(addPayment(payment, currentStore.apiKey))
                    if (user?.role === 'admin') {
                        await dispatch(getPayments())
                    }
                    if (user?.role === 'customer') {
                        await dispatch(getUserPayments(currentStore.apiKey))
                    }
                    setPaymentId(true);
                    message.success('Payment was added');
                    /** @description generating and showing html code of button payment */
                    handleGenerateHTML();
                    setVisibleHtmlCode(true);
                } catch (e) {
                    console.log(e, 'registration error')
                }
            })
            .catch(async (err) => console.log(err))
    };

    /**
     * @param {string} field - name of property payment object
     * @description set values to the payment object
     */
    const onChangePayment = (field: string) => (e: any) => {
        let value = e.target.value;
        /** @description for property amount convert into the right shape */
        if (field === "amount") value = value * 1000000000;
        setPayment({
            ...payment,
            [field]: value,
        })
        validate(field);
    };

    /**
     * @description selecting of style button
     * @param {object} itemButton - object of selected button
     */
    const handleChooseButton = (itemButton) => {
        setChoosenButton(itemButton.id);
        setPayment(({
            ...payment,
            type: itemButton.id,
        }))
        form.setFieldsValue({kind:itemButton.id});
    }

    /** @description generating html code of button payment */
    const handleGenerateHTML = () => {
        const buttonHTML = document.getElementById("resultButton");
        setHtmlCode(buttonHTML.outerHTML);
    }

    const handleResetForm = (event) => {
        event.preventDefault();
        form.resetFields();
        setPaymentId(false);
        setVisibleHtmlCode(false);
        setChoosenButton(0);
    }

    return <WithLoadingData data={storesLoaded ?? null}>
        { !activeStores.length && user.role !== 'admin' &&
        <p>
            Create a store to be able to create payments
        </p>
        }
        {user.role !== 'admin' && !!activeStores.length &&
        <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            validateTrigger={'onSubmit'}
            form={form}
            className="payment-buttons"
            style={{padding: '0 50px', marginTop: 64}}
        >
            <Form.Item
                label="Name"
                name="text"
                rules={[{ required: true, message: 'Please input button name!' }]}
            >
                <Input type="text" onChange={onChangePayment('text')}/>
            </Form.Item>
            <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: 'Please input amount!' },{ validator: validateAmount }]}
            >
                <Input type='number' onChange={onChangePayment('amount')}/>
            </Form.Item>
            <Form.Item
                label="Amount USD"
            >
                {CSPRtoUSD(payment.amount, course)}$
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
                label="Comment"
                name="comment"
            >
                <Input.TextArea autoSize onChange={onChangePayment('comment')}/>
            </Form.Item>
            <Form.Item
                label="Button type"
                name="kind"
                rules={[{ validator: validateKind }]}
            >
                <div className="kind" style={{display: "flex", gap: "30px"}}>
                    {buttons.map((item, index)=>(
                        <div key={item.id} value={item} className="kind-div" style={{display: "flex", alignItems: "center", gap: "10px"}}>
                            <Button type="primary" value={item} style={choosenButton === item.id ? {...item.style, border:"2px #52c41a solid"} : {...item.style}}
                                    onClick={()=> handleChooseButton(item)} className="login-form-button">
                                {item.name}
                            </Button>
                            <CheckOutlined style={{margin: '0 0 20px 0',color:"#52c41a",fontWeight:"900", display:`${choosenButton === item.id ? "block":"none"}`}} />
                        </div>
                    ))}
                </div>
            </Form.Item>
            {
                paymentId ?
                    <Form.Item
                        label="Result"
                        name="description"
                    >
                        <a rel='noreferrer' href={`http://${domain}/bill/${currentPayment.id}`} id="resultButton" target="_blank"
                           style={payment.type ? {...buttons[choosenButton-1].style,appearance: "button",textDecoration: "none", color:"white", padding:"5px 15px"} : undefined}
                        >
                            {payment.text}
                        </a>
                    </Form.Item> : null
            }

            <Form.Item
                label="HTML"
                name="htmlCode"
                style={{
                    display: `${visibleHtmlCode? "": "none"}`
                }}
            >
                <div style={{
                    display:"flex",
                    flexDirection:"column"
                }}>
                    <Input.TextArea id="textArea"
                                    value={htmlCode}
                                    readOnly autoSize
                                    style={{marginBottom: '20px', resize: 'none', cursor:"not-allowed"}}/>
                    <div style={{
                        display:"flex",
                        justifyContent:"center",
                    }}>
                        <Button type="primary" onClick={copyTextToClipboard}>Copy html</Button>
                    </div>
                </div>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 11, span: 12 }}>
                <div style={{display: "flex", gap: "10px", marginTop:"20px"}}>
                    {
                        paymentId ?
                            <Button type="primary" style={{padding: "5px 20px"}} htmlType="button" className="login-form-button" onClick={(e) => handleResetForm(e)}>
                                Reset
                            </Button>
                            :
                            <Button type="primary" style={{padding: "5px 20px"}} htmlType="submit" className="login-form-button" onClick={handleOk}>
                                Save
                            </Button>
                    }
                </div>
            </Form.Item>
        </Form>
        }
    </WithLoadingData>
};

export default Buttons;
