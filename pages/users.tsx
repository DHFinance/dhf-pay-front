import React, {useState} from "react";
import MainLayout from "../components/Layout/Layout";
import { Typography } from 'antd';
import ObjectsList from "../components/ObjectsList/ObjectsList";

const { Title } = Typography;

const UsersPage = ()=>{

    return <MainLayout>

        <Title>Пользователи</Title>

        <ObjectsList />

    </MainLayout>
}

export default UsersPage