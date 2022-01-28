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
 * @param children {JSX} - the component that will be rendered after the calculations
 * @param isAdmin {boolean} - whether the page is admin only
 * @param isBuilder {boolean} - if the page is an invoices/button builder - prevents the admin from accessing it
 * @description wrapper responsible for authorization. Sends the user to the login page if they accessed the page wrapped in this hoc without being logged in.
 */
const WithAuth = ({children, isAdmin, isBuilder}: any) => {

    const localToken = localStorage.getItem('token')
    const router = useRouter()

    const auth = useSelector((state) => state.auth);

    const dispatch = useDispatch()

    /**
     * @description wrapper, makes a request to the database, checking the existence of such a user by token in localstorage
     */
    useEffect(() => {
        dispatch(reAuth(localToken))
    }, [])

    /**
     * @description if the user does not have a token in localstorage - throws it to the authorization page
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
     * @description while waiting for a response from the server, a spinner is displayed
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
     * @description if the role of an authorized user has changed to customer, and he must be an administrator, access is denied
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