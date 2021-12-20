// @ts-nocheck
import {Statistic, Row, Col, Button, Form, Input, Modal} from 'antd';
import {AreaChartOutlined, ClockCircleOutlined, CommentOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getStores} from "../../../../store/actions/stores";
import {editStore, getStore} from "../../../../store/actions/store";
import WithLoadingData from "../../../../hoc/withLoadingData";
import {addPayment} from "../../../../store/actions/payment";
import {getPayments} from "../../../../store/actions/payments";
import {blockUser, getUser} from "../../../../store/actions/user";
import Title from "antd/lib/typography/Title";
import WithPageExist from "../../../../hoc/withPageExist";


const User = () => {

    const user = useSelector((state) => state.user.data);
    const userError = useSelector((state) => state.user);
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        dispatch(getUser(router.query.slug))
    }, [])

    const {
        id,
        name,
        lastName,
        email,
        company,
        blocked,
        role
    } = user

    console.log({user})

    const onChangeBlock = (block) => () => {
        dispatch(blockUser(id, block))
    }

    return (
        <WithPageExist error={userError} data={user}><WithLoadingData data={user.id}>
            {blocked ?
                <Title style={{width: '100%', textAlign: 'center', color: 'red'}}>Blocked</Title>
                :
                null
            }
            <Col  span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="name" value={name} prefix={<ClockCircleOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0 20px', background: 'white'}}>
                <Statistic title="Last name" value={lastName} prefix={<AreaChartOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 0px 20px', background: 'white'}}>
                <Statistic title="email" value={email} prefix={<CommentOutlined />} />
            </Col>
            <Col span={24} style={{padding: '20px 0 20px 20px', background: 'white'}}>
                <Statistic title="company" value={company} prefix={<CommentOutlined />} />
            </Col>
            {
                role !== 'admin' && <>
                    {blocked ?
                        <Button type="primary" onClick={onChangeBlock(false)} style={{margin: '20px 0 0 0'}} className="login-form-button">
                            Unblock
                        </Button>
                        :
                        <Button danger type="primary" onClick={onChangeBlock(true)} style={{margin: '20px 0 0 0'}} className="login-form-button">
                            Block
                        </Button>
                    }
                </>
            }
        </WithLoadingData></WithPageExist>
    );
};


export default User