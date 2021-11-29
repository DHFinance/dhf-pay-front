import {NextPage} from "next";
import React from "react";
import Login from "../components/Login/Login";
import MainLayout from "../components/Layout/Layout";
import ObjectsList from "../components/ObjectsList/ObjectsList";
import {Typography} from "antd";
import SettingsForm from "../components/SettingsForm/SettingsForm";
const { Title } = Typography;


const SettingsPage = ()=>{
    return <MainLayout>

        <Title>Настройки</Title>

        <SettingsForm />

    </MainLayout>
}


export default SettingsPage

