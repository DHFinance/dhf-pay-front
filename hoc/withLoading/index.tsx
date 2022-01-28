// @ts-nocheck
import React, {ReactElement, useEffect, useState} from "react";
import Router from "next/router";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import Login from "../../src/components/Forms/Login";
import {useSelector} from "react-redux";
import AuthPage from "../../pages/login";
import {useRouter} from "next/router";
import {Spin} from "antd";


/**
 *
 * @param children {JSX}
 * @description Nextjs creates pages before getting localstorage. This hoc prevents components from rendering until localstorage is received.
 */
const WithLoading = ({children}: any) => {

    const [storageLoaded, setStorageLoaded] = useState(false)

    useEffect(() => {
        if (localStorage) {
            setStorageLoaded(true)
        }
    }, [])

    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        const start = () => {
            setLoading(true);
        };
        const end = () => {
            setLoading(false);
        };
        Router.events.on("routeChangeStart", start);
        Router.events.on("routeChangeComplete", end);
        Router.events.on("routeChangeError", end);
        return () => {
            Router.events.off("routeChangeStart", start);
            Router.events.off("routeChangeComplete", end);
            Router.events.off("routeChangeError", end);
        };
    }, []);

    if((typeof window === 'undefined' && !storageLoaded) || loading) return <Spin style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh'}}/>

    return children
}

export default WithLoading