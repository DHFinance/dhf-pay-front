// @ts-nocheck
import React, {ReactElement, useEffect, useState} from "react";
import Router from "next/router";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import Login from "../../src/components/Forms/Login";
import {useDispatch, useSelector} from "react-redux";
import AuthPage from "../../pages/login";
import {useRouter} from "next/router";
import {Spin} from "antd";
import Error from "next/error";
import {clearStore} from "../../store/actions/auth";


const WithPageExist = ({children, error, data}: any) => {

    const router = useRouter()
    const dispatch = useDispatch()

    if (error && !data.id) {
        router.push('/').then(r => console.log('page not exist'))
        dispatch(clearStore())
    }

    if(!data.id) return <Spin style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh'}}/>

    return children
}

export default WithPageExist