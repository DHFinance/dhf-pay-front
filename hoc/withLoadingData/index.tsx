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
 * @param data {any} - load data the component is waiting for
 * @param children {JSX}
 * @constructor data hoc will not render the component until data is loaded
 */
const WithLoadingData = ({data, children}) => {


    if (!data) {
        return <Spin style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'}}/>
    }

    return children
}

export default WithLoadingData