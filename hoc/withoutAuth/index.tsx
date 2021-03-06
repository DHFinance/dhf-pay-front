// @ts-nocheck
import React, {ReactElement, useEffect, useState} from "react";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import Login from "../../src/components/Forms/Login";
import {useDispatch, useSelector} from "react-redux";
import AuthPage from "../../pages/login";
import {useRouter} from "next/router";
import {Spin} from "antd";
import {reAuth} from "../../store/actions/auth";


/**
 *
 * @param children {JSX}
 * @description hoc for authorization pages (login, restore, registration), where authorized users should not enter. If the user has a token in localstorage - redirects him to the start page
 */
const WithoutAuth = ({children}: any) => {

    const localToken = localStorage.getItem('token')
    const router = useRouter()

    const auth = useSelector((state) => state.auth);

    if (!!localToken) {
        router.push('/').then(r => console.log('first you need to log out'))
        return <Spin style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh'}}/>
    }

    return children
}

export default WithoutAuth