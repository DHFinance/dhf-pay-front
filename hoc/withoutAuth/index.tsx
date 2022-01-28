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
 * @description hoc для страниц авторизации (login, restore, registration), куда не должны заходить авторизированные пользователи. Если у пользователя есть токен в localstorage - перенаправляет его на стартовую страницу
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