import React, {ReactElement, useEffect, useState} from "react";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import Login from "../../src/components/Forms/Login";
import {useSelector} from "react-redux";
import AuthPage from "../../pages/login";
import {useRouter} from "next/router";
import {Spin} from "antd";


const WithAuth = ({children}: any) => {

    const localToken = localStorage.getItem('token')
    const router = useRouter()


    if (!localToken) {
        router.push('/login').then(r => console.log('token not found'))
        return <Spin style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh'}}/>
    }

    return children
}

export default WithAuth