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


/**
 *
 * @param children {JSX}
 * @param error {string} - error while requesting an object from the server
 * @param data {object} - data of the object that will be loaded from the server, the existence of which needs to be checked
 * @description used on specific post pages (/user/[slug] store/[slug]). If the slug contains an entry id that does not exist in the database, redirects the user to the start page
 */
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