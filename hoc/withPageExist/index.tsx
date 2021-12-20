// @ts-nocheck
import React, {ReactElement, useEffect, useState} from "react";
import Router from "next/router";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import Login from "../../src/components/Forms/Login";
import {useSelector} from "react-redux";
import AuthPage from "../../pages/login";
import {useRouter} from "next/router";
import {Spin} from "antd";
import Error from "next/error";


const WithPageExist = ({children, error, data}: any) => {

    if (error && !data.id) return <Error title={'Not exist'} statusCode={500}/>

    if(!data.id) return <Spin style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh'}}/>

    return children
}

export default WithPageExist