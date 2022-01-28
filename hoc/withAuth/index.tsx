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

/**
 *
 * @param children {JSX} - компонент, который будет отрендерен после вычислений
 * @param isAdmin {boolean} - является ли страница доступной только для админа
 * @param isBuilder {boolean} - если страница является invoices/button builder - запрещает админу заходить на нее
 * @description обертка, отвечающая за авторизацию. Отправляет пользователя на страницу login если он зашел неавторизированным на страницу, обернутую в этот hoc
 */
const WithAuth = ({children, isAdmin, isBuilder}: any) => {

    const localToken = localStorage.getItem('token')
    const router = useRouter()

    const auth = useSelector((state) => state.auth);

    const dispatch = useDispatch()

    /**
     * @description обертка, делает запрос к базе данных, проверяя существование такого пользователя по токену в localstorage
     */
    useEffect(() => {
        dispatch(reAuth(localToken))
    }, [])

    /**
     * @description если у пользователя нет токена в localstorage - выбрасывает на страницу авторизации
     */
    if (!localToken) {
        router.push('/login').then(r => console.log('token not found'))
        return <Spin style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh'}}/>
    }
    /**
     * @description пока ожидается ответ с сервера выводится спинер
     */
    if (!(auth.error || auth.data.token)) {
        return <Spin style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh'}}/>
    }
    /**
     * @description если роль авторизованного пользователя сменилась на customer, а он должен быть админом - отказывает в доступе
     */
    if (isAdmin && auth.data.role === 'customer') {
        router.push('/').then(r => console.log('you are not found'))
        return <Spin style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh'}}/>
    }
    if(isBuilder){
        if (auth.data.role === "admin"){
            router.push('/').then(r => console.log('you are not found'));
        }
    }

    return children
}

export default wrapper.withRedux(WithAuth)