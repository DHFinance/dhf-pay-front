// @ts-nocheck
import React, {ReactElement, useEffect, useState} from "react";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import Login from "../../src/components/Forms/Login";
import {useDispatch, useSelector} from "react-redux";
import AuthPage from "../../pages/login";
import {useRouter} from "next/router";
import {Spin} from "antd";
import {reAuth} from "../../store/actions/auth";
import {wrapper} from "../../store/store";
import {data} from "browserslist";


const WithAuth = ({children}: any) => {

    const localToken = localStorage.getItem('token')
    const router = useRouter()

    const auth = useSelector((state) => state.auth);

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(reAuth(localToken))
    }, [])

    if (!localToken) {
        router.push('/login').then(r => console.log('token not found'))
        return <Spin style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh'}}/>
    }
    if (!(auth.error || auth.data.token)) {
        return <Spin style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh'}}/>
    }
    return children
}

export default wrapper.withRedux(WithAuth)